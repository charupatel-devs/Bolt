const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Category = require("../models/Category");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");
const APIFeatures = require("../utils/apiFeatures");

// Generate JWT token for admin
const sendTokenResponse = (admin, statusCode, res, message = "Success") => {
  const token = generateToken(admin._id);

  // Remove password from output
  admin.password = undefined;

  res.status(statusCode).json({
    success: true,
    message,
    token,
    admin: {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      avatar: admin.avatar,
      lastLogin: admin.lastLogin,
      createdAt: admin.createdAt,
    },
  });
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
exports.adminLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  // Check if admin exists
  const admin = await User.findOne({
    email,
    role: "admin",
  }).select("+password");

  if (!admin) {
    return next(new AppError("Invalid admin credentials", 401));
  }

  // Check if account is active
  if (!admin.isActive) {
    return next(new AppError("Admin account has been deactivated", 401));
  }

  // Check password
  const isPasswordCorrect = await admin.comparePassword(password);

  if (!isPasswordCorrect) {
    return next(new AppError("Invalid admin credentials", 401));
  }

  // Update last login
  admin.lastLogin = new Date();
  await admin.save({ validateBeforeSave: false });

  sendTokenResponse(admin, 200, res, "Admin login successful");
});

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = catchAsync(async (req, res, next) => {
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  // Total counts
  const totalUsers = await User.countDocuments({ role: "user" });
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalRevenue = await Order.aggregate([
    { $match: { status: "delivered" } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
  ]);

  // Today's stats
  const todayOrders = await Order.countDocuments({
    createdAt: { $gte: startOfDay },
  });
  const todayRevenue = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfDay },
        status: { $in: ["delivered", "processing", "shipped"] },
      },
    },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
  ]);

  // This month's stats
  const monthlyOrders = await Order.countDocuments({
    createdAt: { $gte: startOfMonth },
  });
  const monthlyRevenue = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfMonth },
        status: { $in: ["delivered", "processing", "shipped"] },
      },
    },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
  ]);

  // Order status breakdown
  const ordersByStatus = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  // Top selling products (last 30 days)
  const topProducts = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        totalSold: { $sum: "$items.quantity" },
        revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
  ]);

  // Recent orders
  const recentOrders = await Order.find()
    .populate("user", "name email")
    .populate("items.product", "name price")
    .sort({ createdAt: -1 })
    .limit(5);

  // Low stock products
  const lowStockProducts = await Product.find({ stock: { $lte: 10 } })
    .select("name stock price category")
    .populate("category", "name")
    .limit(10);

  // Sales chart data (last 7 days)
  const salesChart = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        status: { $in: ["delivered", "processing", "shipped"] },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        revenue: { $sum: "$totalAmount" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        todayOrders,
        todayRevenue: todayRevenue[0]?.total || 0,
        monthlyOrders,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
      },
      ordersByStatus,
      topProducts,
      recentOrders,
      lowStockProducts,
      salesChart,
    },
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    User.find({ role: { $ne: "admin" } }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .search();

  const users = await features.query;
  const totalUsers = await User.countDocuments({ role: { $ne: "admin" } });

  // Calculate pagination info
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;

  res.status(200).json({
    success: true,
    results: users.length,
    totalUsers,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      hasNextPage: page < Math.ceil(totalUsers / limit),
      hasPrevPage: page > 1,
    },
    users,
  });
});

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate(
    "wishlist",
    "name price images"
  );

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Get user's order history
  const orders = await Order.find({ user: req.params.id })
    .populate("items.product", "name price")
    .sort({ createdAt: -1 })
    .limit(10);

  // Calculate user stats
  const orderStats = await Order.aggregate([
    { $match: { user: user._id } },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: "$totalAmount" },
        avgOrderValue: { $avg: "$totalAmount" },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    user,
    orders,
    stats: orderStats[0] || { totalOrders: 0, totalSpent: 0, avgOrderValue: 0 },
  });
});

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
exports.updateUserRole = catchAsync(async (req, res, next) => {
  const { role } = req.body;

  if (!["user", "admin", "seller"].includes(role)) {
    return next(new AppError("Invalid role specified", 400));
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Prevent updating own role
  if (user._id.toString() === req.user._id.toString()) {
    return next(new AppError("You cannot update your own role", 400));
  }

  user.role = role;
  await user.save();

  // Send notification email
  try {
    await sendEmail({
      email: user.email,
      subject: "Account Role Updated",
      message: `Your account role has been updated to ${role}.`,
      html: `
        <h2>Account Role Updated</h2>
        <p>Hi ${user.name},</p>
        <p>Your account role has been updated to <strong>${role}</strong>.</p>
        <p>If you have any questions, please contact our support team.</p>
        <p>Best regards,<br>Electronics Marketplace Team</p>
      `,
    });
  } catch (error) {
    console.log("Role update email failed to send:", error.message);
  }

  res.status(200).json({
    success: true,
    message: "User role updated successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Prevent deleting own account
  if (user._id.toString() === req.user._id.toString()) {
    return next(new AppError("You cannot delete your own account", 400));
  }

  // Prevent deleting other admins
  if (user.role === "admin") {
    return next(new AppError("Cannot delete admin accounts", 400));
  }

  // Instead of hard delete, deactivate the account
  user.isActive = false;
  await user.save();

  res.status(200).json({
    success: true,
    message: "User account deactivated successfully",
  });
});

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getAllOrders = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price images"),
    req.query
  )
    .filter()
    .sort()
    .paginate();

  const orders = await features.query;
  const totalOrders = await Order.countDocuments();

  // Calculate pagination info
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;

  res.status(200).json({
    success: true,
    results: orders.length,
    totalOrders,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      hasNextPage: page < Math.ceil(totalOrders / limit),
      hasPrevPage: page > 1,
    },
    orders,
  });
});

