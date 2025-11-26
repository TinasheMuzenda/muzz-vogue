import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    description: { type: String, required: true },

    price: { type: Number, required: true },
    oldPrice: { type: Number, default: 0 },
    discountPercentage: { type: Number, default: 0 },

    inStock: { type: Boolean, default: true },
    stockQuantity: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    sku: { type: String, unique: true, sparse: true },

    variants: [
      {
        name: String,
        options: [
          {
            value: String,
            stock: Number,
            price: Number,
          },
        ],
      },
    ],

    images: { type: [String], default: [] },
    thumbnail: { type: String, default: "" },

    brand: { type: String, required: true },
    fabric: { type: String, default: "" },
    colors: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    gender: {
      type: String,
      enum: ["male", "female", "unisex"],
      default: "unisex",
    },
    category: { type: String, default: "", index: true },
    subcategory: { type: String, default: "", index: true },
    tags: [{ type: String, index: true }],

    rating: { type: Number, default: 4.5 },
    numReviews: { type: Number, default: 0 },

    isCombo: { type: Boolean, default: false },
    comboItems: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        qty: Number,
      },
    ],
    comboPrice: { type: Number, default: 0 },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
