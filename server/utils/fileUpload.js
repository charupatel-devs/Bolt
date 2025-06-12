// utils/fileUpload.js
// Updated secure file upload utility without deprecated packages

const multer = require("multer");
const path = require("path");
const crypto = require("crypto"); // Using built-in crypto instead of deprecated package
const fs = require("fs").promises;
const AppError = require("./appError");

// Ensure upload directory exists
const ensureUploadDir = async (dir) => {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
};

// Storage configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = "uploads/";
    try {
      await ensureUploadDir(uploadDir);
      cb(null, uploadDir);
    } catch (error) {
      cb(new AppError("Upload directory creation failed", 500));
    }
  },
  filename: (req, file, cb) => {
    // Generate secure filename using crypto
    const randomBytes = crypto.randomBytes(16).toString("hex");
    const timestamp = Date.now();
    const extension = path.extname(file.originalname).toLowerCase();
    const filename = `${file.fieldname}-${timestamp}-${randomBytes}${extension}`;
    cb(null, filename);
  },
});

// Enhanced file filter with better security
const fileFilter = (req, file, cb) => {
  // Allowed image types
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  // Check MIME type
  if (allowedTypes.includes(file.mimetype)) {
    // Additional check for file extension
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(
        new AppError(
          "Invalid file extension. Only JPG, JPEG, PNG, GIF, WEBP are allowed.",
          400
        ),
        false
      );
    }
  } else {
    cb(
      new AppError("Invalid file type. Only image files are allowed.", 400),
      false
    );
  }
};

// Multer configuration with enhanced security
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10, // Maximum 10 files
    fieldSize: 1024 * 1024, // 1MB field size limit
  },
  fileFilter: fileFilter,
});

// Enhanced error handling middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(
        new AppError("File size too large. Maximum size is 5MB.", 400)
      );
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return next(
        new AppError("Too many files. Maximum 10 files allowed.", 400)
      );
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return next(new AppError("Unexpected file field.", 400));
    }
    return next(new AppError(`Upload error: ${err.message}`, 400));
  }
  next(err);
};

// Single file upload
const uploadSingle = (fieldName) => [
  upload.single(fieldName),
  handleMulterError,
];

// Multiple files upload
const uploadMultiple = (fieldName, maxCount = 5) => [
  upload.array(fieldName, maxCount),
  handleMulterError,
];

// Mixed fields upload
const uploadFields = (fields) => [upload.fields(fields), handleMulterError];

// File validation utility
const validateUploadedFile = (file) => {
  if (!file) {
    throw new AppError("No file uploaded", 400);
  }

  // Additional security checks
  if (file.size === 0) {
    throw new AppError("Empty file not allowed", 400);
  }

  // Check if file exists
  if (!fs.existsSync(file.path)) {
    throw new AppError("File upload failed", 500);
  }

  return true;
};

// Clean up uploaded files (utility function)
const cleanupFiles = async (filePaths) => {
  if (!Array.isArray(filePaths)) {
    filePaths = [filePaths];
  }

  for (const filePath of filePaths) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.log(`Failed to delete file: ${filePath}`, error.message);
    }
  }
};

// File type validation based on file signature (magic numbers)
const validateFileSignature = async (filePath) => {
  try {
    const buffer = await fs.readFile(filePath);
    const signature = buffer.toString("hex", 0, 4).toUpperCase();

    const validSignatures = {
      FFD8FFE0: "JPEG",
      FFD8FFE1: "JPEG",
      FFD8FFE2: "JPEG",
      FFD8FFE3: "JPEG",
      FFD8FFE8: "JPEG",
      "89504E47": "PNG",
      47494638: "GIF",
      52494646: "WEBP",
    };

    return Object.keys(validSignatures).some((sig) =>
      signature.startsWith(sig)
    );
  } catch (error) {
    return false;
  }
};

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadFields,
  handleMulterError,
  validateUploadedFile,
  cleanupFiles,
  validateFileSignature,
  ensureUploadDir,
};
