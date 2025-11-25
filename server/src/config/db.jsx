import mongoose from "mongoose";

export const connectDB = async (mongoUrl) => {
  try {
    const conn = await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 10000, // Helps when Atlas takes time to elect primary
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};
