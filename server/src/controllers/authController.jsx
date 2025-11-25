import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.jsx";
import { uploadToCloudinary } from "../utils/cloudinary.jsx";

const PASSWORD_POLICY_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{13,}$/;

export const register = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      address,
      mobile,
      paymentMethods = [],
      avatar,
      password,
    } = req.body;

    if (!name || !username || !email || !address || !mobile || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!PASSWORD_POLICY_REGEX.test(password)) {
      return res.status(400).json({
        message:
          "Password does not meet policy (13+ characters, at least one uppercase letter, one number and one special character).",
      });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    let avatarUrl = "";
    if (avatar) {
      avatarUrl = await uploadToCloudinary(avatar, "avatars");
    } else {
      avatarUrl =
        "https://res.cloudinary.com/demo/image/upload/v1610000000/placeholder.png";
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      name,
      username,
      email,
      address,
      mobile,
      paymentMethods,
      avatar: avatarUrl,
      passwordHash,
      isAdmin: false,
    });

    const saved = await newUser.save();

    const token = jwt.sign(
      { id: saved._id, username: saved.username, isAdmin: saved.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      user: {
        id: saved._id,
        name: saved.name,
        username: saved.username,
        email: saved.email,
        avatar: saved.avatar,
      },
      token,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error during registration" });
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

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
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
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};
