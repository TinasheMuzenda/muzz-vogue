import "dotenv/config";
import http from "http";
import app from "./app.jsx";
import { Server } from "socket.io";
import { socketAuth } from "./middleware/socketAuth.jsx";
import { createSocketServer } from "./socket/index.jsx";

const PORT = process.env.PORT || 7000;

const server = http.createServer(app);

export const createSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.use(socketAuth);

  io.on("connection", (socket) => {
    const user = socket.user;

    if (user?.isAdmin) {
      socket.join("admins");
    }

    socket.on("message-from-client", (msg) => {
      if (user?.isAdmin) {
        io.to("admins").emit("admin-message", msg);
      }
    });

    socket.on("disconnect", () => {});
  });

  return io;
};

export const io = createSocketServer(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
