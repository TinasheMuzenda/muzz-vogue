import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    address: { type: String, required: true },
    mobile: { type: String, required: true },
    paymentMethods: { type: [String], default: [] },
    avatar: { type: String, default: "" },
    passwordHash: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    resetPasswordTokenHash: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
