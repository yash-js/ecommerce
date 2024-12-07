import { Router } from "express";
import {
    createCategory,
    deleteCategory,
    getCategories,
    updateCategory,
} from "../controllers/category.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
const router = Router();

router.post("/", protectRoute, adminRoute, createCategory);

router.get("/", getCategories);

router.put("/:id",protectRoute,adminRoute, updateCategory);

router.delete("/:id",protectRoute,adminRoute, deleteCategory);

export default router;
