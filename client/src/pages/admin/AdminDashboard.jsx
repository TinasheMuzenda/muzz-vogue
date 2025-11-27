import { useState } from "react";
import AdminLogin from "./AdminLogin.jsx";
import ProductsAdmin from "./sections/ProductsAdmin.jsx";
import OrdersAdmin from "./sections/OrdersAdmin.jsx";
import MessagesAdmin from "./sections/MessageAdmin.jsx";

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState("products");

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />;

  const TabBtn = ({ keyName, label }) => (
    <button
      onClick={() => setTab(keyName)}
      className={`
        px-4 py-2 border border-(--accent-dark) rounded 
        ${
          tab === keyName
            ? "bg-(--accent) text-(--deep)"
            : "bg-(--deep) text-(--light)"
        }
      `}
    >
      {label}
    </button>
  );

  return (
    <div className="p-6 text-(--light)">
      <h1 className="text-3xl mb-6 text-(--accent)">Admin Dashboard</h1>

      <div className="flex gap-3 mb-6">
        <TabBtn keyName="products" label="Products" />
        <TabBtn keyName="orders" label="Orders" />
        <TabBtn keyName="messages" label="Messages" />
      </div>

      {tab === "products" && <ProductsAdmin />}
      {tab === "orders" && <OrdersAdmin />}
      {tab === "messages" && <MessagesAdmin />}
    </div>
  );
}
