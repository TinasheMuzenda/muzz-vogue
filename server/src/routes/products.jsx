import express from "express";
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.jsx";
import { authMiddleware } from "../middleware/auth.jsx";
import { requireAdmin } from "../middleware/requireAdmin.jsx";

const router = express.Router();

router.get("/", listProducts);
router.get("/:id", getProduct);

router.post("/", authMiddleware, requireAdmin, createProduct);
router.put("/:id", authMiddleware, requireAdmin, updateProduct);
router.delete("/:id", authMiddleware, requireAdmin, deleteProduct);

export default router;
