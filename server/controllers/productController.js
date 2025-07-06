const Product = require("../models/Product");
const Category = require("../models/Category");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
const getAllProducts = catchAsync(async (req, res, next) => {
  // Build filter object
  let filter = { isActive: true };

  // Category filter
  if (req.query.category) {
    // If category is provided, also include products from subcategories
    const category = await Category.findById(req.query.category);
    if (category) {
      const descendants = await category.getAllDescendants();
      const categoryIds = [category._id, ...descendants.map((d) => d._id)];
      filter.category = { $in: categoryIds };
    }
  }

  // Price range filter
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
  }

  // Brand filter
  if (req.query.brand) {
    filter["specifications.brand"] = new RegExp(req.query.brand, "i");
  }

  // Availability filter
  if (req.query.inStock === "true") {
    filter.stock = { $gt: 0 };
  }

  // Rating filter
  if (req.query.minRating) {
    filter.averageRating = { $gte: parseFloat(req.query.minRating) };
  }

  // Featured/sale filters
  if (req.query.featured === "true") {
    filter.isFeatured = true;
  }

  if (req.query.onSale === "true") {
    filter.isOnSale = true;
  }

  // Apply filters using APIFeatures
  const features = new APIFeatures(
    Product.find(filter).populate("category", "name slug"),
    req.query
  )
    .search() // Text search
    .sort() // Sorting
    .limitFields() // Field limiting
    .paginate(); // Pagination

  const products = await features.query;

  // Get total count for pagination
  const totalProducts = await Product.countDocuments(filter);

  // Calculate pagination info
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const totalPages = Math.ceil(totalProducts / limit);

  // Get available filters for frontend
  const filters = await getAvailableFilters(filter);

  res.status(200).json({
    success: true,
    results: products.length,
    totalProducts,
    pagination: {
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      limit,
    },
    filters,
    products,
  });
});

// Helper function to get available filters
const getAvailableFilters = async (baseFilter) => {
  const [brands, priceRange, categories] = await Promise.all([
    // Get available brands
    Product.aggregate([
      { $match: baseFilter },
      { $group: { _id: "$specifications.brand", count: { $sum: 1 } } },
      { $match: { _id: { $ne: null } } },
      { $sort: { count: -1, _id: 1 } },
      { $limit: 20 },
    ]),

    // Get price range
    Product.aggregate([
      { $match: baseFilter },
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]),

    // Get categories with product counts
    Product.aggregate([
      { $match: baseFilter },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      { $unwind: "$categoryInfo" },
      { $sort: { count: -1 } },
    ]),
  ]);

  return {
    brands: brands.map((b) => ({ name: b._id, count: b.count })),
    priceRange: priceRange[0] || { minPrice: 0, maxPrice: 0 },
    categories: categories.map((c) => ({
      _id: c._id,
      name: c.categoryInfo.name,
      count: c.count,
    })),
  };
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate("category", "name slug description")
    .populate("reviews.user", "name avatar");

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  if (!product.isActive) {
    return next(new AppError("Product is not available", 404));
  }

  // Increment view count (async, don't wait)
  Product.findByIdAndUpdate(
    req.params.id,
    { $inc: { viewCount: 1 } },
    { new: false }
  ).catch((err) => console.log("View count increment failed:", err.message));

  // Just send the category info directly
  res.status(200).json({
    success: true,
    product,
    category: product.category, // This is enough for flat categories
  });
});

