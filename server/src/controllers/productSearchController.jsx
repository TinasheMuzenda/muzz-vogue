import Product from "../models/Product.jsx";

export const searchProducts = async (req, res) => {
  const {
    q,
    size,
    color,
    brand,
    fabric,
    gender,
    category,
    minPrice,
    maxPrice,
  } = req.query;

  const filter = {};

  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
    ];
  }

  if (size) filter.sizes = size;
  if (color) filter.colors = color;
  if (brand) filter.brand = brand;
  if (fabric) filter.fabric = fabric;
  if (gender) filter.gender = gender;
  if (category) filter.category = category;

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const products = await Product.find(filter);
  res.json(products);
};
