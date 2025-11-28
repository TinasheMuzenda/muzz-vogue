import jwt from "jsonwebtoken";

export const requireAdmin = (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization required" });
    }
    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload?.isAdmin && payload?.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
