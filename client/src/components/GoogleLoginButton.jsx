import { useEffect } from "react";
import api from "../services/api.jsx";

export default function GoogleLoginButton({ onSuccess, onError }) {
  useEffect(() => {
    if (window.google) return;
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    document.head.appendChild(s);
  }, []);

  const handleCredential = async (credential) => {
    try {
      const res = await api.post("/auth/google", { idToken: credential });
      localStorage.setItem("jwt_token", res.data.token);
      if (onSuccess) onSuccess(res.data);
    } catch (err) {
      if (onError) onError(err);
    }
  };

  const initButton = () => {
    if (!window.google) return;
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: (res) => handleCredential(res.credential),
    });
    window.google.accounts.id.renderButton(document.getElementById("gbtn"), {
      theme: "outline",
      size: "large",
    });
  };

  useEffect(() => {
    const t = setTimeout(initButton, 500);
    return () => clearTimeout(t);
  }, []);

  return <div id="gbtn"></div>;
}
