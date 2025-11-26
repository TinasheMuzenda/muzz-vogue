import Product from "../models/Product.jsx";
import Message from "../models/Message.jsx";
import { uploadBuffer } from "../utils/uploadToCloudinaryStream.jsx";
import { io } from "../index.jsx";

// add product with image files
export const addProductWithFiles = async (req, res) => {
  const {
    name,
    description,
    brand,
    price,
    colors = [],
    sizes = [],
    fabric = "",
    gender = "unisex",
    category = "",
    stockQuantity = 0,
  } = req.body;

  const files = req.files || [];

  const images = [];
  for (const f of files) {
    const url = await uploadBuffer(f.buffer, "products");
    images.push(url);
  }

  const p = await Product.create({
    name,
    description,
    brand,
    price: Number(price),
    images,
    colors: Array.isArray(colors) ? colors : [colors],
    sizes: Array.isArray(sizes) ? sizes : [sizes],
    fabric,
    gender,
    category,
    stockQuantity,
    inStock: stockQuantity > 0,
  });

  io.to("admins").emit("inventory:update", { action: "create", product: p });

  res.status(201).json(p);
};

export const updateProductByAdmin = async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  if (req.files && req.files.length) {
    const uploaded = [];
    for (const f of req.files) {
      const url = await uploadBuffer(f.buffer, "products");
      uploaded.push(url);
    }
    updates.images = uploaded;
  }

  if (updates.stockQuantity !== undefined)
    updates.inStock = Number(updates.stockQuantity) > 0;

  const p = await Product.findByIdAndUpdate(id, updates, { new: true });
  io.to("admins").emit("inventory:update", { action: "update", product: p });

  res.json(p);
};

export const removeProductByAdmin = async (req, res) => {
  const { id } = req.params;
  const p = await Product.findByIdAndDelete(id);
  io.to("admins").emit("inventory:update", { action: "delete", productId: id });
  res.json({ message: "deleted" });
};

// messages handling
export const createMessage = async (req, res) => {
  const { name, email, subject = "", message } = req.body;
  const m = await Message.create({ name, email, subject, message });
  io.to("admins").emit("messages:new", m);
  res.status(201).json(m);
};

export const listMessages = async (req, res) => {
  const msgs = await Message.find().sort({ createdAt: -1 });
  res.json(msgs);
};

export const markMessageRead = async (req, res) => {
  const { id } = req.params;
  const m = await Message.findByIdAndUpdate(id, { read: true }, { new: true });
  res.json(m);
};
