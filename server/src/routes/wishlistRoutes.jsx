import { Router } from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.jsx";

const router = Router();

router.get("/:userId", getWishlist);
router.post("/:userId/add", addToWishlist);
router.post("/:userId/remove", removeFromWishlist);

export default router;
