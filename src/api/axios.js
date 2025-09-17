import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  // Skip auth header for login/register requests
  if (config.url.includes("/auth/login") || config.url.includes("/auth/register")) {
    return config;
  }

  const userData = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (userData && userData !== "undefined") {
    const user = JSON.parse(userData);
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
});

export default api;
