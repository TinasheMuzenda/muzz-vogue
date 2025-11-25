import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String], default: [] }, // store Cloudinary URLs
    colors: { type: [String], default: [] }, // used by color filter
    sizes: { type: [String], default: [] }, // e.g. ['S','M','L','XL']
    fabric: { type: String, default: "" },
    gender: {
      type: String,
      enum: ["male", "female", "unisex"],
      default: "unisex",
    }, // show on both if unisex
    category: { type: String, default: "" }, // top half / bottom half, etc.
    inStock: { type: Boolean, default: true },
    stockQuantity: { type: Number, default: 0 },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    }, // optional
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
