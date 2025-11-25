import { Router } from "express";
import { createStripeIntent } from "../controllers/payments/stripeController.jsx";
import {
  createPayPalOrder,
  capturePayPalOrder,
} from "../controllers/payments/paypalController.jsx";
import { payWithEcocash } from "../controllers/payments/ecocashController.jsx";

const router = Router();

router.post("/stripe", createStripeIntent);
router.post("/paypal/create", createPayPalOrder);
router.post("/paypal/capture", capturePayPalOrder);
router.post("/ecocash", payWithEcocash);

export default router;
