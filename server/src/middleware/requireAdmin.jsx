export const requireAdmin = (req, res, next) => {
  // If user is authenticated via JWT and has isAdmin true -> allow.
  if (req.user && req.user.isAdmin) {
    return next();
  }
  // Otherwise, deny.
  return res.status(403).json({ message: "Admin access required" });
};
