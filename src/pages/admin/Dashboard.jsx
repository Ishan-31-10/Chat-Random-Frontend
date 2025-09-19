import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentNotifs, setRecentNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [{ data: s }, { data: notifs }] = await Promise.all([
          api.get("/admin/stats").catch(() => ({ data: null })),
          api.get("/admin/notifications?limit=5").catch(() => ({ data: [] })),
        ]);
        setStats(s);
        setRecentNotifs(notifs || []);
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;

  // defensive property picking (supports few naming variants)
  const totalUsers = stats?.users ?? stats?.totalUsers ?? stats?.usersCount ?? 0;
  const totalCampaigns = stats?.campaigns ?? stats?.totalCampaigns ?? 0;
  const totalRecipients = stats?.recipients ?? stats?.totalRecipients ?? 0;
  const actions = stats?.actions ?? stats?.actionsSummary ?? {};

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Total Users</div>
          <div className="text-2xl font-bold">{totalUsers}</div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Total Campaigns</div>
          <div className="text-2xl font-bold">{totalCampaigns}</div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Total Recipients</div>
          <div className="text-2xl font-bold">{totalRecipients}</div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Actions (accepted)</div>
          <div className="text-2xl font-bold">{actions?.accepted ?? 0}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Recent Notifications</h3>
          {recentNotifs.length === 0 ? (
            <div className="text-sm text-gray-500">No recent notifications</div>
          ) : (
            <ul className="space-y-2">
              {recentNotifs.map((n) => (
                <li key={n._id || n.id} className="p-2 border rounded">
                  <div className="font-medium">{n.payload?.title ?? n.payload?.message ?? "Notification"}</div>
                  <div className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Quick Analytics</h3>
          <div className="text-sm text-gray-600">Accepted: {actions?.accepted ?? 0}</div>
          <div className="text-sm text-gray-600">Rejected: {actions?.rejected ?? 0}</div>
          <div className="text-sm text-gray-600">On Hold: {actions?.hold ?? 0}</div>
          <div className="text-sm text-gray-600">Pending: {actions?.pending ?? 0}</div>
        </div>
      </div>
    </div>
  );
}
