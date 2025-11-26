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
import { authMiddleware } from "../middleware/auth.jsx";
import { requireAdmin } from "../middleware/requireAdmin.jsx";

const router = Router();
const upload = multer();

router.post(
  "/products",
  authMiddleware,
  requireAdmin,
  upload.array("images", 8),
  addProductWithFiles
);
router.put(
  "/products/:id",
  authMiddleware,
  requireAdmin,
  upload.array("images", 8),
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

export default router;
