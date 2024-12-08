import express from "express";
import {
  getAllProducts,
  getFeaturedProducts,
  createProduct,
  deleteProduct,
  getRecommendations,
  getProductsByCategory,
  toggleFeaturedProduct,
  getSliderProducts,
  toggleShowOnSlider
} from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/slider", getSliderProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/recommendations", getRecommendations);
router.post("/", protectRoute, adminRoute, createProduct);
router.patch("/featured/:id", protectRoute, adminRoute, toggleFeaturedProduct);
router.patch("/slider/:id", protectRoute, adminRoute, toggleShowOnSlider);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

export default router;
