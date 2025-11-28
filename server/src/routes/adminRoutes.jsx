import express from "express";
import { Router } from "express";
import multer from "multer";
import {
  addProductWithFiles,
  updateProductByAdmin,
  removeProductByAdmin,
  createMessage,
  listMessages,
  markMessageRead,
} from "../controllers/adminController.jsx";
import authMiddleware from "../middleware/auth.jsx";
import { requireAdmin } from "../middleware/requireAdmin.jsx";
import upload from "../middleware/multer.jsx";

const router = Router();
const defaultUpload = multer();

router.post(
  "/products",
  authMiddleware,
  requireAdmin,
  defaultUpload.array("images", 8),
  addProductWithFiles
);
router.put(
  "/products/:id",
  authMiddleware,
  requireAdmin,
  defaultUpload.array("images", 8),
  updateProductByAdmin
);
router.delete(
  "/products/:id",
  authMiddleware,
  requireAdmin,
  removeProductByAdmin
);

router.post("/messages", createMessage);
router.get("/messages", authMiddleware, requireAdmin, listMessages);
router.post(
  "/messages/:id/read",
  authMiddleware,
  requireAdmin,
  markMessageRead
);

router.post("/product/add", upload.array("images"), addProductWithFiles);

router.put("/product/update/:id", upload.array("images"), updateProductByAdmin);

router.post("/products", requireAdmin, addProductWithFiles);
router.get("/messages", requireAdmin, listMessages);

export default router;