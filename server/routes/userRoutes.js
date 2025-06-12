// routes/userRoutes.js
// Updated user routes with complete authentication

const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  logoutUser,
  getUserOrders,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require("../controllers/userController");

const {
  isAuthenticated,
  requireVerifiedEmail,
  requireCompleteProfile,
  logActivity,
} = require("../middlewares/auth");

const router = express.Router();

// ===========================================
// PUBLIC ROUTES (No authentication required)
// ===========================================

// User authentication
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Password management
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// ===========================================
// PROTECTED ROUTES (Authentication required)
// ===========================================

// User profile management
router.get("/profile", isAuthenticated, getUserProfile);

router.put("/profile", isAuthenticated, updateUserProfile);

router.put(
  "/change-password",
  isAuthenticated,
  logActivity("password_change"),
  changePassword
);

// ===========================================
// ORDER RELATED ROUTES
// ===========================================

// User orders (requires complete profile for order history)
router.get("/orders", isAuthenticated, getUserOrders);

// ===========================================
// WISHLIST MANAGEMENT
// ===========================================

// Get wishlist
router.get("/wishlist", isAuthenticated, getWishlist);

// Add to wishlist
router.post("/wishlist/add/:productId", isAuthenticated, addToWishlist);

// Remove from wishlist
router.delete(
  "/wishlist/remove/:productId",
  isAuthenticated,
  removeFromWishlist
);

module.exports = router;
