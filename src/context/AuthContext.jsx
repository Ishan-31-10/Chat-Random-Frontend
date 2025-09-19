import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      api
        .get("/auth/me")
        .then((res) => {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        })
        .catch(() => {
          logout(); // agar token invalid hai to clear kar do
        });
    }
  }, [user, navigate]);

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });

    if (res.data.otpRequired) {
      // Sirf signal bhejo ke OTP chahiye
      return { otpRequired: true };
    }

    // yaha admin ke case me token nahi milega isliye crash hota tha
    if (!res.data.token) {
      return { otpRequired: false, error: "No token received" };
    }

    const { token, user } = res.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    navigate("/campaigns", { replace: true });

    return { otpRequired: false };
  }

  async function verifyAdminOtp(email, otp) {
    const res = await api.post("/auth/admin/verify-otp", { email, otp });

    const { token, ...user } = res.data;
    if (!token) throw new Error("No token received after OTP verify");
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    navigate("/admin/dashboard", { replace: true });
  }

  // 🔹 register
  async function register(payload) {
    const res = await api.post("/auth/register", payload);
    const { token, user } = res.data;

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    }

    return res.data;
  }

  // 🔹 logout
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login", { replace: true });
  }

  return (
    <AuthContext.Provider
      value={{ user, login, verifyAdminOtp, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
