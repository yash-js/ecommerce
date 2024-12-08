import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
    addAddress,
    getAddresses,
    updateAddress,
    deleteAddress,
} from "../controllers/address.controller.js";

const router = Router();

// Protect the routes so only authenticated users can access them
router.post("/", protectRoute, addAddress); // Create a new address
router.get("/", protectRoute, getAddresses); // Get all addresses for a user
router.put("/:addressId", protectRoute, updateAddress); // Update an address
router.delete("/:addressId", protectRoute, deleteAddress); // Delete an address

export default router;
