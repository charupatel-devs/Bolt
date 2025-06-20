// middlewares/auth.js
// Complete authentication middleware for all routes with HttpOnly cookies

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Extract JWT token from request (UPDATED FOR COOKIES)
const extractToken = (req) => {
  let token = null;

  // 🚨 PRIORITY 1: Check HttpOnly cookies first
  if (req.cookies && req.cookies.adminToken) {
    token = req.cookies.adminToken;
  } else if (req.cookies && req.cookies.userToken) {
    token = req.cookies.userToken;
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // FALLBACK: Check Authorization header (Bearer token) for API access
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // FALLBACK: Check x-auth-token header (alternative)
  else if (req.headers["x-auth-token"]) {
    token = req.headers["x-auth-token"];
  }

  return token;
};

// Verify JWT token and get user
const verifyTokenAndGetUser = async (token) => {
  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Get user from database
  const user = await User.findById(decoded.id).select(
    "+loginAttempts +lockUntil"
  );

  if (!user) {
    throw new AppError("User not found. Please login again.", 401);
  }

  // Check if user account is active
  if (!user.isActive) {
    throw new AppError(
      "Your account has been deactivated. Please contact support.",
      401
    );
  }

  // Check if account is locked
  if (user.isLocked) {
    throw new AppError(
      "Account is temporarily locked due to too many failed login attempts. Please try again later.",
      423
    );
  }

  // Check if user changed password after token was issued
  if (
    user.passwordChangedAt &&
    decoded.iat < user.passwordChangedAt.getTime() / 1000
  ) {
    throw new AppError(
      "Password was changed recently. Please login again.",
      401
    );
  }

  return user;
};

// Main authentication middleware
exports.isAuthenticated = catchAsync(async (req, res, next) => {
  const token = extractToken(req);

  // Check if token exists
  if (!token) {
    return next(
      new AppError("Access denied. Please login to access this resource.", 401)
    );
  }

  try {
    // Verify token and get user
    const user = await verifyTokenAndGetUser(token);

    // Add user to request object
    req.user = user;

    // Reset failed login attempts on successful authentication
    if (user.loginAttempts && user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(new AppError("Invalid token. Please login again.", 401));
    } else if (error.name === "TokenExpiredError") {
      return next(new AppError("Token expired. Please login again.", 401));
    } else {
      return next(error);
    }
  }
});

// Optional authentication (user may or may not be logged in)
exports.optionalAuth = catchAsync(async (req, res, next) => {
  const token = extractToken(req);

  if (token) {
    try {
      const user = await verifyTokenAndGetUser(token);
      req.user = user;
    } catch (error) {
      // Continue without user if token is invalid
      console.log("Optional auth failed:", error.message);
    }
  }

  next();
});

// Check if user is admin
exports.isAdmin = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Authentication required.", 401));
  }

  if (req.user.role !== "admin") {
    return next(new AppError("Access denied. Admin privileges required.", 403));
  }

  next();
});

// Check if user is admin or seller
exports.isAdminOrSeller = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Authentication required.", 401));
  }

  if (!["admin", "seller"].includes(req.user.role)) {
    return next(
      new AppError("Access denied. Admin or seller privileges required.", 403)
    );
  }

  next();
});

// Check if user owns the resource or is admin
exports.isOwnerOrAdmin = (resourceModel, userField = "user") => {
  return catchAsync(async (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Authentication required.", 401));
    }

    // Admin can access any resource
    if (req.user.role === "admin") {
      return next();
    }

    // Get the resource
    const resource = await resourceModel.findById(req.params.id);

    if (!resource) {
      return next(new AppError("Resource not found.", 404));
    }

    // Check if user owns the resource
    const resourceUserId =
      resource[userField]?.toString() || resource[userField];

    if (resourceUserId !== req.user._id.toString()) {
      return next(
        new AppError(
          "Access denied. You can only access your own resources.",
          403
        )
      );
    }

    // Add resource to request for use in controller
    req.resource = resource;
    next();
  });
};

// Check specific permissions
exports.hasPermission = (permission) => {
  return catchAsync(async (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Authentication required.", 401));
    }

    // Admin has all permissions
    if (req.user.role === "admin") {
      return next();
    }

    // Check if user has specific permission
    if (!req.user.permissions || !req.user.permissions.includes(permission)) {
      return next(
        new AppError(`Access denied. ${permission} permission required.`, 403)
      );
    }

    next();
  });
};

// Rate limiting per user
exports.userRateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const userRequests = new Map();

  return catchAsync(async (req, res, next) => {
    if (!req.user) {
      return next();
    }

    const userId = req.user._id.toString();
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get user's request history
    let userHistory = userRequests.get(userId) || [];

    // Remove old requests outside the window
    userHistory = userHistory.filter((timestamp) => timestamp > windowStart);

    // Check if user exceeded rate limit
    if (userHistory.length >= maxRequests) {
      return next(
        new AppError("Rate limit exceeded. Please try again later.", 429)
      );
    }

    // Add current request
    userHistory.push(now);
    userRequests.set(userId, userHistory);

    next();
  });
};

// Middleware to check if user can access specific product categories
exports.canAccessCategory = (allowedCategories = []) => {
  return catchAsync(async (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Authentication required.", 401));
    }

    // Admin can access all categories
    if (req.user.role === "admin") {
      return next();
    }

    // Check if user has access to any of the allowed categories
    const userCategories = req.user.allowedCategories || [];
    const hasAccess = allowedCategories.some((category) =>
      userCategories.includes(category)
    );

    if (!hasAccess && allowedCategories.length > 0) {
      return next(
        new AppError(
          "Access denied. You don't have permission to access this category.",
          403
        )
      );
    }

    next();
  });
};

