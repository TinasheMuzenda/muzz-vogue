import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api.jsx";
import { passwordRegex } from "../utils/Validators.jsx";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async () => {
    if (!passwordRegex.test(password))
      return setMsg("Password not strong enough");
    try {
      await api.post("/auth/reset-password", { token, password });
      setMsg("Password reset successful");
      navigate("/auth");
    } catch (err) {
      setMsg(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto text-[var(--light)]">
      <h1 className="text-2xl text-[var(--accent)] mb-4">Reset Password</h1>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New password"
        className="w-full p-2 mb-3 bg-[var(--bg)] border border-[var(--accent-dark)] rounded"
      />
      <button
        onClick={submit}
        className="px-4 py-2 bg-[var(--accent)] text-[var(--deep)] rounded"
      >
        Set Password
      </button>
      {msg && <p className="mt-3">{msg}</p>}
    </div>
  );
}
