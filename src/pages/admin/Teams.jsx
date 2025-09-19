import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [name, setName] = useState("Sales");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get("/teams");
      setTeams(data || []);
    } catch (err) {
      console.error(err);
      alert("Teams load failed");
    } finally {
      setLoading(false);
    }
  }

  async function createTeam(e) {
    e.preventDefault();
    try {
      await api.post("/teams", { name }); // backend requires admin, token will be sent
      setName("Sales");
      load();
    } catch (err) {
      console.error(err);
      alert("Create team failed");
    }
  }

  async function viewMembers(teamId) {
    try {
      const { data } = await api.get(`/teams/${teamId}/users`);
      setMembers(data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load members");
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Teams</h1>

      <form className="mb-4 flex gap-2" onSubmit={createTeam}>
        <select value={name} onChange={(e) => setName(e.target.value)} className="p-2 border rounded">
          <option>Sales</option>
          <option>Delivery</option>
          <option>Both</option>
        </select>
        <button className="px-3 py-1 bg-green-600 text-white rounded">Create Team</button>
      </form>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-2">Teams</h3>
          <ul className="space-y-2">
            {teams.map((t) => (
              <li key={t._id} className="flex justify-between items-center border-b p-2">
                <div>{t.name}</div>
                <div>
                  <button onClick={() => viewMembers(t._id)} className="px-2 py-1 bg-blue-500 text-white rounded">Members</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-2">Members</h3>
          {members.length === 0 ? <div className="text-sm text-gray-500">Select a team to view members</div> : (
            <ul>
              {members.map((m) => (
                <li key={m._id} className="p-2 border-b">{m.username} — {m.email}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
