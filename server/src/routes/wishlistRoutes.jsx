import { Router } from "express";
import { auth } from "../middleware/auth.jsx";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.jsx";

const router = Router();

router.get("/", auth, getWishlist);
router.get("/:userId", getWishlist);
router.post("/:userId/add", addToWishlist);
router.post("/:userId/remove", removeFromWishlist);

export default router;