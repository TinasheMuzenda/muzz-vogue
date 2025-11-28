import { Server } from "socket.io";
import { socketAuth } from "../middleware/socketAuth.jsx";

export const createSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin:
        process.env.CLIENT_ORIGIN ||
        process.env.FRONTEND_URL ||
        "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) =>
    socketAuth(socket, (err) => (err ? next(err) : next()))
  );

  io.on("connection", (socket) => {
    const user = socket.user || {};
    if (user.isAdmin || user.role === "admin") socket.join("admins");

    socket.on("join_user", (userId) => {
      if (userId) socket.join(`user_${userId}`);
    });

    socket.on("leave_user", (userId) => {
      if (userId) socket.leave(`user_${userId}`);
    });

    socket.on("join_order", (orderId) => {
      if (orderId) socket.join(`order_${orderId}`);
    });

    socket.on("leave_order", (orderId) => {
      if (orderId) socket.leave(`order_${orderId}`);
    });

    socket.on("disconnect", () => {});
  });

  return io;
};
