import { useState } from "react";
import api from "../../services/api.jsx";

export default function AdminLogin({ onSuccess }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    setMsg("");

    try {
      const res = await api.post("/auth/admin-login", {
        username: u,
        password: p,
      });

      localStorage.setItem("adminToken", res.data.token);

      setMsg("Login successful!");

      if (onSuccess) onSuccess(res.data);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto text-(--light)">
      <h1 className="text-2xl text-(--accent) mb-4">Admin Login</h1>

      <input
        placeholder="Username"
        value={u}
        onChange={(e) => setU(e.target.value)}
        className="w-full mb-3 px-3 py-2 bg-(--deep) border border-(--accent-dark) rounded"
      />

      <input
        type="password"
        placeholder="Password"
        value={p}
        onChange={(e) => setP(e.target.value)}
        className="w-full mb-3 px-3 py-2 bg-(--deep) border border-(--accent-dark) rounded"
      />

      <button
        onClick={login}
        disabled={loading}
        className="w-full py-2 bg-(--accent) text-(--deep) rounded disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Login"}
      </button>

      {msg && <p className="mt-3 text-sm">{msg}</p>}
    </div>
  );
}
