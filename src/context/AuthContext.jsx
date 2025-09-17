import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    let raw = localStorage.getItem("user");
    try {
      if (raw && raw !== "undefined" && raw.trim() !== "") {
        return JSON.parse(raw);
      }
      return null;
    } catch (e) {
      console.error("Invalid user JSON in localStorage", e);
      localStorage.removeItem("user");
      return null;
    }
  });

  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token && !user) {
    api.get("/auth/me")
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      })
      .catch(() => {
        logout(); // agar token invalid hai to clear kar do
      });
  }
}, []);


async function login(email, password) {
  const res = await api.post('/auth/login', { email, password });
  const { token, user } = res.data;

  if (!token) {
    throw new Error("No token received from server");
  }

  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  setUser(user);

  // redirect to campaigns/dashboard
  navigate("/campaigns", { replace: true });
}



  async function register(payload) {
    const res = await api.post("/auth/register", payload);
    return res.data;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
