import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Notifications() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/notifications");
      setNotifs(data || []);
    } catch (err) {
      console.error(err);
      alert("Load failed");
    } finally {
      setLoading(false);
    }
  }

  async function markRead(id) {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifs((s) => s.filter((n) => (n._id || n.id) !== id));
    } catch (err) {
      console.error(err);
      alert("Mark read failed");
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Notifications</h1>
      <div className="bg-white rounded shadow p-4">
        {loading ? <div>Loading...</div> : notifs.length === 0 ? <div className="text-sm text-gray-500">No notifications</div> : (
          <ul className="space-y-2">
            {notifs.map((n) => (
              <li key={n._id || n.id} className="p-2 border rounded flex justify-between">
                <div>
                  <div className="font-medium">{n.payload?.title ?? n.payload?.message ?? "Notification"}</div>
                  <div className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                <div>
                  <button onClick={() => markRead(n._id || n.id)} className="px-2 py-1 bg-green-500 text-white rounded">Mark read</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
