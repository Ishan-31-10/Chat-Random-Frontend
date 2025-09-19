import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const loc = useLocation();
  const isActive = (p) => loc.pathname.startsWith(p);

  return (
    <aside className="w-64 bg-white border-r p-4">
      <div className="text-2xl font-bold mb-6">Admin</div>

      <nav className="flex flex-col gap-2">
        <Link className={`p-2 rounded ${isActive("/admin/dashboard") ? "bg-gray-100 font-semibold" : ""}`} to="/admin/dashboard">Dashboard</Link>
        <Link className={`p-2 rounded ${isActive("/admin/users") ? "bg-gray-100 font-semibold" : ""}`} to="/admin/users">Users</Link>
        <Link className={`p-2 rounded ${isActive("/admin/teams") ? "bg-gray-100 font-semibold" : ""}`} to="/admin/teams">Teams</Link>
        <Link className={`p-2 rounded ${isActive("/admin/campaigns") ? "bg-gray-100 font-semibold" : ""}`} to="/admin/campaigns">Campaigns</Link>
        <Link className={`p-2 rounded ${isActive("/admin/notifications") ? "bg-gray-100 font-semibold" : ""}`} to="/admin/notifications">Notifications</Link>
        <Link className={`p-2 rounded ${isActive("/admin/messages") ? "bg-gray-100 font-semibold" : ""}`} to="/admin/messages">Messages</Link>
      </nav>
    </aside>
  );
}
