import express from "express";
import { requireRole } from "../middleware/auth.js";
import {
  loadCashierOrders,
  payOrder,
} from "../controllers/cashierController.js";

const router = express.Router();

// Protect all cashier routes
router.use(requireRole("cashier"));

router.get("/orders", loadCashierOrders);
router.post("/order/pay/:id", payOrder);

export default router;
