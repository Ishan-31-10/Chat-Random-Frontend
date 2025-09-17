import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { showSuccess, showError } from "../components/ToastExample";
import api from "../api/axios";

export default function RegisterPage() {
  const { register } = useAuth();
  const [payload, setPayload] = useState({
    username: "",
    email: "",
    password: "",
    team: "",
  });
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    async function fetchTeams() {
      try {
        const res = await api.get("/teams"); // token automatically attach hoga
        setTeams(res.data);
      } catch (err) {
        console.error("Failed to load teams", err);
      }
    }
    fetchTeams();
  }, []);

  async function submit(e) {
    e.preventDefault();
    try {
      await register(payload);
      if (!payload.team) {
        showError("Please select a team");
        return;
      }
      showSuccess("Registered. Please login.");
    } catch (err) {
      showError("Registration failed");
    }
  }

  return (
    <div className="container mt-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Register</h2>
        <form onSubmit={submit}>
          <input
            placeholder="Username"
            className="w-full p-2 border rounded mb-2"
            value={payload.username}
            onChange={(e) =>
              setPayload({ ...payload, username: e.target.value })
            }
          />

          <input
            placeholder="Email"
            className="w-full p-2 border rounded mb-2"
            value={payload.email}
            onChange={(e) => setPayload({ ...payload, email: e.target.value })}
          />
          <input
            placeholder="Password"
            type="password"
            className="w-full p-2 border rounded mb-2"
            value={payload.password}
            onChange={(e) =>
              setPayload({ ...payload, password: e.target.value })
            }
          />

          {/* Team dropdown */}
          <select
            className="w-full p-2 border rounded mb-2"
            value={payload.team}
            onChange={(e) => setPayload({ ...payload, team: e.target.value })}
          >
            <option value="">Select Team</option>
            {teams.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </select>

          <button className="w-full p-2 bg-green-600 text-white rounded">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
