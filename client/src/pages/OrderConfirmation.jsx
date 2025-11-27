import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import api from "../services/api.jsx";

const socket = io(import.meta.env.VITE_API_URL.replace("/api", ""), {
  transports: ["websocket"],
});

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
        setStatus(res.data.status);
      } catch (err) {
        console.log(err);
      }
    };
    fetchOrder();
  }, [id]);

  useEffect(() => {
    socket.emit("join_order", id);

    socket.on("order:update", (data) => {
      if (data.orderId === id) {
        setStatus(data.status);
      }
    });

    return () => {
      socket.emit("leave_order", id);
      socket.off("order:update");
    };
  }, [id]);

  if (!order) return <p className="p-6">Loading order...</p>;

  const statusColor = {
    pending: "text-yellow-400",
    processing: "text-blue-400",
    dispatched: "text-purple-400",
    delivering: "text-orange-300",
    delivered: "text-green-400",
    cancelled: "text-red-400",
  };

  return (
    <div className="p-6 max-w-2xl mx-auto text-(--light)">
      <h1 className="text-3xl mb-4 text-(--accent)">Order Confirmation</h1>

      <div className="p-4 bg-(--deep) rounded-md border border-(--accent-dark)">
        <p className="text-lg">
          Order ID: <span className="text-(--accent)">{order._id}</span>
        </p>

        <p className="mt-2 text-lg">
          Current Status:{" "}
          <span className={statusColor[status] || "text-(--accent)"}>
            {status.toUpperCase()}
          </span>
        </p>

        <h2 className="text-xl mt-6 mb-2 text-(--accent)">Items</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-3 p-3 bg-(--bg) rounded-md border border-(--accent-dark)"
            >
              <img
                src={item.productId.images?.[0]?.url}
                alt={item.productId.title}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <p className="font-semibold">{item.productId.title}</p>
                <p className="text-(--accent)">
                  {item.qty} × ${item.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xl mt-6 mb-2 text-(--accent)">Totals</h2>

        <div className="space-y-1">
          <p>Subtotal: ${order.subtotal.toFixed(2)}</p>
          <p>Delivery Fee: ${order.deliveryFee.toFixed(2)}</p>
          <p className="text-(--accent) text-xl">
            Total: ${order.total.toFixed(2)}
          </p>
        </div>

        <p className="mt-6 text-sm opacity-70">
          This page updates automatically when the store updates your order.
        </p>
      </div>
    </div>
  );
}
