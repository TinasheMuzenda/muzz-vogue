import { Router } from "express";
import {
  createOrder,
  getUserOrders,
  updateOrder,
} from "../controllers/orderController.jsx";

const router = Router();

router.post("/", createOrder);
router.get("/:userId", getUserOrders);
router.get("/", getUserOrders);
router.put("/:id", updateOrder);

export default router;
