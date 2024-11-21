import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createCheckoutSession , checkoutSuccess} from "../controllers/payments.controller.js";
const router = express.Router();

router.post("/create-checkout-session", protectRoute, createCheckoutSession);
router.post("/checkout-success", protectRoute, checkoutSuccess);

export default router;