// @desc    Get order by ID
// @route   GET /api/admin/orders/:id
// @access  Private/Admin
exports.getOrderById = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email phone")
    .populate("items.product", "name price images specifications");

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status, trackingNumber } = req.body;

  const validStatuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!validStatuses.includes(status)) {
    return next(new AppError("Invalid order status", 400));
  }

  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  const oldStatus = order.status;
  order.status = status;

  if (trackingNumber) {
    order.trackingNumber = trackingNumber;
  }

  if (status === "shipped") {
    order.shippedAt = new Date();
  }

  if (status === "delivered") {
    order.deliveredAt = new Date();
  }

  await order.save();

  // Send status update email to customer
  try {
    const statusMessages = {
      processing: "Your order is being processed",
      shipped: "Your order has been shipped",
      delivered: "Your order has been delivered",
      cancelled: "Your order has been cancelled",
    };

    await sendEmail({
      email: order.user.email,
      subject: `Order Update - ${statusMessages[status]}`,
      message: `Hi ${order.user.name},\n\n${
        statusMessages[status]
      }.\n\nOrder ID: ${order._id}\n${
        trackingNumber ? `Tracking Number: ${trackingNumber}\n` : ""
      }\nBest regards,\nElectronics Marketplace Team`,
      html: `
        <h2>Order Status Update</h2>
        <p>Hi ${order.user.name},</p>
        <p><strong>${statusMessages[status]}</strong></p>
        <p><strong>Order ID:</strong> ${order._id}</p>
        ${
          trackingNumber
            ? `<p><strong>Tracking Number:</strong> ${trackingNumber}</p>`
            : ""
        }
        <p>You can track your order status in your account dashboard.</p>
        <p>Best regards,<br>Electronics Marketplace Team</p>
      `,
    });
  } catch (error) {
    console.log("Order status email failed to send:", error.message);
  }

  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    order: {
      _id: order._id,
      status: order.status,
      trackingNumber: order.trackingNumber,
      oldStatus,
    },
  });
});

// @desc    Delete order
// @route   DELETE /api/admin/orders/:id
// @access  Private/Admin
exports.deleteOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  // Only allow deletion of cancelled orders
  if (order.status !== "cancelled") {
    return next(new AppError("Only cancelled orders can be deleted", 400));
  }

  await Order.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
});

