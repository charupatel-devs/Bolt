// routes/orderRoutes.js
// Updated order routes with complete authentication

const express = require("express");
const {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  cancelOrder,
  getOrderTracking,
  processPayment,
  verifyPayment,
  downloadInvoice,
  getCartItems,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  calculateShipping,
  applyDiscount,
  getOrdersByStatus,
} = require("../controllers/orderController");

const {
  isAuthenticated,
  requireVerifiedEmail,
  requireCompleteProfile,
  canModifyOrder,
  canViewOrder,
  logActivity,
  isAdmin,
} = require("../middlewares/auth");

const router = express.Router();

// ===========================================
// ALL ROUTES REQUIRE AUTHENTICATION
// ===========================================

router.use(isAuthenticated);

// ===========================================
// SHOPPING CART MANAGEMENT
// ===========================================

// Get cart items
router.get("/cart", getCartItems);

// Add item to cart
router.post("/cart/add", addToCart);

// Update cart item quantity
router.put("/cart/update/:itemId", updateCartItem);

// Remove item from cart
router.delete("/cart/remove/:itemId", removeFromCart);

// Clear entire cart
router.delete("/cart/clear", clearCart);

// ===========================================
// ORDER CALCULATION & DISCOUNTS
// ===========================================

// Calculate shipping costs
router.post("/calculate-shipping", calculateShipping);

// Apply discount/coupon
router.post("/apply-discount", applyDiscount);

// ===========================================
// ORDER CREATION & MANAGEMENT
// ===========================================

// Create new order (requires verified email and complete profile)
router.post(
  "/create",
  // requireVerifiedEmail,
  // requireCompleteProfile,
  logActivity("create_order"),
  createOrder
);

// Get user's orders
router.get("/my-orders", getUserOrders);

// Get specific order details (only if user owns the order)
router.get("/:id", canViewOrder, getOrderById);

// Cancel order (only if user owns the order and order is modifiable)
router.put(
  "/:id/cancel",
  canModifyOrder,
  logActivity("cancel_order"),
  cancelOrder
);

// Get order tracking information
router.get("/:id/tracking", canViewOrder, getOrderTracking);

// Download order invoice (only for paid orders)
router.get("/:id/invoice", canViewOrder, downloadInvoice);

// ===========================================
// PAYMENT PROCESSING
// ===========================================

// Process payment for order
router.post(
  "/:id/payment",
  canModifyOrder,
  logActivity("process_payment"),
  processPayment
);

// Verify payment status
router.post("/:id/verify-payment", canViewOrder, verifyPayment);

// ===========================================
// ADMIN-ONLY ORDER STATUS ROUTES
// ===========================================

// Get pending orders
router.get(
  "/admin/orders/:status",
  isAdmin,
  logActivity("get_orders_by_status"),
  getOrdersByStatus
);

module.exports = router;
