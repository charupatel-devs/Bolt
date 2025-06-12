// utils/validators.js
// Input validation utilities

const validator = require("validator");

const validateEmail = (email) => {
  return validator.isEmail(email);
};

const validatePhone = (phone) => {
  // Indian phone number validation (10 digits)
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

const validatePassword = (password) => {
  // At least 6 characters
  return password && password.length >= 6;
};

const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return validator.escape(input.trim());
};

const validateObjectId = (id) => {
  const mongoose = require("mongoose");
  return mongoose.Types.ObjectId.isValid(id);
};

module.exports = {
  validateEmail,
  validatePhone,
  validatePassword,
  sanitizeInput,
  validateObjectId,
};

// =====================================

// utils/slugify.js
// URL slug generation utility

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

module.exports = slugify;

// =====================================

// utils/formatters.js
// Data formatting utilities

const formatPrice = (price, currency = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
};

const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  };

  return new Intl.DateTimeFormat("en-IN", {
    ...defaultOptions,
    ...options,
  }).format(new Date(date));
};

const formatPhoneNumber = (phone) => {
  // Format Indian phone number: +91 98765 43210
  if (phone.length === 10) {
    return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
  }
  return phone;
};

const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

module.exports = {
  formatPrice,
  formatDate,
  formatPhoneNumber,
  truncateText,
  formatFileSize,
};

// =====================================

// utils/constants.js
// Application constants

const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
};

const PAYMENT_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
};

const PAYMENT_METHODS = {
  CREDIT_CARD: "credit_card",
  DEBIT_CARD: "debit_card",
  UPI: "upi",
  NET_BANKING: "net_banking",
  WALLET: "wallet",
  COD: "cod",
};

const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
  SELLER: "seller",
};

const PRODUCT_AVAILABILITY = {
  IN_STOCK: "in_stock",
  OUT_OF_STOCK: "out_of_stock",
  PRE_ORDER: "pre_order",
  DISCONTINUED: "discontinued",
};

const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 12,
  MAX_LIMIT: 100,
};

const EMAIL_TEMPLATES = {
  WELCOME: "welcome",
  ORDER_CONFIRMATION: "order_confirmation",
  ORDER_STATUS_UPDATE: "order_status_update",
  PASSWORD_RESET: "password_reset",
  ACCOUNT_ACTIVATION: "account_activation",
};

module.exports = {
  ORDER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  USER_ROLES,
  PRODUCT_AVAILABILITY,
  DEFAULT_PAGINATION,
  EMAIL_TEMPLATES,
};

// =====================================

// utils/responseHelper.js
// Standardized API response helper

const sendSuccessResponse = (
  res,
  statusCode = 200,
  message = "Success",
  data = null
) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

const sendErrorResponse = (
  res,
  statusCode = 500,
  message = "Internal Server Error",
  errors = null
) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

const sendPaginatedResponse = (
  res,
  data,
  page,
  limit,
  total,
  message = "Success"
) => {
  const totalPages = Math.ceil(total / limit);

  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalItems: total,
      itemsPerPage: parseInt(limit),
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
};

module.exports = {
  sendSuccessResponse,
  sendErrorResponse,
  sendPaginatedResponse,
};

// =====================================

// utils/fileUpload.js
// File upload utility (for product images, etc.)

const multer = require("multer");
const path = require("path");
const AppError = require("./appError");

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new AppError("Only image files are allowed", 400), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// Single file upload
const uploadSingle = (fieldName) => upload.single(fieldName);

// Multiple files upload
const uploadMultiple = (fieldName, maxCount = 5) =>
  upload.array(fieldName, maxCount);

// Mixed fields upload
const uploadFields = (fields) => upload.fields(fields);

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadFields,
};

// =====================================

// utils/logger.js
// Logging utility

const winston = require("winston");

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: logFormat,
  defaultMeta: { service: "electronics-marketplace" },
  transports: [
    // Write all logs with level 'error' and below to error.log
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    // Write all logs with level 'info' and below to combined.log
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

// If not in production, log to console as well
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

module.exports = logger;
