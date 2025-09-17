// src/services/fcm.js
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { app } from './firebaseConfig'; // Ab hum sirf 'app' ko import karenge

let messaging;

export function initFirebase() {
  messaging = getMessaging(app); // 'app' variable ka use karo
}

export async function requestFcmToken(vapidKey) {
  if (!messaging) initFirebase();
  try {
    const currentToken = await getToken(messaging, { vapidKey });
    return currentToken;
  } catch (err) {
    console.error('Error retrieving FCM token', err);
    return null;
  }
}

export function onForegroundMessage(callback) {
  if (!messaging) initFirebase();
  onMessage(messaging, (payload) => {
    callback(payload);
  });
}