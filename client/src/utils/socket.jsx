import { io } from "socket.io-client";

const API_BASE =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:7000";

export const createSocket = () => {
  const token =
    localStorage.getItem("adminToken") || localStorage.getItem("jwt_token");
  return io(API_BASE, {
    transports: ["websocket"],
    auth: { token: token || null },
  });
};
