// utils/helpers.js
// Additional helper functions used across controllers

const mongoose = require("mongoose");
const crypto = require("crypto");

// Generate random string
const generateRandomString = (length = 10) => {
  return crypto.randomBytes(length).toString("hex");
};

// Generate order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `EM${timestamp.slice(-8)}${random}`;
};

// Calculate distance between two coordinates (for shipping)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

// Parse sort string
const parseSortString = (sortStr) => {
  if (!sortStr) return { createdAt: -1 };

  const sortObj = {};
  const fields = sortStr.split(",");

  fields.forEach((field) => {
    if (field.startsWith("-")) {
      sortObj[field.substring(1)] = -1;
    } else {
      sortObj[field] = 1;
    }
  });

  return sortObj;
};

// Generate SKU
const generateSKU = (categoryCode, brand, model) => {
  const timestamp = Date.now().toString().slice(-4);
  const randomNum = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0");

  const categoryPart = categoryCode
    ? categoryCode.substring(0, 3).toUpperCase()
    : "GEN";
  const brandPart = brand ? brand.substring(0, 3).toUpperCase() : "XXX";
  const modelPart = model
    ? model
        .replace(/[^a-zA-Z0-9]/g, "")
        .substring(0, 4)
        .toUpperCase()
    : "XXXX";

  return `${categoryPart}-${brandPart}-${modelPart}-${timestamp}${randomNum}`;
};

// Validate Indian postal code
const validatePostalCode = (postalCode) => {
  const postalCodeRegex = /^[1-9][0-9]{5}$/;
  return postalCodeRegex.test(postalCode);
};

// Calculate GST (Goods and Services Tax for India)
const calculateGST = (amount, rate = 18) => {
  const gstAmount = (amount * rate) / 100;
  return {
    originalAmount: amount,
    gstRate: rate,
    gstAmount: Math.round(gstAmount * 100) / 100,
    totalAmount: Math.round((amount + gstAmount) * 100) / 100,
  };
};

// Format currency for Indian Rupees
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Generate invoice number
const generateInvoiceNumber = (orderNumber) => {
  const year = new Date().getFullYear();
  const month = (new Date().getMonth() + 1).toString().padStart(2, "0");
  return `INV-${year}${month}-${orderNumber}`;
};

// Calculate shipping based on weight and distance
const calculateShippingCost = (weight, distance, baseRate = 50) => {
  // Weight in kg, distance in km
  let cost = baseRate;

  // Weight-based pricing
  if (weight > 0.5) {
    cost += Math.ceil((weight - 0.5) / 0.5) * 25;
  }

  // Distance-based pricing
  if (distance > 100) {
    cost += Math.ceil((distance - 100) / 100) * 20;
  }

  return cost;
};

// Generate tracking number
const generateTrackingNumber = (carrier = "EM") => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${carrier}${timestamp}${random}`;
};

// Validate credit card number (basic Luhn algorithm)
const validateCreditCard = (cardNumber) => {
  // Remove spaces and dashes
  const number = cardNumber.replace(/[\s-]/g, "");

  if (!/^\d+$/.test(number)) return false;
  if (number.length < 13 || number.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number.charAt(i));

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

// Get credit card type
const getCreditCardType = (cardNumber) => {
  const number = cardNumber.replace(/[\s-]/g, "");

  if (/^4/.test(number)) return "Visa";
  if (/^5[1-5]/.test(number)) return "MasterCard";
  if (/^3[47]/.test(number)) return "American Express";
  if (/^6/.test(number)) return "Discover";
  if (/^35/.test(number)) return "JCB";

  return "Unknown";
};

// Generate OTP
const generateOTP = (length = 6) => {
  const digits = "0123456789";
  let otp = "";

  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }

  return otp;
};

// Mask sensitive data
const maskEmail = (email) => {
  const [localPart, domain] = email.split("@");
  const maskedLocal =
    localPart.charAt(0) +
    "*".repeat(localPart.length - 2) +
    localPart.charAt(localPart.length - 1);
  return `${maskedLocal}@${domain}`;
};

const maskPhone = (phone) => {
  if (phone.length === 10) {
    return `${phone.substring(0, 2)}******${phone.substring(8)}`;
  }
  return phone;
};

const maskCreditCard = (cardNumber) => {
  const number = cardNumber.replace(/[\s-]/g, "");
  return `****-****-****-${number.substring(number.length - 4)}`;
};

// Convert string to boolean
const stringToBoolean = (str) => {
  if (typeof str === "boolean") return str;
  if (typeof str === "string") {
    return str.toLowerCase() === "true";
  }
  return false;
};

// Deep clone object
const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Remove empty fields from object
const removeEmptyFields = (obj) => {
  const cleaned = {};

  Object.keys(obj).forEach((key) => {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
      if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
        const nested = removeEmptyFields(obj[key]);
        if (Object.keys(nested).length > 0) {
          cleaned[key] = nested;
        }
      } else {
        cleaned[key] = obj[key];
      }
    }
  });

  return cleaned;
};

// Pagination helper
const getPaginationData = (page, limit, total) => {
  const currentPage = parseInt(page) || 1;
  const itemsPerPage = parseInt(limit) || 12;
  const totalPages = Math.ceil(total / itemsPerPage);
  const skip = (currentPage - 1) * itemsPerPage;

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    totalItems: total,
    skip,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    prevPage: currentPage > 1 ? currentPage - 1 : null,
  };
};

// Generate slug from text
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

// Calculate discount percentage
const calculateDiscountPercentage = (originalPrice, salePrice) => {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

// Time utilities
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const formatTimeAgo = (date) => {
  const now = new Date();
  const diffInMs = now - new Date(date);
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  } else {
    return "Just now";
  }
};

// Array utilities
const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

const removeDuplicates = (array, key = null) => {
  if (key) {
    return array.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t[key] === item[key])
    );
  }
  return [...new Set(array)];
};

// Validation helpers
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const isValidURL = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const isValidJSON = (string) => {
  try {
    JSON.parse(string);
    return true;
  } catch (_) {
    return false;
  }
};

// Error helpers
const createError = (message, statusCode = 500, errors = null) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
  error.isOperational = true;

  if (errors) {
    error.errors = errors;
  }

  return error;
};

// File helpers
const getFileExtension = (filename) => {
  return filename.split(".").pop().toLowerCase();
};

const isValidImageExtension = (extension) => {
  const validExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
  return validExtensions.includes(extension.toLowerCase());
};

const generateFileName = (originalName, prefix = "") => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  const extension = getFileExtension(originalName);
  const name = originalName.split(".")[0].replace(/[^a-zA-Z0-9]/g, "");

  return `${prefix}${name}-${timestamp}-${random}.${extension}`;
};

module.exports = {
  generateRandomString,
  generateOrderNumber,
  calculateDistance,
  deg2rad,
  parseSortString,
  generateSKU,
  validatePostalCode,
  calculateGST,
  formatCurrency,
  generateInvoiceNumber,
  calculateShippingCost,
  generateTrackingNumber,
  validateCreditCard,
  getCreditCardType,
  generateOTP,
  maskEmail,
  maskPhone,
  maskCreditCard,
  stringToBoolean,
  deepClone,
  removeEmptyFields,
  getPaginationData,
  generateSlug,
  calculateDiscountPercentage,
  addDays,
  formatTimeAgo,
  chunkArray,
  removeDuplicates,
  isValidObjectId,
  isValidURL,
  isValidJSON,
  createError,
  getFileExtension,
  isValidImageExtension,
  generateFileName,
};
