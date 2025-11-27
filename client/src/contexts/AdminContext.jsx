import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api.jsx";

const AdminContext = createContext();
export const useAdmin = () => useContext(AdminContext);

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const verifyAdmin = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setAdmin(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/auth/admin-verify", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAdmin(res.data.admin);
    } catch (_) {
      localStorage.removeItem("adminToken");
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyAdmin();
  }, []);

  return (
    <AdminContext.Provider value={{ admin, loading, setAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}
