import Product from "../models/Product.jsx";
import { uploadToCloudinary } from "../utils/cloudinary.jsx";

export const listProducts = async (req, res) => {
  try {
    const {
      search,
      brand,
      color,
      fabric,
      gender,
      category,
      minPrice,
      maxPrice,
      page = 1,
      limit = 20,
      size,
    } = req.query;

    const filter = {};

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ name: regex }, { description: regex }];
    }
    if (brand) filter.brand = brand;
    if (gender) filter.gender = gender;
    if (fabric) filter.fabric = fabric;
    if (category) filter.category = category;
    if (color) filter.colors = color;
    if (size) filter.sizes = size;
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({
      total,
      page: Number(page),
      pageSize: products.length,
      products,
    });
  } catch (err) {
    console.error("listProducts error", err);
    res.status(500).json({ message: "Server error listing products" });
  }
};

export const getProduct = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Product not found" });
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product" });
  }
};

export const createProduct = async (req, res) => {
  try {
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
      inStock = true,
      stockQuantity = 0,
      images = [],
    } = req.body;

    const uploadedImages = [];
    for (const img of images) {
      if (img.startsWith("data:") || img.startsWith("http")) {
        const url = await uploadToCloudinary(img, "products");
        uploadedImages.push(url);
      } else {
        uploadedImages.push(img);
      }
    }

    const newProduct = new Product({
      name,
      description,
      brand,
      price,
      images: uploadedImages,
      colors,
      sizes,
      fabric,
      gender,
      category,
      inStock,
      stockQuantity,
    });

    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("createProduct error", err);
    res.status(500).json({ message: "Server error creating product" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.images && Array.isArray(updates.images)) {
      const uploaded = [];
      for (const img of updates.images) {
        if (img.startsWith("data:") || img.startsWith("http")) {
          const url = await uploadToCloudinary(img, "products");
          uploaded.push(url);
        } else uploaded.push(img);
      }
      updates.images = uploaded;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("updateProduct error", err);
    res.status(500).json({ message: "Server error updating product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const p = await Product.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error deleting product" });
  }
};
