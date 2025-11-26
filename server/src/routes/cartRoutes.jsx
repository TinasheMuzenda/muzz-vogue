import express from "express";
import CartItem from "../models/CartItem.jsx";
import Product from "../models/Product.jsx";

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ msg: "Product not found" });
    if (product.stock < quantity)
      return res.status(400).json({ msg: "Not enough stock" });

    const item = await CartItem.findOneAndUpdate(
      { user: userId, product: productId },
      { $inc: { quantity } },
      { upsert: true, new: true }
    );

    if (item.quantity > product.stock) {
      item.quantity = product.stock;
      await item.save();
    }

    res.json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const items = await CartItem.find({ user: req.user._id }).populate(
      "product"
    );
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const { quantity } = req.body;
    const item = await CartItem.findById(req.params.id).populate("product");
    if (!item) return res.status(404).json({ msg: "Cart item not found" });

    if (item.product.stock < quantity)
      return res.status(400).json({ msg: "Stock too low" });

    item.quantity = quantity;
    await item.save();
    res.json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/remove/:id", async (req, res) => {
  try {
    await CartItem.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    res.json({ msg: "Removed" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/cleanup", async (req, res) => {
  try {
    const items = await CartItem.find({ user: req.user._id }).populate(
      "product"
    );
    const removals = items.filter((i) => i.product.stock === 0);
    for (const r of removals) await CartItem.findByIdAndDelete(r._id);
    res.json({ removed: removals.map((r) => r._id) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
