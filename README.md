# Notification Frontend (Full)

Features included:
- React + Vite + TailwindCSS
- Axios client with interceptor
- Auth context (login/register/logout)
- Campaign create/list/send
- Delivery feed and recipient action UI (accept/reject/hold)
- Admin dashboard skeleton
- Firebase Cloud Messaging support (service worker included)
- React-Toastify for toasts (clickable info on notifications)
- Dockerfile to build static site served by nginx
- Example mail template for backend use

## Setup

1. Copy `.env.example` to `.env` and set `VITE_API_BASE` and `VITE_FCM_VAPID_KEY`.
2. Install dependencies:
   npm install
3. Run dev server:
   npm run dev
4. Build for production:
   npm run build

### FCM
- Add your firebase config to `src/services/firebaseConfig.js`.
- Replace placeholders in `public/firebase-messaging-sw.js`.
- Provide `VITE_FCM_VAPID_KEY` in `.env` for requestFcmToken.

### Notes about background notifications / .exe
- Web push (FCM) will show notifications even when the browser is closed if the service worker is registered and the OS supports it.
- To create a desktop .exe wrapper later, tools like Tauri or Electron can wrap this web app and show system notifications. That step is separate; this frontend includes FCM for web push.

