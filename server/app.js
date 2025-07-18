const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const compression = require("compression");
const morgan = require("morgan");
const cookieParser = require("cookie-parser"); // 🚨 Add this line
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
app.use(cookieParser());
// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Then your CORS configuration...
const corsOptions = {
  origin: function (origin, callback) {
    console.log("🔍 CORS Origin Check:", origin); // Add this line

    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "http://localhost:3001",
      "http://localhost:5174",
      "https://bolt-yqr3.vercel.app",
    ].filter(Boolean);

    console.log("🔍 Allowed Origins:", allowedOrigins); // Add this line

    if (allowedOrigins.includes(origin)) {
      console.log("✅ Origin allowed:", origin); // Add this line
      callback(null, true);
    } else {
      console.log("❌ Origin blocked:", origin); // Add this line
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
const stockRoutes = require("./routes/stockRoutes");
// API Routes
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/stocks", stockRoutes);

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
      stocks: "/api/stocks",
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
      "/api/stocks",
      "/api/categories",
    ],
  });
});

module.exports = app;
