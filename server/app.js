const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const compression = require("compression");
const morgan = require("morgan");
const errorMiddleware = require("./middlewares/auth");
const { applySecurity } = require("./middlewares/security");

// Load environment variables first
dotenv.config({
  path: "./config/config.env",
});

const app = express();

// Trust proxy (important for deployment)
app.set("trust proxy", 1);

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "http://localhost:3001",
    ].filter(Boolean);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

// Apply security middleware
applySecurity(app);

// Import Routes
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Electronics Marketplace API is running!",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API info route
app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Electronics Marketplace API v1",
    endpoints: {
      users: "/api/user",
      admin: "/api/admin",
      products: "/api/products",
      orders: "/api/orders",
      categories: "/api/categories",
    },
    documentation: "https://your-api-docs.com",
    support: "support@electronicsmarketplace.com",
  });
});

// 404 handler for undefined routes
app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      "/api/user",
      "/api/admin",
      "/api/products",
      "/api/orders",
      "/api/categories",
    ],
  });
});

// Global error handling middleware (should be last)
// app.use(errorMiddleware);

module.exports = app;