// @desc    Get all products for admin
// @route   GET /api/admin/products
// @access  Private/Admin
exports.getAllProducts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Product.find().populate("category", "name"),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .search();

  const products = await features.query;
  const totalProducts = await Product.countDocuments();

  // Calculate pagination info
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;

  res.status(200).json({
    success: true,
    results: products.length,
    totalProducts,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      hasNextPage: page < Math.ceil(totalProducts / limit),
      hasPrevPage: page > 1,
    },
    products,
  });
});

// @desc    Create new product
// @route   POST /api/admin/products
// @access  Private/Admin
exports.createProduct = catchAsync(async (req, res, next) => {
  // Add created by admin info
  req.body.createdBy = req.user._id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product,
  });
});

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  // Add updated by admin info
  req.body.updatedBy = req.user._id;

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).populate("category", "name");

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product: updatedProduct,
  });
});

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

// @desc    Bulk upload products
// @route   POST /api/admin/products/bulk-upload
// @access  Private/Admin
exports.bulkUploadProducts = catchAsync(async (req, res, next) => {
  const { products } = req.body;

  if (!products || !Array.isArray(products)) {
    return next(new AppError("Please provide an array of products", 400));
  }

  // Add created by admin info to all products
  const productsWithAdmin = products.map((product) => ({
    ...product,
    createdBy: req.user._id,
  }));

  const createdProducts = await Product.insertMany(productsWithAdmin, {
    ordered: false, // Continue inserting even if some fail
  });

  res.status(201).json({
    success: true,
    message: `${createdProducts.length} products uploaded successfully`,
    count: createdProducts.length,
    products: createdProducts,
  });
});

// @desc    Get low stock products
// @route   GET /api/admin/products/low-stock
// @access  Private/Admin
exports.getLowStockProducts = catchAsync(async (req, res, next) => {
  const threshold = req.query.threshold || 10;

  const lowStockProducts = await Product.find({
    stock: { $lte: threshold },
    isActive: true,
  })
    .populate("category", "name")
    .sort({ stock: 1 });

  res.status(200).json({
    success: true,
    count: lowStockProducts.length,
    threshold,
    products: lowStockProducts,
  });
});

// @desc    Get recent activities
// @route   GET /api/admin/activities/recent
// @access  Private/Admin
exports.getRecentActivities = catchAsync(async (req, res, next) => {
  const limit = req.query.limit || 20;

  // Get recent orders
  const recentOrders = await Order.find()
    .populate("user", "name")
    .sort({ createdAt: -1 })
    .limit(limit / 2)
    .select("_id user totalAmount status createdAt");

  // Get recent user registrations
  const recentUsers = await User.find({ role: "user" })
    .sort({ createdAt: -1 })
    .limit(limit / 2)
    .select("_id name email createdAt");

  // Combine and format activities
  const activities = [
    ...recentOrders.map((order) => ({
      type: "order",
      message: `New order #${order._id.toString().slice(-6)} by ${
        order.user.name
      }`,
      amount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
    })),
    ...recentUsers.map((user) => ({
      type: "user",
      message: `New user registered: ${user.name}`,
      email: user.email,
      createdAt: user.createdAt,
    })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.status(200).json({
    success: true,
    activities: activities.slice(0, limit),
  });
});

// @desc    Get sales analytics
// @route   GET /api/admin/analytics/sales
// @access  Private/Admin
exports.getSalesAnalytics = catchAsync(async (req, res, next) => {
  const { period = "month" } = req.query;

  let startDate;
  const endDate = new Date();

  switch (period) {
    case "week":
      startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "month":
      startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
      break;
    case "year":
      startDate = new Date(endDate.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
  }

  // Sales by period
  const salesData = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: { $in: ["processing", "shipped", "delivered"] },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: period === "year" ? "%Y-%m" : "%Y-%m-%d",
            date: "$createdAt",
          },
        },
        revenue: { $sum: "$totalAmount" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Top categories
  const topCategories = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        status: { $in: ["processing", "shipped", "delivered"] },
      },
    },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $lookup: {
        from: "categories",
        localField: "product.category",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
    {
      $group: {
        _id: "$category._id",
        name: { $first: "$category.name" },
        revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
        orders: { $sum: 1 },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: 5 },
  ]);

  res.status(200).json({
    success: true,
    period,
    salesData,
    topCategories,
  });
});
