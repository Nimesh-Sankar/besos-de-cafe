import express from "express";
import { requireRole } from "../middleware/auth.js";
import {
  loadAddMenu,
  addMenu,
  loadMenuList,
  deleteMenuItem,
  loadEditMenu,
  updateMenu
} from "../controllers/adminController.js";

const router = express.Router();

// Protect all admin routes
router.use(requireRole("admin"));

router.get("/add-menu", loadAddMenu);
router.post("/add-menu", addMenu);
router.get("/menu", loadMenuList);
router.post("/menu/delete/:id", deleteMenuItem);
router.get("/menu/edit/:id", loadEditMenu);
router.post("/menu/edit/:id", updateMenu);

export default router;