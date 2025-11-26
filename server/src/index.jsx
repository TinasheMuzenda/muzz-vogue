import app from "./app.jsx";
import http from "http";
import { Server } from "socket.io";
import "dotenv/config";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // basic connection hook
  socket.on("admin-join", (data) => {
    if (data && data.isAdmin) socket.join("admins");
  });

  socket.on("disconnect", () => {});
});

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
