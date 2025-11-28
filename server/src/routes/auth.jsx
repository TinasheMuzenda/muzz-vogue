import express from "express";
import multer from "multer";

import {
  register,
  login,
  forgotPassword,
  resetPassword,
  uploadAvatar,
  googleSignIn,
  checkUsername,
  googleAuth,
  requestReset,
} from "../controllers/authController.jsx";

import { adminCredentialAuth } from "../middleware/adminAuth.jsx";
import jwt from "jsonwebtoken";

const router = express.Router();
const upload = multer();

router.post("/register", register);
router.post("/login", login);
router.get("/check-username/:username", checkUsername);
router.post("/forgot-password", forgotPassword);
router.post("/request-reset", requestReset);
router.post("/reset-password", resetPassword);
router.post("/upload-avatar/:userId", upload.single("avatar"), uploadAvatar);
router.post("/google", googleAuth);
router.post("/google-old", googleSignIn);

router.post("/admin-login", adminCredentialAuth, (req, res) => {
  const { username, password } = req.body;
  const { ADMIN_USERNAME, ADMIN_PASSWORD } = req.adminCredential;

  if (!username || !password)
    return res.status(400).json({ message: "Missing credentials" });

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const adminToken = jwt.sign(
      { id: "admin-embedded", username: ADMIN_USERNAME, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token: adminToken,
      admin: { username: ADMIN_USERNAME },
    });
  }

  return res.status(401).json({ message: "Invalid admin credentials" });
});

router.get("/admin-verify", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin")
      return res.status(401).json({ message: "Not admin" });

    return res.json({ admin: { username: decoded.username } });
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
