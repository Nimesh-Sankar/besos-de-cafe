import express from "express";
import { requireRole } from "../middleware/auth.js";
import {
  loadWaiterDashboard,
  loadOrderPage,
  createOrder,
  serveOrder,
} from "../controllers/waiterController.js";

const router = express.Router();

// Protect all waiter routes
router.use(requireRole("waiter"));

router.get("/dashboard", loadWaiterDashboard);
router.get("/order", loadOrderPage);
router.post("/order", createOrder);
router.post("/order/serve/:id", serveOrder);

export default router;