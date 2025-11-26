import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/User.jsx";
import { uploadBase64 } from "../utils/uploadBase64.jsx";
import { isPasswordStrong } from "../utils/passwordPolicy.jsx";
import { OAuth2Client } from "google-auth-library";

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      address,
      mobile,
      password,
      paymentMethods = [],
      avatar,
    } = req.body;

    if (!name || !username || !email || !address || !mobile || !password)
      return res.status(400).json({ message: "Missing fields" });

    if (!isPasswordStrong(password))
      return res.status(400).json({ message: "Password not strong" });

    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) return res.status(409).json({ message: "User already exists" });

    let avatarData = null;
    if (avatar && avatar.startsWith("data:image")) {
      avatarData = await uploadBase64(avatar, "avatars");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      username,
      email,
      address,
      mobile,
      paymentMethods,
      avatar: avatarData || null,
      passwordHash,
    });

    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, isAdmin: newUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "User created",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password)
      return res.status(400).json({ message: "Missing credentials" });

    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ message: "Image missing" });

    const uploaded = await uploadBase64(image, "avatars");
    return res.status(200).json({ ...uploaded });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(200)
        .json({ message: "If account exists a reset link has been sent" });

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    user.resetPasswordTokenHash = tokenHash;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 60; // 1 hour
    await user.save();

    const resetLink = `${CLIENT_URL}/reset-password?token=${token}&id=${user._id}`;
    return res.json({ message: "Reset link generated", resetLink });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { id, token, newPassword } = req.body;
    if (!id || !token || !newPassword)
      return res.status(400).json({ message: "Missing fields" });
    if (!isPasswordStrong(newPassword))
      return res.status(400).json({ message: "Password not strong" });

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      _id: id,
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetPasswordTokenHash = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const googleSignIn = async (req, res) => {
  try {
    const { idToken } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      const usernameBase = (name || email.split("@")[0])
        .replace(/\s+/g, "")
        .toLowerCase();
      let username = usernameBase;
      let i = 0;
      while (await User.findOne({ username })) {
        i += 1;
        username = `${usernameBase}${i}`;
      }
      const passwordHash = await bcrypt.hash(sub + process.env.JWT_SECRET, 10);
      user = await User.create({
        name,
        username,
        email,
        address: "",
        mobile: "",
        paymentMethods: [],
        avatar: picture || "",
        passwordHash,
      });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Google token invalid" });
  }
};
