import { useEffect, useState } from "react";
import api from "../../../services/api.jsx";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL.replace("/api", ""), {
  transports: ["websocket"],
});

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);

  const load = async () => {
    const res = await api.get("/orders");
    setOrders(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    socket.on("order:update", (data) => {
      setOrders((prev) =>
        prev.map((o) =>
          o._id === data.orderId ? { ...o, status: data.status } : o
        )
      );
    });

    return () => socket.off("order:update");
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    load();
  };

  const nextStatuses = [
    "pending",
    "processing",
    "dispatched",
    "delivering",
    "delivered",
  ];

  return (
    <div>
      <h2 className="text-2xl text-(--accent) mb-4">Orders</h2>

      <div className="space-y-4">
        {orders.map((o) => (
          <div
            key={o._id}
            className="p-4 bg-(--deep) border border-(--accent-dark) rounded"
          >
            <p>ID: {o._id}</p>
            <p>Total: ${o.total.toFixed(2)}</p>
            <p>
              Status:{" "}
              <span className="text-(--accent)">{o.status.toUpperCase()}</span>
            </p>

            <div className="flex gap-2 mt-3">
              {nextStatuses.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(o._id, s)}
                  className={`
                    px-3 py-1 rounded 
                    ${
                      o.status === s
                        ? "bg-(--accent) text-(--deep)"
                        : "bg-(--bg) text-(--light) border border-(--accent-dark)"
                    }
                  `}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && <p>No orders found.</p>}
    </div>
  );
}
