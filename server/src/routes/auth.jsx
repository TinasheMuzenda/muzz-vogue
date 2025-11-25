import express from "express";
import { register, login } from "../controllers/authController.jsx";
import { adminCredentialAuth } from "../middleware/adminAuth.jsx";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/admin-login", adminCredentialAuth, (req, res) => {
  const { username, password } = req.body;
  const { ADMIN_USERNAME, ADMIN_PASSWORD } = req.adminCredential;

  if (!username || !password)
    return res.status(400).json({ message: "Missing credentials" });

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const adminToken = jwt.sign(
      { id: "admin-embedded", username: ADMIN_USERNAME, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    return res.json({ token: adminToken, admin: { username: ADMIN_USERNAME } });
  }

  return res.status(401).json({ message: "Invalid admin credentials" });
});

export default router;
