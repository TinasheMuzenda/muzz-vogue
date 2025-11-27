import { useState } from "react";
import AdminLogin from "./AdminLogin.jsx";
import ProductsAdmin from "./sections/ProductsAdmin.jsx";
import OrdersAdmin from "./sections/OrdersAdmin.jsx";
import MessagesAdmin from "./sections/MessageAdmin.jsx";

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState("products");

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />;

  const tabBase =
    "px-4 py-2 border border-(--accent-dark) rounded cursor-pointer";
  const tabActive = "bg-(--accent) text-(--deep)";
  const tabInactive = "text-(--light) bg-(--deep)";

  return (
    <div className="min-h-screen p-6 text-(--light)">
      <h1 className="text-4xl text-(--accent) mb-6">Admin Dashboard</h1>

      <div className="flex gap-3 mb-6">
        <button
          className={`${tabBase} ${
            tab === "products" ? tabActive : tabInactive
          }`}
          onClick={() => setTab("products")}
        >
          Products
        </button>

        <button
          className={`${tabBase} ${tab === "orders" ? tabActive : tabInactive}`}
          onClick={() => setTab("orders")}
        >
          Orders
        </button>

        <button
          className={`${tabBase} ${
            tab === "messages" ? tabActive : tabInactive
          }`}
          onClick={() => setTab("messages")}
        >
          Messages
        </button>
      </div>

      {tab === "products" && <ProductsAdmin />}
      {tab === "orders" && <OrdersAdmin />}
      {tab === "messages" && <MessagesAdmin />}
    </div>
  );
}