// @desc    Search products with advanced filters
// @route   GET /api/products/search
// @access  Public
const searchProducts = catchAsync(async (req, res, next) => {
  const { q: searchTerm } = req.query;

  if (!searchTerm || searchTerm.trim().length < 2) {
    return next(new AppError("Search term must be at least 2 characters", 400));
  }

  // Create search query
  const searchQuery = {
    $and: [
      { isActive: true },
      {
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
          { shortDescription: { $regex: searchTerm, $options: "i" } },
          { "specifications.brand": { $regex: searchTerm, $options: "i" } },
          { "specifications.model": { $regex: searchTerm, $options: "i" } },
          {
            "specifications.partNumber": { $regex: searchTerm, $options: "i" },
          },
          { tags: { $in: [new RegExp(searchTerm, "i")] } },
        ],
      },
    ],
  };

  // Apply additional filters
  const features = new APIFeatures(
    Product.find(searchQuery).populate("category", "name slug"),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query;
  const totalResults = await Product.countDocuments(searchQuery);

  // Get search suggestions
  const suggestions = await getSearchSuggestions(searchTerm);

  // Calculate pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;

  res.status(200).json({
    success: true,
    searchTerm,
    results: products.length,
    totalResults,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalResults / limit),
      hasNextPage: page < Math.ceil(totalResults / limit),
      hasPrevPage: page > 1,
    },
    suggestions,
    products,
  });
});

// Helper function to get search suggestions
const getSearchSuggestions = async (searchTerm) => {
  const suggestions = await Product.aggregate([
    {
      $match: {
        isActive: true,
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { "specifications.brand": { $regex: searchTerm, $options: "i" } },
        ],
      },
    },
    {
      $group: {
        _id: null,
        names: { $addToSet: "$name" },
        brands: { $addToSet: "$specifications.brand" },
      },
    },
    {
      $project: {
        suggestions: {
          $slice: [
            {
              $setUnion: ["$names", "$brands"],
            },
            10,
          ],
        },
      },
    },
  ]);

  return suggestions[0]?.suggestions || [];
};

