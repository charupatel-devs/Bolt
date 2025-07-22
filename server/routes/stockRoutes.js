const express = require("express");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");

const {
  getAllStocks,
  adjustStock,
  getStockById,
  getRecentAdjustments,
} = require("../controllers/stockAdjustmentController");

const router = express.Router();

// ===========================================
// ADMIN PRODUCTS STOCK INFORMATION
// ===========================================

// GET all product stocks
router.get("/", isAuthenticated, isAdmin, getAllStocks);
// GET recent stock adjustments
router.get(
  "/recent-adjustments",
  isAuthenticated,
  isAdmin,
  getRecentAdjustments
);
// GET single product stock
router.get("/:id", isAuthenticated, isAdmin, getStockById);
// PATCH adjust product stock
router.patch("/adjust/:id", isAuthenticated, isAdmin, adjustStock);
module.exports = router;
