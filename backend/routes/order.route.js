import { Router } from "express";
import {
    getOrders,
    getOrderDetails,
    updateOrderStatus,
    deleteOrder,
    cancelOrder,
} from "../controllers/orders.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

// Get all orders (Admin only)
router.get("/", protectRoute, adminRoute, getOrders);

// Get order details (User can only view their own orders)
router.get("/:orderId", protectRoute, getOrderDetails);

// Update order status (Admin only)
router.put("/:orderId/status", protectRoute, adminRoute, updateOrderStatus);

// Cancel an order (User can cancel their own orders)
router.put("/:orderId/cancel", protectRoute, cancelOrder);

// Delete an order (Admin only)
router.delete("/:orderId", protectRoute, adminRoute, deleteOrder);

export default router;
