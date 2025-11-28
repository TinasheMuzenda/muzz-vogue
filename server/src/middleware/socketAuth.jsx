import jwt from "jsonwebtoken";

export const socketAuth = (socket, next) => {
  try {
    const token = socket.handshake?.auth?.token;
    if (!token) return next(new Error("Authentication error: token required"));

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = payload;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
};
