importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

// Replace the following with your app's Firebase project configuration.
// These are placeholders; set real values in src/services/firebaseConfig.js and when initializing FCM on server.
const firebaseConfig = {
  apiKey: 'AIzaSyARGKwEMS2nJbkXUUUQ8cwXRz49VEwWdOE',
  authDomain: 'campaign-management-94481.firebaseapp.com',
  projectId: 'campaign-management-94481',
  storageBucket: 'campaign-management-94481.firebasestorage.app',
  messagingSenderId: '868971199613',
  appId: '1:868971199613:web:e933035172f780e5f34514',
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || 'Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
    data: payload.data || {},
    icon: '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const clickAction = event.notification?.data?.click_action || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(function(clientList) {
      for (const client of clientList) {
        if (client.url === clickAction && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(clickAction);
    })
  );
});
