import { useEffect, useState } from "react";
import api from "../../services/api.jsx";
import io from "socket.io-client";

const statuses = [
  "pending",
  "processing",
  "dispatched",
  "delivering",
  "delivered",
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const socket = io(import.meta.env.VITE_API_URL.replace("/api", ""), {
    transports: ["websocket"],
  });

  const load = async () => {
    const res = await api.get("/orders");
    setOrders(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status, userId) => {
    await api.put(`/orders/${id}/status`, { status });

    socket.emit("notify_user", {
      userId,
      title: "Order Update",
      message: `Your order status is now ${status}.`,
    });

    load();
  };

  return (
    <div>
      <h2 className="text-2xl text-(--accent) mb-6">Orders</h2>

      <div className="space-y-6">
        {orders.map((o) => (
          <div
            key={o._id}
            className="bg-(--deep) border border-(--accent-dark) p-6 rounded"
          >
            <h3 className="text-xl text-(--accent) mb-2">
              Order #{o._id.slice(-6)}
            </h3>

            <p className="opacity-70 mb-3">User: {o.user.email}</p>

            <div className="space-y-2 mb-4">
              {o.items.map((item, idx) => (
                <div key={idx}>
                  {item.title} — {item.size} — {item.color} — ${item.price}
                </div>
              ))}
            </div>

            <div className="flex gap-3 items-center mt-3">
              <span className="opacity-70">Status:</span>

              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(o._id, s, o.user._id)}
                  className={`
                    px-3 py-1 rounded border border-(--accent-dark)
                    ${
                      o.status === s
                        ? "bg-(--accent)] text-(--deep)"
                        : "text-(--light)"
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
    </div>
  );
}
