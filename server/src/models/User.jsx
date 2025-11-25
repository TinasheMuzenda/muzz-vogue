import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true }, // enforce uniqueness
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    mobile: { type: String, required: true }, // store with country code prefix as a string
    paymentMethods: { type: [String], default: [] }, // e.g. ['paypal','stripe','ecocash']
    avatar: { type: String, default: "" }, // Cloudinary URL or placeholder
    passwordHash: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }, // admin flag; we will also embed admin credential code-side
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
