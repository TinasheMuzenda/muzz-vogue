import express from "express";
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
} from "../controllers/productController.jsx";
import authMiddleware from "../middleware/auth.jsx";
import { requireAdmin } from "../middleware/requireAdmin.jsx";
import upload from "../middleware/multer.jsx";

const router = express.Router();

router.get("/", listProducts);
router.get("/:id", getProduct);
router.get("/", getProducts);

router.post("/", authMiddleware, requireAdmin, createProduct);
router.put("/:id", authMiddleware, requireAdmin, updateProduct);
router.delete("/:id", authMiddleware, requireAdmin, deleteProduct);

router.post("/create", upload.array("images"), createProduct);

router.put("/update/:id", upload.array("images"), updateProduct);

export default router;