// Middleware to check account verification status
exports.requireVerifiedEmail = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Authentication required.", 401));
  }

  if (!req.user.emailVerified) {
    return next(
      new AppError(
        "Please verify your email address to access this resource.",
        403
      )
    );
  }

  next();
});

// Middleware to check if user profile is complete
exports.requireCompleteProfile = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Authentication required.", 401));
  }

  const requiredFields = ["name", "email", "phone"];
  const missingFields = requiredFields.filter((field) => !req.user[field]);

  if (missingFields.length > 0) {
    return next(
      new AppError(
        `Please complete your profile. Missing: ${missingFields.join(", ")}`,
        403
      )
    );
  }

  next();
});

// Middleware to log user activity
exports.logActivity = (action) => {
  return catchAsync(async (req, res, next) => {
    if (req.user) {
      // Log user activity (implement based on your logging needs)
      console.log(
        `User ${req.user._id} (${req.user.role}) performed action: ${action} at ${new Date().toISOString()}`
      );

      // You can save to database, send to analytics service, etc.
      // Example: await ActivityLog.create({ user: req.user._id, action, timestamp: new Date() });
    }

    next();
  });
};

// Middleware to check API key for external integrations
exports.requireApiKey = catchAsync(async (req, res, next) => {
  const apiKey = req.headers["x-api-key"] || req.query.apiKey;

  if (!apiKey) {
    return next(new AppError("API key required.", 401));
  }

  // Validate API key (implement your own logic)
  const validApiKeys = process.env.VALID_API_KEYS?.split(",") || [];

  if (!validApiKeys.includes(apiKey)) {
    return next(new AppError("Invalid API key.", 401));
  }

  // Set a flag to indicate API access
  req.isApiAccess = true;
  next();
});

// Middleware for role-based access control
exports.requireRole = (...roles) => {
  return catchAsync(async (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Authentication required.", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`Access denied. Required role: ${roles.join(" or ")}`, 403)
      );
    }

    next();
  });
};

// Middleware to check if user can perform action on order based on status
exports.canModifyOrder = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Authentication required.", 401));
  }

  // Admin can modify any order
  if (req.user.role === "admin") {
    return next();
  }

  const Order = require("../models/Order");
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError("Order not found.", 404));
  }

  // Check if user owns the order
  if (order.user.toString() !== req.user._id.toString()) {
    return next(
      new AppError("Access denied. You can only modify your own orders.", 403)
    );
  }

  // Check if order can be modified based on status
  const modifiableStatuses = ["pending", "processing"];
  if (!modifiableStatuses.includes(order.status)) {
    return next(
      new AppError(
        `Order cannot be modified. Current status: ${order.status}`,
        400
      )
    );
  }

  req.order = order;
  next();
});

// Middleware to check if user can access order details
exports.canViewOrder = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Authentication required.", 401));
  }

  // Admin can view any order
  if (req.user.role === "admin") {
    return next();
  }

  const Order = require("../models/Order");
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError("Order not found.", 404));
  }

  // Check if user owns the order
  if (order.user.toString() !== req.user._id.toString()) {
    return next(
      new AppError("Access denied. You can only view your own orders.", 403)
    );
  }

  req.order = order;
  next();
});

// Middleware to check if user can add product review (must have purchased)
exports.canReviewProduct = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Authentication required.", 401));
  }

  const Order = require("../models/Order");
  const productId = req.params.id;

  // Check if user has purchased this product
  const order = await Order.findOne({
    user: req.user._id,
    "items.product": productId,
    status: "delivered",
  });

  if (!order) {
    return next(
      new AppError(
        "You can only review products you have purchased and received.",
        403
      )
    );
  }

  next();
});

// Middleware to validate request context
exports.validateRequestContext = catchAsync(async (req, res, next) => {
  // Add request metadata
  req.requestContext = {
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    timestamp: new Date(),
    method: req.method,
    path: req.path,
    userId: req.user?._id,
  };

  // Log suspicious activity
  if (req.user && req.ip !== req.user.lastLoginIP) {
    console.log(`User ${req.user._id} accessing from different IP: ${req.ip}`);
  }

  next();
});

// Export helper function to create custom auth middleware
exports.createCustomAuth = (options = {}) => {
  const {
    requireAuth = true,
    requireRole = null,
    requirePermissions = [],
    requireVerified = false,
    requireCompleteProfile = false,
    logActivity = null,
  } = options;

  return [
    // Apply authentication if required
    ...(requireAuth ? [exports.isAuthenticated] : [exports.optionalAuth]),

    // Apply role check if specified
    ...(requireRole ? [exports.requireRole(requireRole)] : []),

    // Apply permission checks
    ...requirePermissions.map((permission) =>
      exports.hasPermission(permission)
    ),

    // Apply verification checks
    ...(requireVerified ? [exports.requireVerifiedEmail] : []),
    ...(requireCompleteProfile ? [exports.requireCompleteProfile] : []),

    // Apply activity logging
    ...(logActivity ? [exports.logActivity(logActivity)] : []),

    // Always validate request context
    exports.validateRequestContext,
  ];
};
