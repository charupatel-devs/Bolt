// middlewares/authHelpers.js
// Additional authentication helper functions and utilities (UPDATED FOR COOKIES)

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Generate JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};
// 🚨 UPDATED: Create and send JWT token via HttpOnly cookie
const createSendToken = (
  user,
  statusCode,
  res,
  message = "Success",
  cookieName = "token"
) => {
  const token = signToken(user._id);

  // 🚨 HttpOnly Cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        (process.env.JWT_COOKIE_EXPIRES_IN || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true, // ✅ CRITICAL: Always true for SameSite=None
    sameSite: "none", // ✅ CRITICAL: Required for cross-origin
    path: "/",
  };

  // 🚨 Send HttpOnly cookie (don't send token in response)
  res.cookie(cookieName, token, cookieOptions);

  // Remove sensitive data from output
  user.password = undefined;
  user.loginAttempts = undefined;
  user.lockUntil = undefined;

  res.status(statusCode).json({
    success: true,
    message,
    // 🚨 IMPORTANT: Don't send token in response anymore
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    },
  });
};

// 🚨 NEW: Create admin token with specific cookie name
const createSendAdminToken = (admin, statusCode, res, message = "Success") => {
  return createSendToken(admin, statusCode, res, message, "adminToken");
};

// 🚨 NEW: Create user token with specific cookie name
const createSendUserToken = (user, statusCode, res, message = "Success") => {
  return createSendToken(user, statusCode, res, message, "userToken");
};

