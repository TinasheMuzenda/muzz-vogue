import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  items: [
    {
      productId: { type: String, required: true },
      addedAt: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model("Wishlist", WishlistSchema);
