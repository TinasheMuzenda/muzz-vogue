import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      qty: Number,
      image: String,
    },
  ],
  subtotal: Number,
  deliveryFee: Number,
  total: Number,
  deliveryMethod: {
    type: String,
    enum: ["collect", "deliver"],
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["paypal", "stripe", "ecocash"],
    required: true,
  },
  paymentStatus: { type: String, default: "pending" },
  orderStatus: { type: String, default: "processing" },
  address: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", OrderSchema);
