import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CampaignsPage from "./pages/CampaignsPage";
import CampaignDetail from "./pages/CampaignDetail";
import RecipientDetail from "./pages/RecipientDetail";
import DeliveryFeed from "./pages/DeliveryFeed";
import AdminDashboard from "./pages/AdminDashboard";
import AssignedCampaignsPage from "./pages/AssignedCampaignsPage";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Messages from "./pages/admin/Messages";
import Teams from "./pages/admin/Teams";
import Campaigns from "./pages/admin/Campaigns";
import Notifications from "./pages/admin/Notifications";
import Settings from "./pages/admin/Settings";

import {
  initFirebase,
  requestFcmToken,
  onForegroundMessage,
} from "./services/fcm";
import { toast } from "react-toastify";
import api from "./api/axios"; // <--- Naya import
import { useAuth } from "./context/AuthContext";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  // `sendFcmTokenToBackend` function ko App component ke andar define kiya hai
  const sendFcmTokenToBackend = async (fcmToken) => {
    try {
      const userToken = localStorage.getItem("token");
      if (!userToken) return;

      await api.put("/auth/fcm", { fcmToken });
      console.log("FCM token sent to backend successfully.");
    } catch (error) {
      console.error("Failed to send FCM token to backend:", error);
    }
  };

  useEffect(() => {
    // initialize FCM and foreground handler
    initFirebase();
    const vapidKey = import.meta.env.VITE_FCM_VAPID_KEY;
    if (vapidKey) {
      requestFcmToken(vapidKey).then((token) => {
        if (token) {
          console.log("FCM token", token);
          // `sendFcmTokenToBackend` ko yahan call kiya hai
          sendFcmTokenToBackend(token);
        }
      });
    }
    onForegroundMessage((payload) => {
      console.log("foreground message", payload);
      toast.info(payload.notification?.title || "Notification", {
        autoClose: 8000,
      });
    });
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* User Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <CampaignsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/campaigns"
          element={
            <PrivateRoute>
              <CampaignsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/campaigns/:id"
          element={
            <PrivateRoute>
              <CampaignDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/recipients/:id"
          element={
            <PrivateRoute>
              <RecipientDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/deliveries"
          element={
            <PrivateRoute>
              <DeliveryFeed />
            </PrivateRoute>
          }
        />
        <Route
          path="/assigned"
          element={
            <PrivateRoute>
              <AssignedCampaignsPage />
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="teams" element={<Teams />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="messages" element={<Messages />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Routes>
    </>
  );
}