// 🚨 UPDATED: Verify if token is valid without throwing errors (check cookies first)
const verifyTokenSilent = async (req) => {
  try {
    // Extract token from cookies or headers
    let token = null;

    if (req.cookies && req.cookies.adminToken) {
      token = req.cookies.adminToken;
    } else if (req.cookies && req.cookies.userToken) {
      token = req.cookies.userToken;
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
};

// Generate password reset token
const generatePasswordResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  return {
    resetToken,
    hashedToken,
    expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  };
};

// Generate email verification token
const generateEmailVerificationToken = () => {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  return {
    verificationToken,
    hashedToken,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  };
};

// Check if user has specific permission
const hasPermission = (user, permission) => {
  if (user.role === "admin") return true;
  if (!user.permissions) return false;

  return user.permissions.includes(permission);
};

// Check if user can access resource
const canAccessResource = (user, resource, action = "read") => {
  // Admin can access everything
  if (user.role === "admin") return true;

  // Check if user owns the resource
  if (resource.user && resource.user.toString() === user._id.toString()) {
    return true;
  }

  // Check specific permissions
  const permissionMap = {
    read: "read_all",
    write: "write_all",
    delete: "delete_all",
  };

  return hasPermission(user, permissionMap[action]);
};

// Generate API key for external integrations
const generateApiKey = (userId, purpose = "general") => {
  const payload = {
    userId,
    purpose,
    generated: Date.now(),
  };

  const apiKey = Buffer.from(JSON.stringify(payload)).toString("base64");
  const signature = crypto
    .createHmac("sha256", process.env.JWT_SECRET)
    .update(apiKey)
    .digest("hex");

  return `${apiKey}.${signature}`;
};

// Validate API key
const validateApiKey = (apiKey) => {
  try {
    const [payload, signature] = apiKey.split(".");

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.JWT_SECRET)
      .update(payload)
      .digest("hex");

    if (signature !== expectedSignature) {
      return null;
    }

    // Decode payload
    const decoded = JSON.parse(Buffer.from(payload, "base64").toString());

    // Check if key is not too old (30 days)
    const maxAge = 30 * 24 * 60 * 60 * 1000;
    if (Date.now() - decoded.generated > maxAge) {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
};

// Track user activity
const trackUserActivity = async (userId, action, details = {}) => {
  try {
    const activity = {
      userId,
      action,
      details,
      timestamp: new Date(),
      ip: details.ip,
      userAgent: details.userAgent,
    };

    // Log to console (replace with actual implementation)
    console.log("User Activity:", JSON.stringify(activity, null, 2));

    return activity;
  } catch (error) {
    console.error("Failed to track user activity:", error);
  }
};

// Check if account is locked
const isAccountLocked = (user) => {
  return user.lockUntil && user.lockUntil > Date.now();
};

// Lock user account
const lockAccount = async (
  userId,
  reason = "Too many failed login attempts"
) => {
  const lockDuration = 2 * 60 * 60 * 1000; // 2 hours

  await User.findByIdAndUpdate(userId, {
    lockUntil: new Date(Date.now() + lockDuration),
    lockReason: reason,
  });
};

// Unlock user account
const unlockAccount = async (userId) => {
  await User.findByIdAndUpdate(userId, {
    $unset: {
      lockUntil: 1,
      lockReason: 1,
      loginAttempts: 1,
    },
  });
};

// Get user permissions based on role
const getUserPermissions = (role) => {
  const permissions = {
    user: [
      "read_own_profile",
      "update_own_profile",
      "read_own_orders",
      "create_order",
      "cancel_own_order",
      "add_to_cart",
      "add_review",
    ],
    seller: [
      "read_own_profile",
      "update_own_profile",
      "read_own_orders",
      "create_order",
      "cancel_own_order",
      "add_to_cart",
      "add_review",
      "create_product",
      "update_own_product",
      "delete_own_product",
      "view_product_analytics",
    ],
    admin: ["all_permissions"],
  };

  return permissions[role] || permissions.user;
};

// Create session data
const createSession = (user, req) => {
  return {
    userId: user._id,
    email: user.email,
    role: user.role,
    loginTime: new Date(),
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    lastActivity: new Date(),
  };
};

// Validate session
const validateSession = async (sessionId, userId) => {
  try {
    return true; // Placeholder
  } catch (error) {
    return false;
  }
};

// Middleware to check account status
const checkAccountStatus = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next();
  }

  const user = req.user;

  // Check if account is locked
  if (isAccountLocked(user)) {
    return next(
      new AppError(
        `Account is locked until ${user.lockUntil.toLocaleString()}. Reason: ${user.lockReason || "Security reasons"}`,
        423
      )
    );
  }

  // Check if email is verified for sensitive operations
  const sensitiveRoutes = ["/payment", "/orders/create", "/profile/update"];
  const isSensitiveRoute = sensitiveRoutes.some((route) =>
    req.path.includes(route)
  );

  if (isSensitiveRoute && !user.emailVerified) {
    return next(
      new AppError("Please verify your email to perform this action", 403)
    );
  }

  next();
});

// Middleware to update last activity
const updateLastActivity = catchAsync(async (req, res, next) => {
  if (req.user) {
    // Update user's last activity (don't wait for completion)
    User.findByIdAndUpdate(req.user._id, {
      lastActivity: new Date(),
      lastIP: req.ip,
    }).catch((err) =>
      console.log("Failed to update last activity:", err.message)
    );
  }

  next();
});

// 🚨 NEW: Clear all authentication cookies
const clearAuthCookies = (res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  };

  res.clearCookie("adminToken", cookieOptions);
  res.clearCookie("userToken", cookieOptions);
  res.clearCookie("token", cookieOptions);
};

module.exports = {
  signToken,
  createSendToken,
  createSendAdminToken, // 🚨 NEW
  createSendUserToken, // 🚨 NEW
  verifyTokenSilent,
  generatePasswordResetToken,
  generateEmailVerificationToken,
  hasPermission,
  canAccessResource,
  generateApiKey,
  validateApiKey,
  trackUserActivity,
  isAccountLocked,
  lockAccount,
  unlockAccount,
  getUserPermissions,
  createSession,
  validateSession,
  checkAccountStatus,
  updateLastActivity,
  clearAuthCookies, // 🚨 NEW
};
