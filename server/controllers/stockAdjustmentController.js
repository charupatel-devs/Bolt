const StockAdjustment = require("../models/StockAdjustment");
const Product = require("../models/Product");
const Category = require("../models/Category");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

// @desc    Get all stocks with filtering, sorting, and pagination
// @route   GET /api/products/stocks
// @access  Public
const getAllStocks = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  let filter = {};

  // Search filter (by name or SKU)
  if (req.query.search) {
    const regex = new RegExp(req.query.search, "i");
    filter.$or = [{ name: regex }, { sku: regex }];
  }

  if (req.query.category) {
    filter.category = req.query.category;
  }

  // Status filter
  if (req.query.status && req.query.status !== "all") {
    if (req.query.status === "out") {
      filter.stock = 0;
    } else if (req.query.status === "low") {
      // stock > 0 && stock < minOrderQuantity
      filter.$expr = {
        $and: [
          { $gt: ["$stock", 0] },
          { $lt: ["$stock", "$minOrderQuantity"] },
        ],
      };
    } else if (req.query.status === "good") {
      // stock >= minOrderQuantity
      filter.$expr = {
        $gte: ["$stock", "$minOrderQuantity"],
      };
    }
    // You can add "overstocked" etc. similarly if you wish
  }

  // Query for paginated stock items
  const [products, totalItems, lowStockCount, outOfStockCount] =
    await Promise.all([
      Product.find(
        filter,
        "name sku stock minOrderQuantity maxOrderQuantity availability"
      )
        .populate("category", "name")
        .skip(skip)
        .limit(limit)
        .lean(),

      Product.countDocuments(filter),
      Product.countDocuments({
        ...filter,
        $expr: {
          $and: [
            { $gt: ["$stock", 0] },
            { $lt: ["$stock", "$minOrderQuantity"] },
          ],
        },
      }),
      Product.countDocuments({ ...filter, stock: 0 }),
    ]);

  const totalPages = Math.ceil(totalItems / limit);

  res.status(200).json({
    success: true,
    stats: {
      totalProducts: totalItems,
      lowStockItems: lowStockCount,
      outOfStock: outOfStockCount,
    },
    pagination: {
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      limit,
    },
    products,
  });
});

const adjustStock = catchAsync(async (req, res, next) => {
  /*
    Body: { type: "add" | "subtract" | "set", quantity: Number, reason?: String }
  */
  try {
    const { type, quantity, reason } = req.body;
    // You may get userId from req.user if using authentication
    const userId = req.user ? req.user._id : null;

    if (!["add", "subtract", "set"].includes(type)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid adjustment type" });
    }
    if (typeof quantity !== "number" || quantity < 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid quantity" });
    }

    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    let oldStock = product.stock;
    let adjustmentType =
      type === "add" ? "increase" : type === "subtract" ? "decrease" : "set";
    let actualQuantity = quantity;

    if (type === "add") {
      product.stock += quantity;
    } else if (type === "subtract") {
      product.stock = Math.max(0, product.stock - quantity);
    } else if (type === "set") {
      actualQuantity = Math.abs(product.stock - quantity);
      product.stock = quantity;
    }

    // Optionally, update availability
    product.availability = product.stock > 0 ? "in_stock" : "out_of_stock";
    await product.save();

    // Record adjustment in StockAdjustment
    await StockAdjustment.create({
      product: product._id,
      sku: product.sku,
      type: adjustmentType,
      quantity: actualQuantity,
      reason,
      user: userId,
      oldStock,
      newStock: product.stock,
    });

    res.json({
      success: true,
      message: "Stock adjusted successfully",
      data: {
        productId: product._id,
        sku: product.sku,
        oldStock,
        newStock: product.stock,
        adjustment: adjustmentType,
        quantity: actualQuantity,
        reason,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});
// GET single product stock
const getStockById = catchAsync(async (req, res, next) => {
  try {
    const product = await Product.findById(
      req.params.id,
      "name sku stock availability"
    );
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});
const getRecentAdjustments = catchAsync(async (req, res, next) => {
  const { search = "", type, page = 1, limit = 20 } = req.query;
  const filter = {};

  if (search) {
    filter.$or = [
      { sku: new RegExp(search, "i") },
      { reason: new RegExp(search, "i") },
    ];
  }
  if (type && type !== "all") filter.type = type;

  const adjustments = await StockAdjustment.find(filter)
    .populate("product", "name sku")
    .populate("user", "name")
    .sort({ date: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .lean();

  const total = await StockAdjustment.countDocuments(filter);

  res.json({ success: true, adjustments, total });
});

module.exports = {
  getAllStocks,
  adjustStock,
  getStockById,
  getRecentAdjustments,
};
