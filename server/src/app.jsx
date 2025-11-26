import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.jsx";
import authRoutes from "./routes/auth.jsx";
import productRoutes from "./routes/products.jsx";
import orderRoutes from "./routes/orderRoutes.jsx";
import paymentRoutes from "./routes/paymentRoutes.jsx";
import wishlistRoutes from "./routes/wishlistRoutes.jsx";
import productSearchRoutes from "./routes/productSearchRoutes.jsx";
import adminRoutes from "./routes/adminRoutes.jsx";

const MONGO_URL = process.env.MONGO_URL;

// Connect to MongoDB
if (!MONGO_URL) {
  console.error("ERROR: MONGO_URL missing in .env");
  process.exit(1);
}
connectDB(MONGO_URL);

const app = express();

// Security
app.use(helmet());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Rate Limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/products/search", productSearchRoutes);
app.use("/api/admin", adminRoutes);

// HEALTH CHECK
app.get("/api/health", (req, res) =>
  res.json({
    ok: true,
    env: process.env.NODE_ENV || "development",
  })
);

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || "Server error",
  });
});

export default app;
