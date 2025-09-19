import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [selected, setSelected] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", message: "", team: "", recipients: "", priority: "normal" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadList();
  }, []);

  async function loadList() {
    setLoading(true);
    try {
      // admin listing (role-aware)
      const { data } = await api.get("/admin/campaigns");
      setCampaigns(data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  }

  async function openCampaign(c) {
    setSelected(c);
    setRecipients([]);
    setAnalytics(null);
    try {
      const [rResp, aResp] = await Promise.all([
        api.get(`/admin/campaigns/${c._id}/recipients`).catch(() => ({ data: [] })),
        api.get(`/admin/campaigns/${c._id}/analytics`).catch(() => ({ data: null })),
      ]);
      setRecipients(rResp.data || []);
      setAnalytics(aResp.data || null);
    } catch (err) {
      console.error(err);
    }
  }

  async function createCampaign(e) {
    e.preventDefault();
    try {
      // backend campaigns POST is at /campaigns
      await api.post("/campaigns", form);
      setShowCreate(false);
      setForm({ title: "", message: "", team: "", recipients: "", priority: "normal" });
      loadList();
    } catch (err) {
      console.error(err);
      alert("Create campaign failed");
    }
  }

  async function actionRecipient(recipientId, action, payload = {}) {
    try {
      await api.post(`/recipients/${recipientId}/action`, { action, ...payload });
      // refresh recipients & analytics
      if (selected) openCampaign(selected);
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Campaigns</h1>
        <div>
          <button onClick={() => setShowCreate((s) => !s)} className="px-3 py-1 bg-blue-600 text-white rounded">{showCreate ? "Close" : "Create Campaign"}</button>
        </div>
      </div>

      {showCreate && (
        <form onSubmit={createCampaign} className="bg-white p-4 rounded shadow mb-4 grid gap-2">
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="p-2 border rounded" />
          <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Message" className="p-2 border rounded" />
          <input value={form.recipients} onChange={(e) => setForm({ ...form, recipients: e.target.value })} placeholder="Recipients (csv emails or phones)" className="p-2 border rounded" />
          <div className="flex gap-2">
            <input value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })} placeholder="Team id (optional)" className="p-2 border rounded flex-1" />
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="p-2 border rounded">
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <button className="px-3 py-1 bg-green-600 text-white rounded">Create</button>
          </div>
        </form>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded shadow p-4">
          {loading ? <div>Loading...</div> : (
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Title</th>
                  <th className="p-2 text-left">Team</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c._id} className="border-t">
                    <td className="p-2">{c.title}</td>
                    <td className="p-2">{c.team?.name ?? "-"}</td>
                    <td className="p-2">{c.status}</td>
                    <td className="p-2">
                      <button onClick={() => openCampaign(c)} className="px-2 py-1 bg-gray-200 rounded mr-2">Open</button>
                      <button onClick={() => api.post(`/campaigns/${c._id}/send`).then(loadList).catch(()=>alert('Send failed'))} className="px-2 py-1 bg-blue-500 text-white rounded">Send</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white rounded shadow p-4">
          {!selected ? (
            <div className="text-sm text-gray-500">Select a campaign to view recipients & analytics</div>
          ) : (
            <>
              <h3 className="font-semibold mb-2">{selected.title}</h3>

              <div className="mb-4">
                <div className="text-sm">Analytics:</div>
                <div>Accepted: {analytics?.accepted ?? "-"}, Rejected: {analytics?.rejected ?? "-"}, Hold: {analytics?.hold ?? "-"}, Pending: {analytics?.pending ?? "-"}</div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Recipients</h4>
                {recipients.length === 0 ? <div className="text-sm text-gray-500">No recipients</div> : (
                  <table className="w-full text-left">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2">Name</th>
                        <th className="p-2">Contact</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recipients.map(r => (
                        <tr key={r._id} className="border-t">
                          <td className="p-2">{r.name ?? "-"}</td>
                          <td className="p-2">{r.email ?? r.phone}</td>
                          <td className="p-2">{r.status}</td>
                          <td className="p-2">
                            <button onClick={() => actionRecipient(r._id, "accept")} className="px-2 py-1 bg-green-600 text-white rounded mr-2">Accept</button>
                            <button onClick={() => { const reason = prompt("Reason (optional)"); if (reason !== null) actionRecipient(r._id, "reject", { reason }); }} className="px-2 py-1 bg-red-500 text-white rounded mr-2">Reject</button>
                            <button onClick={() => { const until = prompt("Hold until (YYYY-MM-DD)"); if (until) actionRecipient(r._id, "hold", { hold_until: until }); }} className="px-2 py-1 bg-yellow-400 rounded">Hold</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