// @desc    Get products by category (with stats & pagination)
// @route   GET /api/products/category/:categoryId
// @access  Public
const getProductsByCategory = catchAsync(async (req, res, next) => {
  // 1. Find the category
  const category = await Category.findById(req.params.categoryId);

  if (!category) {
    return next(new AppError("Category not found", 404));
  }
  if (!category.isActive) {
    return next(new AppError("Category is not available", 404));
  }

  const categoryIds = [category._id];

  // 3. Build query features (filter, sort, limitFields, paginate)
  const features = new APIFeatures(
    Product.find({
      category: { $in: categoryIds },
      isActive: true,
    }).populate("category", "name slug"),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // 4. Fetch products
  const products = await features.query;

  // 5. Count total products in these categories
  const totalProducts = await Product.countDocuments({
    category: { $in: categoryIds },
    isActive: true,
  });

  // 6. Calculate stats for this category group
  const stats = await Promise.all([
    Product.countDocuments({ category: { $in: categoryIds }, isActive: true }), // Total products in category
    Product.countDocuments({
      category: { $in: categoryIds },
      isActive: true,
      stock: { $gt: 0, $lte: 10 },
    }), // Low stock
    Product.countDocuments({
      category: { $in: categoryIds },
      isActive: true,
      stock: 0,
    }), // Out of stock
  ]);

  // 8. Pagination info
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;

  // 9. Send response
  res.status(200).json({
    success: true,
    category: {
      _id: category._id,
      name: category.name,
      description: category.description,
      image: category.image,
    },
    results: products.length,
    totalProducts,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      hasNextPage: page < Math.ceil(totalProducts / limit),
      hasPrevPage: page > 1,
    },
    stats: {
      totalProducts: stats[0],
      lowStockItems: stats[1],
      outOfStock: stats[2],
    },
    products,
  });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 8;

  const products = await Product.find({
    isFeatured: true,
    isActive: true,
    stock: { $gt: 0 },
  })
    .populate("category", "name slug")
    .sort({ averageRating: -1, totalSales: -1 })
    .limit(limit);

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
const getNewArrivals = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 8;
  const daysBack = parseInt(req.query.days) || 30;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysBack);

  const products = await Product.find({
    isActive: true,
    stock: { $gt: 0 },
    createdAt: { $gte: startDate },
  })
    .populate("category", "name slug")
    .sort({ createdAt: -1 })
    .limit(limit);

  res.status(200).json({
    success: true,
    count: products.length,
    daysBack,
    products,
  });
});

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
const getRelatedProducts = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  const limit = parseInt(req.query.limit) || 4;

  // Get related products from same category and brand
  const relatedProducts = await Product.find({
    $and: [
      { _id: { $ne: product._id } },
      { isActive: true },
      { stock: { $gt: 0 } },
      {
        $or: [
          { category: product.category },
          { "specifications.brand": product.specifications?.brand },
        ],
      },
    ],
  })
    .populate("category", "name slug")
    .sort({ averageRating: -1, totalSales: -1 })
    .limit(limit);

  res.status(200).json({
    success: true,
    count: relatedProducts.length,
    products: relatedProducts,
  });
});

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
const getProductReviews = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate(
    "reviews.user",
    "name avatar"
  );

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  // Sort reviews by date (newest first)
  const sortedReviews = product.reviews.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Calculate rating distribution
  const ratingDistribution = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  product.reviews.forEach((review) => {
    ratingDistribution[review.rating]++;
  });

  res.status(200).json({
    success: true,
    averageRating: product.averageRating,
    totalReviews: product.numReviews,
    ratingDistribution,
    reviews: sortedReviews,
  });
});

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
const addProductReview = catchAsync(async (req, res, next) => {
  const { rating, comment } = req.body;

  // Validation
  if (!rating || !comment) {
    return next(new AppError("Please provide rating and comment", 400));
  }

  if (rating < 1 || rating > 5) {
    return next(new AppError("Rating must be between 1 and 5", 400));
  }

  if (comment.length < 10) {
    return next(new AppError("Comment must be at least 10 characters", 400));
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  // Check if user already reviewed this product
  const existingReview = product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );

  if (existingReview) {
    return next(new AppError("You have already reviewed this product", 400));
  }

  // Add review
  try {
    await product.addReview(req.user._id, req.user.name, rating, comment);

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      averageRating: product.averageRating,
      totalReviews: product.numReviews,
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
});

// @desc    Get product specifications
// @route   GET /api/products/:id/specifications
// @access  Public
const getProductSpecifications = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .select("name specifications category")
    .populate("category", "name attributes");

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  // Get category attributes for structured display
  const categoryAttributes = product.category?.attributes || [];

  // Organize specifications by category attributes
  const organizedSpecs = {};
  const specs = product.specifications || {};

  categoryAttributes.forEach((attr) => {
    if (specs[attr.name]) {
      organizedSpecs[attr.name] = {
        value: specs[attr.name],
        type: attr.type,
        label: attr.name.charAt(0).toUpperCase() + attr.name.slice(1),
      };
    }
  });

  // Add any additional specifications not in category attributes
  Object.keys(specs).forEach((key) => {
    if (!organizedSpecs[key] && specs[key]) {
      organizedSpecs[key] = {
        value: specs[key],
        type: "text",
        label: key.charAt(0).toUpperCase() + key.slice(1),
      };
    }
  });

  res.status(200).json({
    success: true,
    productName: product.name,
    specifications: organizedSpecs,
    rawSpecifications: specs,
  });
});

// @desc    Update product stock (can be used by authenticated users to check real-time stock)
// @route   GET /api/products/:id/stock
// @access  Public (with optional auth)
exports.updateProductStock = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id).select(
    "name stock availability minOrderQuantity maxOrderQuantity"
  );

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  // Calculate stock status
  let stockStatus = "in_stock";
  if (product.stock === 0) {
    stockStatus = "out_of_stock";
  } else if (product.stock <= 10) {
    stockStatus = "low_stock";
  }

  // Check if user is authenticated for detailed stock info
  const isAuthenticated = req.user ? true : false;

  const stockInfo = {
    availability: product.availability,
    stockStatus,
    minOrderQuantity: product.minOrderQuantity,
    maxOrderQuantity: product.maxOrderQuantity,
  };

  // Show exact stock only to authenticated users
  if (isAuthenticated) {
    stockInfo.exactStock = product.stock;
  } else {
    // Show general availability to anonymous users
    stockInfo.inStock = product.stock > 0;
    if (product.stock > 50) {
      stockInfo.stockLevel = "high";
    } else if (product.stock > 10) {
      stockInfo.stockLevel = "medium";
    } else if (product.stock > 0) {
      stockInfo.stockLevel = "low";
    } else {
      stockInfo.stockLevel = "out";
    }
  }

  res.status(200).json({
    success: true,
    productName: product.name,
    stock: stockInfo,
  });
});
// Additional utility functions and extended features for productController.js

