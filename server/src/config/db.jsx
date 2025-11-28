import mongoose from "mongoose";

export const connectDB = async (mongoUrl) => {
  try {
    const conn = await mongoose.connect(mongoUrl);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};
