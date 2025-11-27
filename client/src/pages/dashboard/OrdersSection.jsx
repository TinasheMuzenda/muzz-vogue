import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { Link } from "react-router-dom";
import api from "../../services/api.jsx";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL.replace("/api", ""), {
  transports: ["websocket"],
});

export default function OrdersSection() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user?._id) return;

    const loadOrders = async () => {
      try {
        const res = await api.get("/orders/user/" + user._id);
        setOrders(res.data);
      } catch (err) {
        console.error("Error loading orders:", err);
      }
    };

    loadOrders();
  }, [user]);

  useEffect(() => {
    if (!user?._id) return;

    socket.emit("join_user", user._id);

    const handleUpdate = (data) => {
      setOrders((prev) =>
        prev.map((order) =>
          order._id === data.orderId ? { ...order, status: data.status } : order
        )
      );
    };

    socket.on("order:update", handleUpdate);

    return () => {
      socket.emit("leave_user", user._id);
      socket.off("order:update", handleUpdate);
    };
  }, [user]);

  const statusColor = {
    pending: "text-yellow-400",
    processing: "text-blue-400",
    dispatched: "text-purple-400",
    delivering: "text-orange-300",
    delivered: "text-green-400",
    cancelled: "text-red-400",
  };

  return (
    <div>
      <h2 className="text-2xl mb-4 text-(--accent)">Your Orders</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="p-4 bg-(--deep) border border-(--accent-dark) rounded-md"
          >
            <p className="text-lg">
              Order ID:{" "}
              <Link
                to={`/order/${order._id}`}
                className="text-(--accent) underline"
              >
                {order._id}
              </Link>
            </p>

            <p className="mt-1">
              Status:{" "}
              <span className={statusColor[order.status] || "text-(--accent)"}>
                {order.status.toUpperCase()}
              </span>
            </p>

            <p className="mt-1">Total: ${order.total.toFixed(2)}</p>
          </div>
        ))}

        {orders.length === 0 && <p>No orders found.</p>}
      </div>
    </div>
  );
}