// Helper function to format product data for API response
const formatProductResponse = (product) => {
  const productObj = product.toObject();

  // Add computed fields
  productObj.discountPercentage = product.discountPercentage;
  productObj.stockStatus = product.stockStatus;
  productObj.primaryImage = product.primaryImage;

  // Format price breaks for display
  if (productObj.priceBreaks && productObj.priceBreaks.length > 0) {
    productObj.priceBreaks = productObj.priceBreaks.sort(
      (a, b) => a.quantity - b.quantity
    );
  }

  // Calculate savings if original price exists
  if (productObj.originalPrice && productObj.price < productObj.originalPrice) {
    productObj.savings = productObj.originalPrice - productObj.price;
  }

  return productObj;
};

// Helper function to get product comparison data
const getProductComparison = async (productIds) => {
  const products = await Product.find({
    _id: { $in: productIds },
    isActive: true,
  }).populate("category", "name");

  if (products.length === 0) {
    return [];
  }

  // Get all unique specification keys across products
  const allSpecKeys = new Set();
  products.forEach((product) => {
    if (product.specifications) {
      Object.keys(product.specifications).forEach((key) => {
        if (product.specifications[key]) {
          allSpecKeys.add(key);
        }
      });
    }
  });

  // Format comparison data
  const comparison = {
    products: products.map((product) => ({
      _id: product._id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      images: product.images,
      averageRating: product.averageRating,
      numReviews: product.numReviews,
      category: product.category,
      specifications: product.specifications || {},
    })),
    specificationKeys: Array.from(allSpecKeys).sort(),
  };

  return comparison;
};

// Helper function to track product views and generate recommendations
const trackViewAndGenerateRecommendations = async (
  productId,
  userId = null
) => {
  try {
    const product = await Product.findById(productId);
    if (!product) return null;

    // Increment view count
    await product.incrementViewCount();

    // If user is logged in, we could track their viewing history
    // This is a simplified recommendation based on category and brand
    const recommendations = await Product.find({
      _id: { $ne: productId },
      $or: [
        { category: product.category },
        { "specifications.brand": product.specifications?.brand },
      ],
      isActive: true,
      stock: { $gt: 0 },
    })
      .populate("category", "name")
      .sort({ averageRating: -1, totalSales: -1 })
      .limit(6);

    return recommendations;
  } catch (error) {
    console.error("Error tracking view:", error);
    return null;
  }
};

