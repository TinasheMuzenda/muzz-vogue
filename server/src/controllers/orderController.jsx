import Order from "../models/Order.jsx";
import { calculateDelivery } from "../utils/calcDelivery.jsx";
import { io } from "../index.jsx";

export const createOrder = async (req, res) => {
  const { userId, items, deliveryMethod, paymentMethod, address } = req.body;

  const subtotal = items.reduce((t, i) => t + i.price * i.qty, 0);
  const deliveryFee = calculateDelivery(subtotal, deliveryMethod);
  const total = subtotal + deliveryFee;

  const order = await Order.create({
    userId,
    items,
    subtotal,
    deliveryFee,
    total,
    deliveryMethod,
    paymentMethod,
    address,
  });

  res.json(order);
};

export const getUserOrders = async (req, res) => {
  const { userId } = req.params;
  const orders = await Order.find({ userId }).sort({ createdAt: -1 });
  res.json(orders);
};

export const updateOrder = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const order = await Order.findByIdAndUpdate(id, updates, { new: true });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const orderId = order._id;
    const newStatus = updates.status || order.status;

    io.to(`order_${orderId}`).emit("order:update", {
      orderId,
      status: newStatus,
    });
    io.to(`user_${order.userId}`).emit("order:update", {
      orderId,
      status: newStatus,
    });
    io.to("admins").emit("order:update", { orderId, status: newStatus });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
