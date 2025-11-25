import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String], default: [] },
    colors: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    fabric: { type: String, default: "" },
    gender: {
      type: String,
      enum: ["male", "female", "unisex"],
      default: "unisex",
    },
    category: { type: String, default: "" },
    inStock: { type: Boolean, default: true },
    stockQuantity: { type: Number, default: 0 },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