// Extended search functionality with autocomplete
const getSearchAutocomplete = async (query, limit = 10) => {
  if (!query || query.length < 2) return [];

  const suggestions = await Product.aggregate([
    {
      $match: {
        isActive: true,
        $or: [
          { name: { $regex: `^${query}`, $options: "i" } },
          { "specifications.brand": { $regex: `^${query}`, $options: "i" } },
          { "specifications.model": { $regex: `^${query}`, $options: "i" } },
        ],
      },
    },
    {
      $project: {
        suggestion: "$name",
        type: "product",
        category: 1,
        price: 1,
        image: { $arrayElemAt: ["$images.url", 0] },
      },
    },
    { $limit: limit },
  ]);

  // Also get brand suggestions
  const brandSuggestions = await Product.aggregate([
    {
      $match: {
        isActive: true,
        "specifications.brand": { $regex: `^${query}`, $options: "i" },
      },
    },
    {
      $group: {
        _id: "$specifications.brand",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        suggestion: "$_id",
        type: "brand",
        count: 1,
      },
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  return [...suggestions, ...brandSuggestions];
};

// Advanced filtering helper
const buildAdvancedFilter = (queryParams) => {
  const filter = { isActive: true };

  // Price range
  if (queryParams.priceMin || queryParams.priceMax) {
    filter.price = {};
    if (queryParams.priceMin)
      filter.price.$gte = parseFloat(queryParams.priceMin);
    if (queryParams.priceMax)
      filter.price.$lte = parseFloat(queryParams.priceMax);
  }

  // Rating filter
  if (queryParams.rating) {
    filter.averageRating = { $gte: parseFloat(queryParams.rating) };
  }

  // Availability filters
  if (queryParams.inStock === "true") {
    filter.stock = { $gt: 0 };
  }

  if (queryParams.featured === "true") {
    filter.isFeatured = true;
  }

  if (queryParams.onSale === "true") {
    filter.isOnSale = true;
  }

  // Brand filter (multiple brands)
  if (queryParams.brands) {
    const brands = Array.isArray(queryParams.brands)
      ? queryParams.brands
      : [queryParams.brands];
    filter["specifications.brand"] = { $in: brands };
  }

  // Specification filters
  const specFilters = {};
  Object.keys(queryParams).forEach((key) => {
    if (key.startsWith("spec_")) {
      const specKey = key.replace("spec_", "specifications.");
      specFilters[specKey] = queryParams[key];
    }
  });

  return { ...filter, ...specFilters };
};

// Product analytics helper
const getProductAnalytic = async (productId, period = "week") => {
  const product = await Product.findById(productId);
  if (!product) return null;

  let startDate;
  const endDate = new Date();

  switch (period) {
    case "day":
      startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
      break;
    case "week":
      startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "month":
      startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  // Get order statistics for this product
  const Order = require("../models/Order");

  const analytics = await Order.aggregate([
    {
      $match: {
        "items.product": product._id,
        createdAt: { $gte: startDate, $lte: endDate },
        status: { $in: ["processing", "shipped", "delivered"] },
      },
    },
    { $unwind: "$items" },
    { $match: { "items.product": product._id } },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalQuantity: { $sum: "$items.quantity" },
        totalRevenue: { $sum: "$items.totalPrice" },
        avgOrderValue: { $avg: "$items.totalPrice" },
      },
    },
  ]);

  return {
    product: {
      _id: product._id,
      name: product.name,
      currentStock: product.stock,
      totalSales: product.totalSales,
      viewCount: product.viewCount,
      averageRating: product.averageRating,
      numReviews: product.numReviews,
    },
    period,
    analytics: analytics[0] || {
      totalOrders: 0,
      totalQuantity: 0,
      totalRevenue: 0,
      avgOrderValue: 0,
    },
  };
};

// Inventory management helpers
const checkLowStock = async (threshold = 10) => {
  return await Product.find({
    stock: { $lte: threshold },
    isActive: true,
  })
    .populate("category", "name")
    .sort({ stock: 1 });
};

const updateProductStock = async (
  productId,
  quantity,
  operation = "subtract"
) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  return await product.updateStock(quantity, operation);
};

// Price calculation helpers
const calculatePriceForQuantity = async (productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  const unitPrice = product.getPriceForQuantity(quantity);
  const totalPrice = unitPrice * quantity;

  return {
    unitPrice,
    totalPrice,
    quantity,
    savings:
      product.price > unitPrice ? (product.price - unitPrice) * quantity : 0,
  };
};

// Additional controller methods that can be added to the main productController.js

// @desc    Get product comparison
// @route   POST /api/products/compare
// @access  Public
const compareProducts = catchAsync(async (req, res, next) => {
  const { productIds } = req.body;

  if (!productIds || !Array.isArray(productIds) || productIds.length < 2) {
    return next(
      new AppError("Please provide at least 2 product IDs for comparison", 400)
    );
  }

  if (productIds.length > 4) {
    return next(
      new AppError("Maximum 4 products can be compared at once", 400)
    );
  }

  const comparison = await getProductComparison(productIds);

  if (comparison.products.length === 0) {
    return next(new AppError("No valid products found for comparison", 404));
  }

  res.status(200).json({
    success: true,
    comparison,
  });
});

// @desc    Get search autocomplete suggestions
// @route   GET /api/products/autocomplete
// @access  Public
const getAutocomplete = catchAsync(async (req, res, next) => {
  const { q: query } = req.query;
  const limit = parseInt(req.query.limit) || 10;

  if (!query || query.length < 2) {
    return res.status(200).json({
      success: true,
      suggestions: [],
    });
  }

  const suggestions = await getSearchAutocomplete(query, limit);

  res.status(200).json({
    success: true,
    query,
    suggestions,
  });
});

// @desc    Get product recommendations based on viewing history
// @route   GET /api/products/:id/recommendations
// @access  Public
const getRecommendations = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 6;

  const recommendations = await trackViewAndGenerateRecommendations(
    req.params.id,
    req.user?._id
  );

  if (!recommendations) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    count: recommendations.length,
    products: recommendations.slice(0, limit),
  });
});

