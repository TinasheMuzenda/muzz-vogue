import { Router } from "express";
import { searchProducts } from "../controllers/productSearchController.jsx";

const router = Router();

router.get("/", searchProducts);

export default router;
