import { Navigate } from "react-router-dom";
import { useAdmin } from "../contexts/AdminContext.jsx";

export default function AdminRoute({ children }) {
  const { admin, loading } = useAdmin();

  if (loading) {
    return (
      <div className="p-8 text-center text-(--accent)">Validating admin…</div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
