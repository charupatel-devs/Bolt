const express = require("express");
const {
  adminLogin,
  adminLogout, // 🚨 NEW: Logout endpoint
  validateAdminToken, // 🚨 NEW: Token validation endpoint
  getAdminProfile, // 🚨 NEW: Profile endpoint
  getDashboardStats,
  getAllCustomers,
  getUserById,
  updateUserRole,
  deleteUser,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkUploadProducts,
  getLowStockProducts,
  getRecentActivities,
  getSalesAnalytics,
} = require("../controllers/adminController");

const {
  isAuthenticated,
  isAdmin,
  logActivity,
} = require("../middlewares/auth");

const router = express.Router();
const multer = require("multer");
const { getSalesChart } = require("../controllers/dashboardController");
const upload = multer({ dest: "uploads/" }); // or configure as needed

// ===========================================
// PUBLIC ADMIN ROUTES
// ===========================================

router.post("/login", adminLogin);

// ===========================================
// AUTHENTICATION ROUTES (REQUIRE TOKEN)
// ===========================================

router.post("/logout", isAuthenticated, isAdmin, adminLogout);
router.get("/validate-token", isAuthenticated, isAdmin, validateAdminToken);
router.get("/profile", isAuthenticated, isAdmin, getAdminProfile);

// ===========================================
// ALL ROUTES BELOW REQUIRE ADMIN AUTHENTICATION
// ===========================================

// Apply admin authentication middleware to all routes below
router.use(isAuthenticated, isAdmin);

// ===========================================
// DASHBOARD & ANALYTICS
// ===========================================
router.get("/sales-chart", getSalesChart);

router.get(
  "/dashboard",
  logActivity("view_admin_dashboard"),
  getDashboardStats
);

router.get(
  "/analytics/sales",
  logActivity("view_sales_analytics"),
  getSalesAnalytics
);

router.get("/activities/recent", getRecentActivities);

// ===========================================
// USER MANAGEMENT
// ===========================================

router.get("/customers", getAllCustomers);
router.get("/users/:id", getUserById);
router.put("/users/:id/role", logActivity("update_user_role"), updateUserRole);
router.delete("/users/:id", logActivity("delete_user"), deleteUser);

// ===========================================
// ORDER MANAGEMENT
// ===========================================

router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrderById);
router.put(
  "/orders/:id/status",
  logActivity("update_order_status"),
  updateOrderStatus
);
router.delete("/orders/:id", logActivity("delete_order"), deleteOrder);

// ===========================================
// PRODUCT MANAGEMENT
// ===========================================

router.get("/products", getAllProducts);
router.post("/products/create", logActivity("create_product"), createProduct);
router.put(
  "/products/update/:id",
  logActivity("update_product"),
  updateProduct
);
router.delete(
  "/products/delete/:id",
  logActivity("delete_product"),
  deleteProduct
);
router.post(
  "/products/bulk-upload",
  upload.single("csvFile"), // Add this middleware
  logActivity("bulk_upload_products"),
  bulkUploadProducts
);
router.get("/products/low-stock", getLowStockProducts);

module.exports = router;
