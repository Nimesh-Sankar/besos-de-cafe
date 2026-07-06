import express from "express";
import { requireRole } from "../middleware/auth.js";
import {
  loadKitchenOrders,
  updateOrderStatus,
} from "../controllers/kitchenController.js";

const router = express.Router();

// Protect all kitchen routes
router.use(requireRole("kitchen"));

router.get("/orders", loadKitchenOrders);
router.post("/order/status/:id", updateOrderStatus);

export default router;