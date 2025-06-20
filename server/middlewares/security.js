// middlewares/security.js
// Enhanced security middleware to replace deprecated xss-clean

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const validator = require("validator");

// Custom XSS protection middleware (replaces deprecated xss-clean)
const xssProtection = (req, res, next) => {
  // Sanitize request body
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query parameters
  if (req.query && typeof req.query === "object") {
    req.query = sanitizeObject(req.query);
  }

  // Sanitize route parameters
  if (req.params && typeof req.params === "object") {
    req.params = sanitizeObject(req.params);
  }

  next();
};

// Recursive function to sanitize object properties
const sanitizeObject = (obj) => {
  const sanitized = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      if (typeof value === "string") {
        // Escape HTML entities and remove potentially dangerous characters
        sanitized[key] = validator.escape(value);
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map((item) =>
          typeof item === "string" ? validator.escape(item) : item
        );
      } else if (typeof value === "object" && value !== null) {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
  }

  return sanitized;
};

// Rate limiting configuration
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: message || "Too many requests, please try again later",
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Skip successful requests
    skipSuccessfulRequests: true,
    // Custom key generator based on IP and user
    keyGenerator: (req) => {
      return req.user ? `${req.ip}-${req.user._id}` : req.ip;
    },
  });
};

// Different rate limits for different routes
const authLimiter = createRateLimit(
  1 * 60 * 1000, // 1 minutes
  1, // 5 attempts per window
  "Too many authentication attempts, please try again later"
);

const generalLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests per window
  "Too many requests from this IP, please try again later"
);

const strictLimiter = createRateLimit(
  60 * 1000, // 1 minute
  10, // 10 requests per minute
  "Rate limit exceeded, please slow down"
);

// Helmet configuration for security headers
const helmetConfig = helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
});

// Input validation middleware
const validateInput = (req, res, next) => {
  // Check for common attack patterns
  const suspiciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /onload\s*=/gi,
    /onerror\s*=/gi,
    /onclick\s*=/gi,
    /eval\s*\(/gi,
    /expression\s*\(/gi,
  ];

  const checkForPatterns = (value) => {
    if (typeof value === "string") {
      return suspiciousPatterns.some((pattern) => pattern.test(value));
    }
    return false;
  };

  const hasAttack = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];

        if (checkForPatterns(value)) {
          return true;
        }

        if (typeof value === "object" && value !== null) {
          if (hasAttack(value)) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // Check request body, query, and params
  if (hasAttack(req.body) || hasAttack(req.query) || hasAttack(req.params)) {
    return res.status(400).json({
      success: false,
      message: "Invalid input detected",
    });
  }

  next();
};

// Content type validation
const validateContentType = (req, res, next) => {
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    const contentType = req.get("Content-Type");

    // Skip content type validation for routes that don't need body
    const skipRoutes = [
      "/api/user/logout",
      "/api/user/wishlist/add",
      "/api/user/wishlist/remove",
    ];
    const skipRoute = skipRoutes.some((route) => req.path.includes(route));

    if (skipRoute) {
      return next();
    }

    if (
      !contentType ||
      (!contentType.includes("application/json") &&
        !contentType.includes("multipart/form-data"))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid content type",
      });
    }
  }

  next();
};
// Request size limiter
const requestSizeLimiter = (req, res, next) => {
  const contentLength = req.get("Content-Length");

  if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
    // 10MB limit
    return res.status(413).json({
      success: false,
      message: "Request too large",
    });
  }

  next();
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
  // Remove server information
  res.removeHeader("X-Powered-By");

  // Add custom security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), location=()");

  next();
};

// Apply all security middleware
const applySecurity = (app) => {
  // Trust proxy (important for rate limiting behind reverse proxy)
  app.set("trust proxy", 1);

  // Basic security headers
  app.use(helmetConfig);
  app.use(securityHeaders);

  // Request validation
  app.use(requestSizeLimiter);
  app.use(validateContentType);

  // Sanitization
  app.use(mongoSanitize());
  app.use(xssProtection);
  app.use(validateInput);

  // Parameter pollution prevention
  app.use(
    hpp({
      whitelist: [
        "sort",
        "fields",
        "page",
        "limit",
        "category",
        "brand",
        "tags",
      ],
    })
  );

  // General rate limiting
  app.use("/api/", generalLimiter);

  // Strict rate limiting for auth routes
  app.use("/api/user/login", authLimiter);
  app.use("/api/user/register", authLimiter);
  app.use("/api/admin/login", authLimiter);
  app.use("/api/user/forgot-password", authLimiter);
  app.use("/api/user/reset-password", authLimiter);
};

module.exports = {
  applySecurity,
  xssProtection,
  createRateLimit,
  authLimiter,
  generalLimiter,
  strictLimiter,
  validateInput,
  validateContentType,
  requestSizeLimiter,
  securityHeaders,
};