// @desc    Get product price for specific quantity
// @route   GET /api/products/:id/price
// @access  Public
const getProductPrice = catchAsync(async (req, res, next) => {
  const quantity = parseInt(req.query.quantity) || 1;

  if (quantity < 1) {
    return next(new AppError("Quantity must be at least 1", 400));
  }

  try {
    const pricing = await calculatePriceForQuantity(req.params.id, quantity);

    res.status(200).json({
      success: true,
      pricing,
    });
  } catch (error) {
    return next(new AppError(error.message, 404));
  }
});

// @desc    Get similar products based on specifications
// @route   GET /api/products/:id/similar
// @access  Public
const getSimilarProducts = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  const limit = parseInt(req.query.limit) || 8;

  // Build similarity query based on specifications
  const similarityQuery = {
    _id: { $ne: product._id },
    isActive: true,
    stock: { $gt: 0 },
  };

  // Add category match with higher weight
  const categoryMatch = { category: product.category };

  // Add specification matches
  const specMatches = [];
  if (product.specifications) {
    if (product.specifications.brand) {
      specMatches.push({
        "specifications.brand": product.specifications.brand,
      });
    }
    if (product.specifications.voltage) {
      specMatches.push({
        "specifications.voltage": product.specifications.voltage,
      });
    }
    if (product.specifications.power) {
      specMatches.push({
        "specifications.power": product.specifications.power,
      });
    }
  }

  // Price range similarity (±30% of original price)
  const priceRange = {
    price: {
      $gte: product.price * 0.7,
      $lte: product.price * 1.3,
    },
  };

  // Find products with different similarity levels
  let similarProducts = [];

  // Level 1: Same category + same brand
  if (product.specifications?.brand) {
    const level1 = await Product.find({
      ...similarityQuery,
      ...categoryMatch,
      "specifications.brand": product.specifications.brand,
    })
      .populate("category", "name slug")
      .sort({ averageRating: -1, totalSales: -1 })
      .limit(limit);

    similarProducts = [...similarProducts, ...level1];
  }

  // Level 2: Same category + similar price range
  if (similarProducts.length < limit) {
    const level2 = await Product.find({
      ...similarityQuery,
      ...categoryMatch,
      ...priceRange,
      _id: { $nin: similarProducts.map((p) => p._id) },
    })
      .populate("category", "name slug")
      .sort({ averageRating: -1, totalSales: -1 })
      .limit(limit - similarProducts.length);

    similarProducts = [...similarProducts, ...level2];
  }

  // Level 3: Same category only
  if (similarProducts.length < limit) {
    const level3 = await Product.find({
      ...similarityQuery,
      ...categoryMatch,
      _id: { $nin: similarProducts.map((p) => p._id) },
    })
      .populate("category", "name slug")
      .sort({ averageRating: -1, totalSales: -1 })
      .limit(limit - similarProducts.length);

    similarProducts = [...similarProducts, ...level3];
  }

  res.status(200).json({
    success: true,
    count: similarProducts.length,
    products: similarProducts.slice(0, limit),
  });
});

