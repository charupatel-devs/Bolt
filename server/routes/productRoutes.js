// routes/productRoutes.js
// Updated product routes with complete authentication

const express = require("express");
const {
  getAllProducts,
  getProductById,
  searchProducts,
  getProductsByCategory,
  getFeaturedProducts,
  getNewArrivals,
  getRelatedProducts,
  addProductReview,
  getProductReviews,
  getProductSpecifications,
  getAllStocks,
  getStockById,
  adjustStock,
} = require("../controllers/productController");

const {
  isAuthenticated,
  optionalAuth,
  requireVerifiedEmail,
  canReviewProduct,
  logActivity,
} = require("../middlewares/auth");

const router = express.Router();
// ===========================================
// ADMIN PRODUCTS STOCK INFORMATION
// ===========================================

// GET all product stocks
router.get("/stock", getAllStocks);

// GET single product stock
router.get("/stock/:id", getStockById);

// PATCH adjust product stock
router.patch("/stock/adjust/:id", adjustStock);

// ===========================================
// PUBLIC ROUTES (No authentication required)
// ===========================================

// Product listing and search

router.get(
  "/",
  optionalAuth, // Optional auth for personalized content
  getAllProducts
);

router.get("/search", optionalAuth, searchProducts);

router.get("/featured", getFeaturedProducts);

router.get("/new-arrivals", getNewArrivals);

// Category-based product listing
router.get("/category/:categoryId", optionalAuth, getProductsByCategory);

// Product details
router.get("/:id", getProductById);

router.get("/:id/related", getRelatedProducts);

router.get("/:id/specifications", getProductSpecifications);

// ===========================================
// PRODUCT REVIEWS
// ===========================================

// Get product reviews (public)
router.get("/:id/reviews", getProductReviews);

// Add product review (requires authentication and purchase verification)
router.post(
  "/:id/reviews",
  isAuthenticated,
  requireVerifiedEmail,
  canReviewProduct,
  logActivity("add_product_review"),
  addProductReview
);

module.exports = router;
