import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/UserModel.jsx"; // ✅ NEW MODEL
import { uploadBase64 } from "../utils/uploadBase64.jsx";
import { isPasswordStrong } from "../utils/passwordPolicy.jsx";
import { OAuth2Client } from "google-auth-library";

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(CLIENT_ID);

// 🔥 NEW unified JWT generator
const signToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

/* ============================================================================================
   REGISTER (MERGED)
============================================================================================= */
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
      const uploaded = await uploadBase64(avatar, "avatars");
      avatarData = { url: uploaded.url, public_id: uploaded.public_id };
    }

    // Password hashing is handled by UserSchema.pre("save")
    const newUser = await User.create({
      name,
      username,
      email,
      address,
      mobile,
      paymentMethods,
      avatar: avatarData,
      password, // raw → hashed in model
    });

    const token = signToken(newUser);

    return res.status(201).json({
      message: "User created",
      user: {
        id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
        role: newUser.role,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

/* ============================================================================================
   LOGIN (MERGED)
============================================================================================= */
export const login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password)
      return res.status(400).json({ message: "Missing credentials" });

    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = signToken(user);

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
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
    return res.status(200).json({
      public_id: uploaded.public_id,
      url: uploaded.url,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

export const checkUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const exists = await User.findOne({ username });
    return res.json({ available: !exists });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.json({
        message: "If account exists, a reset link has been sent.",
      });

    const token = crypto.randomBytes(32).toString("hex");
    const hash = crypto.createHash("sha256").update(token).digest("hex");

    user.resetToken = hash;
    user.resetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    const resetLink = `${CLIENT_URL}/reset-password?token=${token}&id=${user._id}`;

    return res.json({ message: "Reset link generated", resetLink });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { id, token, newPassword } = req.body;
    if (!id || !token || !newPassword)
      return res.status(400).json({ message: "Missing fields" });

    if (!isPasswordStrong(newPassword))
      return res.status(400).json({ message: "Weak password" });

    const hash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      _id: id,
      resetToken: hash,
      resetExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = newPassword;
    user.resetToken = null;
    user.resetExpires = null;

    await user.save();

    return res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

export const googleSignIn = async (req, res) => {
  try {
    const { idToken } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: CLIENT_ID,
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
        i++;
        username = `${usernameBase}${i}`;
      }

      user = await User.create({
        name,
        username,
        email,
        address: "",
        mobile: "",
        avatar: { url: picture, public_id: "" },
        password: sub + process.env.JWT_SECRET,
      });
    }

    const token = signToken(user);

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Google token invalid" });
  }
};
