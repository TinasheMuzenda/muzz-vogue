import Product from "../models/Product.jsx";
import Message from "../models/Message.jsx";
import { uploadBase64 } from "../utils/uploadBase64.jsx";
import { uploadBuffer } from "../utils/uploadBuffer.jsx";
import { io } from "../index.jsx";

export const addProductWithFiles = async (req, res) => {
  try {
    let images = [];

    if (req.body.base64Images) {
      const arr = Array.isArray(req.body.base64Images)
        ? req.body.base64Images
        : JSON.parse(req.body.base64Images);

      for (const img of arr) {
        const uploaded = await uploadBase64(img, "products");
        images.push(uploaded);
      }
    }

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await uploadBuffer(file.buffer, "products");
        images.push(uploaded);
      }
    }

    const product = await Product.create({
      ...req.body,
      images,
      inStock: req.body.stockQuantity > 0,
    });

    io.to("admins").emit("inventory:update", { action: "create", product });

    res.status(201).json(product);
  } catch (err) {
    console.error("addProductWithFiles error", err);
    res.status(500).json({ message: err.message });
  }
};

export const updateProductByAdmin = async (req, res) => {
  try {
    let images = [];

    if (req.body.base64Images) {
      const arr = Array.isArray(req.body.base64Images)
        ? req.body.base64Images
        : JSON.parse(req.body.base64Images);

      for (const img of arr) {
        const uploaded = await uploadBase64(img, "products");
        images.push(uploaded);
      }
    }

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await uploadBuffer(file.buffer, "products");
        images.push(uploaded);
      }
    }

    const updates = { ...req.body };
    if (images.length > 0) updates.images = images;
    if (updates.stockQuantity !== undefined)
      updates.inStock = Number(updates.stockQuantity) > 0;

    const updated = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    io.to("admins").emit("inventory:update", {
      action: "update",
      product: updated,
    });

    res.status(200).json(updated);
  } catch (err) {
    console.error("updateProductByAdmin error", err);
    res.status(500).json({ message: err.message });
  }
};

export const removeProductByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    io.to("admins").emit("inventory:update", {
      action: "delete",
      productId: id,
    });

    res.json({ message: "deleted" });
  } catch (err) {
    console.error("removeProductByAdmin error", err);
    res.status(500).json({ message: err.message });
  }
};

export const createMessage = async (req, res) => {
  try {
    const { name, email, subject = "", message } = req.body;
    const m = await Message.create({ name, email, subject, message });

    io.to("admins").emit("messages:new", m);

    res.status(201).json(m);
  } catch (err) {
    console.error("createMessage error", err);
    res.status(500).json({ message: err.message });
  }
};

export const listMessages = async (req, res) => {
  try {
    const msgs = await Message.find().sort({ createdAt: -1 });
    res.json(msgs);
  } catch (err) {
    console.error("listMessages error", err);
    res.status(500).json({ message: err.message });
  }
};

export const markMessageRead = async (req, res) => {
  try {
    const { id } = req.params;
    const m = await Message.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
    res.json(m);
  } catch (err) {
    console.error("markMessageRead error", err);
    res.status(500).json({ message: err.message });
  }
};
