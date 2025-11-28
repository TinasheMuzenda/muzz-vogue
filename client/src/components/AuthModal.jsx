import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  registerUser,
  checkUsername,
  requestReset,
} from "../services/authService.jsx";
import GoogleLoginButton from "./GoogleLoginButton.jsx";
import { passwordRegex, mobileRegex } from "../utils/Validators.jsx";
import emailjs from "emailjs-com";
import { setToken } from "../utils/storage.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function AuthModal({ onClose }) {
  const [tab, setTab] = useState("login");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({
    name: "",
    username: "",
    email: "",
    address: "",
    mobile: "",
    password: "",
    confirm: "",
  });
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleClose = () => {
    onClose();
    navigate("/");
  };

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!regForm.username) return setUsernameAvailable(null);
      try {
        const res = await checkUsername(regForm.username);
        setUsernameAvailable(res.data.available);
      } catch {
        setUsernameAvailable(null);
      }
    }, 500);
    return () => clearTimeout(t);
  }, [regForm.username]);

  const handleLogin = async () => {
    try {
      const res = await loginUser(loginForm);
      setToken(res.data.token);
      setUser(res.data.user);
      onClose();
    } catch (err) {
      setMsg(err.response?.data?.message || err.message);
    }
  };

  const handleRegister = async () => {
    if (regForm.password !== regForm.confirm)
      return setMsg("Passwords must match");
    if (!passwordRegex.test(regForm.password))
      return setMsg("Password not strong enough");
    if (!mobileRegex.test(regForm.mobile))
      return setMsg("Mobile must include country code, e.g. +26377XXXXXXX");

    try {
      const res = await registerUser(regForm);
      setToken(res.data.token);
      setUser(res.data.user);
      onClose();
    } catch (err) {
      setMsg(err.response?.data?.message || err.message);
    }
  };

  const sendResetEmail = async (toEmail, token) => {
    const params = {
      to_email: toEmail,
      reset_link: `${window.location.origin}/reset?token=${token}`,
    };
    return emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE,
      import.meta.env.VITE_EMAILJS_TEMPLATE,
      params,
      import.meta.env.VITE_EMAILJS_USER
    );
  };

  const handleRequestReset = async () => {
    try {
      const email = loginForm.email || regForm.email;
      if (!email) return setMsg("Provide email for reset");

      const res = await requestReset({ email });

      await sendResetEmail(email, res.data.token);

      setMsg("Check your email for a reset link");
    } catch (err) {
      setMsg(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-333">
      <div className="bg-(--deep) p-6 rounded w-full max-w-2xl text-(--light)">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setTab("login")}
            className={
              tab === "login"
                ? "bg-(--accent) text-(--deep) px-3 py-1 rounded"
                : "px-3 py-1"
            }
          >
            Login
          </button>
          <button
            onClick={() => setTab("register")}
            className={
              tab === "register"
                ? "bg-(--accent) text-(--deep) px-3 py-1 rounded"
                : "px-3 py-1"
            }
          >
            Register
          </button>
          <button
            onClick={() => setTab("reset")}
            className={
              tab === "reset"
                ? "bg-(--accent) text-(--deep) px-3 py-1 rounded"
                : "px-3 py-1"
            }
          >
            Reset
          </button>
        </div>

        {tab === "login" && (
          <div>
            <input
              value={loginForm.email}
              onChange={(e) =>
                setLoginForm({ ...loginForm, email: e.target.value })
              }
              placeholder="Email"
              className="w-full p-2 mb-2 bg-(--bg) border border-(--accent-dark) rounded"
            />
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
              placeholder="Password"
              className="w-full p-2 mb-2 bg-(--bg) border border-(--accent-dark) rounded"
            />
            <button
              onClick={handleLogin}
              className="px-4 py-2 bg-(--accent) text-(--deep) rounded"
            >
              Login
            </button>

            <div className="mt-3">
              <GoogleLoginButton
                onSuccess={() => {
                  onClose();
                }}
                onError={() => setMsg("Google error")}
              />
            </div>
          </div>
        )}

        {tab === "register" && (
          <div>
            <input
              value={regForm.name}
              onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
              placeholder="Full name"
              className="w-full p-2 mb-2 bg-(--bg) border border-(--accent-dark) rounded"
            />
            <input
              value={regForm.username}
              onChange={(e) =>
                setRegForm({ ...regForm, username: e.target.value })
              }
              placeholder="Username"
              className="w-full p-2 mb-1 bg-(--bg) border border-(--accent-dark) rounded"
            />
            {usernameAvailable === true && (
              <p className="text-sm text-green-400">Username available</p>
            )}
            {usernameAvailable === false && (
              <p className="text-sm text-red-400">Username taken</p>
            )}

            <input
              value={regForm.email}
              onChange={(e) =>
                setRegForm({ ...regForm, email: e.target.value })
              }
              placeholder="Email"
              className="w-full p-2 mb-2 bg-(--bg) border border-(--accent-dark) rounded"
            />
            <input
              value={regForm.address}
              onChange={(e) =>
                setRegForm({ ...regForm, address: e.target.value })
              }
              placeholder="Address"
              className="w-full p-2 mb-2 bg-(--bg) border border-(--accent-dark) rounded"
            />
            <input
              value={regForm.mobile}
              onChange={(e) =>
                setRegForm({ ...regForm, mobile: e.target.value })
              }
              placeholder="Mobile (+countrycode)"
              className="w-full p-2 mb-2 bg-(--bg) border border-(--accent-dark) rounded"
            />
            <input
              type="password"
              value={regForm.password}
              onChange={(e) =>
                setRegForm({ ...regForm, password: e.target.value })
              }
              placeholder="Password (min 13 chars)"
              className="w-full p-2 mb-2 bg-(--bg) border border-(--accent-dark) rounded"
            />
            <input
              type="password"
              value={regForm.confirm}
              onChange={(e) =>
                setRegForm({ ...regForm, confirm: e.target.value })
              }
              placeholder="Confirm password"
              className="w-full p-2 mb-2 bg-(--bg) border border-(--accent-dark) rounded"
            />
            <button
              onClick={handleRegister}
              className="px-4 py-2 bg-(--accent) text-(--deep) rounded"
            >
              Register
            </button>

            <div className="mt-3">
              <GoogleLoginButton
                onSuccess={() => {
                  onClose();
                }}
                onError={() => setMsg("Google error")}
              />
            </div>
          </div>
        )}

        {tab === "reset" && (
          <div>
            <p className="mb-2">
              Enter email to receive a password reset link.
            </p>
            <input
              value={loginForm.email}
              onChange={(e) =>
                setLoginForm({ ...loginForm, email: e.target.value })
              }
              placeholder="Email"
              className="w-full p-2 mb-2 bg-(--bg) border border-(--accent-dark) rounded"
            />
            <button
              onClick={handleRequestReset}
              className="px-4 py-2 bg-(--accent) text-(--deep) rounded"
            >
              Request Reset
            </button>
          </div>
        )}

        <p className="mt-3 text-sm">{msg}</p>

        <button
          onClick={handleClose}
          className="mt-4 px-3 py-1 border border-(--accent-dark) rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
