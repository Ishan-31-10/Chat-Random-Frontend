import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function AssignedCampaignsPage() {
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/notifications/my"); // 👈 backend se sirf current user ke recipients
      setRecipients(res.data || []);
    } catch (e) {
      console.error("Failed to load assigned campaigns", e);
    }
    setLoading(false);
  }

  return (
    <div className="container p-4">
      <h2 className="text-xl font-semibold mb-4">Assigned to Me</h2>
      {loading ? (
        <div>Loading...</div>
      ) : recipients.length === 0 ? (
        <div>No campaigns assigned to you.</div>
      ) : (
        <div className="grid gap-2">
          {recipients.map((r) => (
            <div
              key={r._id}
              className="p-3 bg-white rounded border flex justify-between items-center"
            >
              <div>
                <div className="font-medium">{r.campaign?.title}</div>
                <div className="text-sm text-gray-600">
                  {r.campaign?.message}
                </div>
                <div className="text-xs text-gray-500">
                  Status: <strong>{r.status}</strong>
                </div>
              </div>
              <div>
                <Link
                  to={`/recipients/${r._id}`}
                  className="px-2 py-1 border rounded"
                >
                  Open
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
