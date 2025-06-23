// routes/categoryRoutes.js
// Updated category routes with complete authentication

const express = require("express");
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryProducts,
  getSubcategories,
  getCategoryTree,
  searchCategories,
} = require("../controllers/categoryController");

const {
  isAuthenticated,
  isAdmin,
  optionalAuth,
  logActivity,
} = require("../middlewares/auth");

const router = express.Router();

// ===========================================
// PUBLIC ROUTES (No authentication required)
// ===========================================

// Get all categories
router.get("/", getAllCategories);

// Search categories
router.get("/search", searchCategories);

// Get single category details
// router.get("/:id", getCategoryById);

// Get products in a category (with optional auth for personalization)
router.get("/:id/products", optionalAuth, getCategoryProducts);

// Get subcategories
router.get("/:id/subcategories", getSubcategories);

// ===========================================
// ADMIN ROUTES (Require authentication and admin role)
// ===========================================

// Create new category
router.post(
  "/create",
  isAuthenticated,
  isAdmin,
  logActivity("create_category"),
  createCategory
);

// Update existing category
router.put(
  "/update/:id",
  isAuthenticated,
  isAdmin,
  logActivity("update_category"),
  updateCategory
);

// Delete category
router.delete(
  "/delete/:id",
  isAuthenticated,
  isAdmin,
  logActivity("delete_category"),
  deleteCategory
);

module.exports = router;
