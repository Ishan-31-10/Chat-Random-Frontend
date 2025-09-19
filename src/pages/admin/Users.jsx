import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "Password123",
    role: "sales",
    team: "",
  });
  const [teams, setTeams] = useState([]);
  const [filters, setFilters] = useState({ role: "", team: "", search: "" });
  const [sort, setSort] = useState({ field: "username", direction: "asc" });
  const [page, setPage] = useState(1);
  const perPage = 5;

  useEffect(() => {
    load();
    api
      .get("/teams")
      .then((r) => setTeams(r.data || []))
      .catch(() => {});
  }, []);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data || []);
    } catch (err) {
      console.error(err);
      alert("Users load failed");
    } finally {
      setLoading(false);
    }
  }

  async function createUser(e) {
    e.preventDefault();
    setCreating(true);
    try {
      const payload = { ...form };

      // agar admin create kar rahe ho to team hata do
      if (payload.role === "admin") {
        delete payload.team;
      }

      await api.post("/admin/users", payload);
      setForm({
        username: "",
        email: "",
        password: "Password123",
        role: "sales",
        team: "",
      });
      await load();
      alert("User created successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Create failed ❌");
    } finally {
      setCreating(false);
    }
  }

  async function deleteUser(id) {
    if (!confirm("Delete user?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/users/${id}`);
      await load();
      alert("User deleted ✅");
    } catch (err) {
      console.error(err);
      alert("Delete failed ❌");
    } finally {
      setDeletingId(null);
    }
  }

  // Filtering logic
  const filteredUsers = users.filter((u) => {
    return (
      (filters.role ? u.role === filters.role : true) &&
      (filters.team ? u.team?._id === filters.team : true) &&
      (filters.search
        ? u.username
            ?.toLowerCase()
            .trim()
            .includes(filters.search.toLowerCase().trim()) ||
          u.email
            ?.toLowerCase()
            .trim()
            .includes(filters.search.toLowerCase().trim())
        : true)
    );
  });

  // Sorting logic
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const valA = a[sort.field]?.toLowerCase?.() || "";
    const valB = b[sort.field]?.toLowerCase?.() || "";
    if (valA < valB) return sort.direction === "asc" ? -1 : 1;
    if (valA > valB) return sort.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / perPage);
  const paginatedUsers = sortedUsers.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Users</h1>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded shadow mb-4 flex flex-col sm:flex-row gap-2">
        <select
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="">All Roles</option>
          <option value="sales">sales</option>
          <option value="delivery">delivery</option>
          <option value="both">both</option>
          <option value="admin">admin</option>
        </select>

        <select
          value={filters.team}
          onChange={(e) => setFilters({ ...filters, team: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="">All Teams</option>
          {teams.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          placeholder="Search by name/email"
          className="p-2 border rounded flex-1"
        />
      </div>

      {/* Create User Form */}
      <form
        onSubmit={createUser}
        className="bg-white p-4 rounded shadow mb-4 grid grid-cols-1 sm:grid-cols-4 gap-2"
      >
        <input
          required
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value.trim() })
          }
          placeholder="Username"
          className="p-2 border rounded"
        />
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
          className="p-2 border rounded"
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="sales">sales</option>
          <option value="delivery">delivery</option>
          <option value="both">both</option>
          <option value="admin">admin</option>
        </select>
        <select
          required
          value={form.team}
          onChange={(e) => setForm({ ...form, team: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="">Select team</option>
          {teams.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>

        <div className="sm:col-span-4 mt-2">
          <button
            disabled={creating}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>

      {/* Users Table */}
      <div className="bg-white rounded shadow overflow-auto">
        {loading ? (
          <div className="p-4">Loading...</div>
        ) : paginatedUsers.length === 0 ? (
          <div className="p-4 text-gray-500">No users found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th
                  className="p-2 text-left cursor-pointer"
                  onClick={() =>
                    setSort({
                      field: "username",
                      direction: sort.direction === "asc" ? "desc" : "asc",
                    })
                  }
                >
                  Username{" "}
                  {sort.field === "username" &&
                    (sort.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="p-2 text-left cursor-pointer"
                  onClick={() =>
                    setSort({
                      field: "email",
                      direction: sort.direction === "asc" ? "desc" : "asc",
                    })
                  }
                >
                  Email{" "}
                  {sort.field === "email" &&
                    (sort.direction === "asc" ? "↑" : "↓")}
                </th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Team</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((u) => (
                <tr key={u._id || u.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{u.username}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.role}</td>
                  <td className="p-2">{u.team?.name ?? "No team"}</td>
                  <td className="p-2">
                    <button
                      onClick={() => deleteUser(u._id || u.id)}
                      disabled={deletingId === (u._id || u.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded disabled:opacity-50"
                    >
                      {deletingId === (u._id || u.id)
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