// @desc    Get products by multiple filters (advanced filtering)
// @route   POST /api/products/filter
// @access  Public
const filterProducts = catchAsync(async (req, res, next) => {
  const {
    categories,
    brands,
    priceRange,
    specifications,
    rating,
    availability,
    sortBy,
    page = 1,
    limit = 12,
  } = req.body;

  let filter = { isActive: true };

  // Category filter (including subcategories)
  if (categories && categories.length > 0) {
    const allCategoryIds = [];

    for (const categoryId of categories) {
      const category = await Category.findById(categoryId);
      if (category) {
        allCategoryIds.push(category._id);
        const descendants = await category.getAllDescendants();
        allCategoryIds.push(...descendants.map((d) => d._id));
      }
    }

    filter.category = { $in: allCategoryIds };
  }

  // Brand filter
  if (brands && brands.length > 0) {
    filter["specifications.brand"] = { $in: brands };
  }

  // Price range filter
  if (priceRange) {
    filter.price = {};
    if (priceRange.min) filter.price.$gte = priceRange.min;
    if (priceRange.max) filter.price.$lte = priceRange.max;
  }

  // Specification filters
  if (specifications && Object.keys(specifications).length > 0) {
    Object.keys(specifications).forEach((key) => {
      if (specifications[key]) {
        filter[`specifications.${key}`] = specifications[key];
      }
    });
  }

  // Rating filter
  if (rating) {
    filter.averageRating = { $gte: rating };
  }

  // Availability filter
  if (availability) {
    switch (availability) {
      case "in_stock":
        filter.stock = { $gt: 0 };
        break;
      case "out_of_stock":
        filter.stock = 0;
        break;
      case "low_stock":
        filter.stock = { $lte: 10, $gt: 0 };
        break;
    }
  }

  // Build sort object
  let sort = { createdAt: -1 }; // Default sort

  if (sortBy) {
    switch (sortBy) {
      case "price_low":
        sort = { price: 1 };
        break;
      case "price_high":
        sort = { price: -1 };
        break;
      case "rating":
        sort = { averageRating: -1, numReviews: -1 };
        break;
      case "popularity":
        sort = { totalSales: -1, viewCount: -1 };
        break;
      case "newest":
        sort = { createdAt: -1 };
        break;
      case "name":
        sort = { name: 1 };
        break;
    }
  }

  // Execute query with pagination
  const skip = (page - 1) * limit;

  const [products, totalProducts] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  // Get filter statistics
  const filterStats = await Product.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
        avgRating: { $avg: "$averageRating" },
        totalInStock: { $sum: { $cond: [{ $gt: ["$stock", 0] }, 1, 0] } },
        totalOutOfStock: { $sum: { $cond: [{ $eq: ["$stock", 0] }, 1, 0] } },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    results: products.length,
    totalProducts,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      hasNextPage: page < Math.ceil(totalProducts / limit),
      hasPrevPage: page > 1,
      limit,
    },
    filterStats: filterStats[0] || {},
    products,
  });
});

// @desc    Get product analytics (for internal use or admin)
// @route   GET /api/products/:id/analytics
// @access  Private/Admin (you may want to add admin middleware)
const getProductAnalytics = catchAsync(async (req, res, next) => {
  const period = req.query.period || "week";

  const analytics = await getProductAnalytic(req.params.id, period);

  if (!analytics) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    analytics,
  });
});

// @desc    Update product view count (called when product is viewed)
// @route   POST /api/products/:id/view
// @access  Public
const recordProductView = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  // Increment view count
  await product.incrementViewCount();

  // Get recommendations for the user
  const recommendations = await trackViewAndGenerateRecommendations(
    req.params.id,
    req.user?._id
  );

  res.status(200).json({
    success: true,
    message: "View recorded",
    recommendations: recommendations ? recommendations.slice(0, 4) : [],
  });
});
module.exports = {
  getAllProducts,
  getProductById,
  searchProducts,
  getProductsByCategory,
  getFeaturedProducts,
  getNewArrivals,
  getRelatedProducts,
  addProductReview,
  getProductReviews,
  getProductSpecifications,
  updateProductStock,
  // Additional controller methods
  compareProducts,
  getAutocomplete,
  getRecommendations,
  getProductPrice,
  getSimilarProducts,
  filterProducts,
  getProductAnalytics,
  recordProductView,
  // Helper functions (if you want to export them)
  formatProductResponse,
  getProductComparison,
  trackViewAndGenerateRecommendations,
  getSearchAutocomplete,
  buildAdvancedFilter,
  checkLowStock,
  calculatePriceForQuantity,
};
