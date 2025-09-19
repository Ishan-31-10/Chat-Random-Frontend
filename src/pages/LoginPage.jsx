import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, verifyAdminOtp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.otpRequired) {
        setOtpSent(true); // move to OTP form
      }
    } catch (err) {
      setErr(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleOtpSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await verifyAdminOtp(email, otp);
    } catch (err) {
      setErr(err.response?.data?.message || err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mt-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">
          {otpSent ? "Admin OTP Verification" : "Login"}
        </h2>
        {err && <div className="text-red-600 mb-2">{err}</div>}

        {!otpSent ? (
          <form onSubmit={submit}>
            <input
              placeholder="Email"
              className="w-full p-2 border rounded mb-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Password"
              type="password"
              className="w-full p-2 border rounded mb-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="w-full p-2 bg-blue-600 text-white rounded disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <input
              placeholder="Enter OTP"
              className="w-full p-2 border rounded mb-2"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              className="w-full p-2 bg-green-600 text-white rounded disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
