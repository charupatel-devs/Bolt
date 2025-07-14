const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config(); // Make sure to use environment variables

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer to use Cloudinary for storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "bolt-products", // The name of the folder in Cloudinary
    allowed_formats: ["jpeg", "png", "jpg", "webp"], // Allowed image formats
    // Optional: add transformations
    transformation: [{ width: 1024, height: 1024, crop: "limit" }],
  },
});

// Create the Multer upload instance
const upload = multer({ storage: storage });

module.exports = upload;
