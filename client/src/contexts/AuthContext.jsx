import { createContext, useContext, useEffect, useState } from "react";
import {
  loginUser,
  registerUser,
  getCurrentUser,
  uploadAvatar,
} from "../services/authService.jsx";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const openAuth = () => {
    window.location.href = "/auth";
  };

  const loadUser = async () => {
    try {
      const res = await getCurrentUser();
      setUser(res.data.user);
    } catch (_) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (data) => {
    const res = await loginUser(data);
    localStorage.setItem("jwt_token", res.data.token);
    await loadUser();
  };

  const register = async (data) => {
    const res = await registerUser(data);
    localStorage.setItem("jwt_token", res.data.token);
    await loadUser();
  };

  const logout = () => {
    localStorage.removeItem("jwt_token");
    setUser(null);
  };

  const updateAvatar = async (base64) => {
    const res = await uploadAvatar(base64);
    setUser({ ...user, avatar: res.data });
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) loadUser();
    else setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, updateAvatar, loading, openAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};
