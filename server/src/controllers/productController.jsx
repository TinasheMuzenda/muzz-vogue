import Product from "../models/Product.jsx";
import { uploadBase64 } from "../utils/uploadBase64.jsx";
import { uploadBuffer } from "../utils/uploadBuffer.jsx";

// List products with existing filters
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
      filter.$or = [{ title: regex }, { description: regex }];
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

// Get a single product by ID
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product" });
  }
};

// Create a product with images
export const createProduct = async (req, res) => {
  try {
    const { title, description, price, brand, sizes, colors, gender, fabric } =
      req.body;

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
      title,
      description,
      price,
      brand,
      sizes,
      colors,
      fabric,
      gender,
      images,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("createProduct error", err);
    res.status(500).json({ message: err.message });
  }
};

// Update a product by ID
export const updateProduct = async (req, res) => {
  try {
    const updates = req.body;
    let newImages = [];

    if (req.body.base64Images) {
      const arr = Array.isArray(req.body.base64Images)
        ? req.body.base64Images
        : JSON.parse(req.body.base64Images);

      for (const img of arr) {
        const uploaded = await uploadBase64(img, "products");
        newImages.push(uploaded);
      }
    }

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await uploadBuffer(file.buffer, "products");
        newImages.push(uploaded);
      }
    }

    if (newImages.length > 0) {
      updates.images = newImages;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (err) {
    console.error("updateProduct error", err);
    res.status(500).json({ message: err.message });
  }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("deleteProduct error", err);
    res.status(500).json({ message: "Server error deleting product" });
  }
};

// --- New integrated search/filter route ---
export const getProducts = async (req, res) => {
  try {
    const {
      q,
      brand,
      fabric,
      gender,
      colors,
      sizes,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 20,
    } = req.query;

    let filter = {};

    if (q) {
      filter.title = { $regex: q, $options: "i" };
    }
    if (brand) filter.brand = brand;
    if (fabric) filter.fabric = fabric;

    if (gender) {
      const gArr = gender.split(",");
      filter.gender = { $in: gArr };
    }
    if (colors) {
      const cArr = colors.split(",");
      filter.colors = { $in: cArr };
    }
    if (sizes) {
      const sArr = sizes.split(",");
      filter.sizes = { $in: sArr };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let sortOption = {};
    if (sort === "price_asc") sortOption.price = 1;
    if (sort === "price_desc") sortOption.price = -1;
    if (sort === "newest") sortOption.createdAt = -1;

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
