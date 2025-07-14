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
  getProductNamesByCategory,
} = require("../controllers/productController");

const {
  isAdmin,
  isAuthenticated,
  optionalAuth,
  requireVerifiedEmail,
  canReviewProduct,
  logActivity,
} = require("../middlewares/auth");

const router = express.Router();

// Route to create a new product with multiple images
// 'images' is the field name from your form, 5 is the max number of files

// ===========================================
// PUBLIC ROUTES (No authentication required)
// ===========================================

// Product listing and search

router.get("/names", optionalAuth, getProductNamesByCategory);
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
