import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b">
      <div className="font-medium">Admin Panel</div>
      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-600">{user?.username || user?.email || "Admin"}</div>
        <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
      </div>
    </header>
  );
}
