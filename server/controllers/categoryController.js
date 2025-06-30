const Category = require("../models/Category");
const Product = require("../models/Product");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

// @desc    Get all categories
// @route   GET /api/admin/categories
// @access  Private/Admin
exports.getAllCategories = catchAsync(async (req, res, next) => {
  const { search, isActive, isFeatured, tag, sortBy = "name" } = req.query;

  let query = {};

  // Search filter
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { tags: { $in: [new RegExp(search, "i")] } },
    ];
  }

  // Active filter
  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }

  // Featured filter
  if (isFeatured !== undefined) {
    query.isFeatured = isFeatured === "true";
  }

  // Tag filter
  if (tag) {
    query.tags = { $in: [tag] };
  }

  const categories = await Category.find(query)
    .populate("createdBy", "name email")
    .sort({ [sortBy]: 1 });

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories,
  });
});

// Helper function to filter active categories
const filterActiveCategories = (categories) => {
  return categories.filter((category) => {
    if (!category.isActive) return false;

    if (category.children && category.children.length > 0) {
      category.children = filterActiveCategories(category.children);
    }

    return true;
  });
};

// Helper function to add product counts to tree
const addProductCountsToTree = async (categories) => {
  for (let category of categories) {
    // Get products count for this category and its children
    const descendants = await Category.findById(category._id).then((cat) =>
      cat ? cat.getAllDescendants() : []
    );

    const categoryIds = [category._id, ...descendants.map((d) => d._id)];

    const productCount = await Product.countDocuments({
      category: { $in: categoryIds },
      isActive: true,
    });

    category.productCount = productCount;

    if (category.children && category.children.length > 0) {
      await addProductCountsToTree(category.children);
    }
  }
};

// Helper function to calculate tree statistics
const calculateTreeStats = (tree) => {
  let totalCategories = 0;
  let activeCategories = 0;
  let featuredCategories = 0;
  let categoriesByLevel = { 0: 0, 1: 0, 2: 0 };

  const countCategories = (categories, level = 0) => {
    categories.forEach((category) => {
      totalCategories++;

      if (category.isActive) activeCategories++;
      if (category.isFeatured) featuredCategories++;

      if (categoriesByLevel[level] !== undefined) {
        categoriesByLevel[level]++;
      }

      if (category.children && category.children.length > 0) {
        countCategories(category.children, level + 1);
      }
    });
  };

  countCategories(tree);

  return {
    totalCategories,
    activeCategories,
    featuredCategories,
    categoriesByLevel,
  };
};

// @desc    Search categories
// @route   GET /api/categories/search
// @access  Public
exports.searchCategories = catchAsync(async (req, res, next) => {
  const { q: searchTerm, includeInactive = false, limit = 20 } = req.query;

  if (!searchTerm || searchTerm.trim().length < 2) {
    return next(new AppError("Search term must be at least 2 characters", 400));
  }

  const categories = await Category.searchCategories(searchTerm, {
    includeInactive: includeInactive === "true",
    limit: parseInt(limit),
  });

  // Get breadcrumb for each category
  const categoriesWithBreadcrumb = await Promise.all(
    categories.map(async (category) => {
      const breadcrumb = await category.getBreadcrumb();
      return {
        ...category.toObject(),
        breadcrumb,
      };
    })
  );

  res.status(200).json({
    success: true,
    searchTerm,
    count: categories.length,
    categories: categoriesWithBreadcrumb,
  });
});
// @desc    Get single category
// @route   GET /api/admin/categories/:id
// @access  Private/Admin
exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id)
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email");

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});

// Helper function to get category statistics
const getCategoryStats = async (categoryId) => {
  // Get category and its descendants
  const category = await Category.findById(categoryId);
  const descendants = await category.getAllDescendants();
  const allCategoryIds = [categoryId, ...descendants.map((d) => d._id)];

  const [productStats, priceStats] = await Promise.all([
    // Product statistics
    Product.aggregate([
      {
        $match: {
          category: { $in: allCategoryIds },
          isActive: true,
        },
      },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          inStockProducts: {
            $sum: { $cond: [{ $gt: ["$stock", 0] }, 1, 0] },
          },
          outOfStockProducts: {
            $sum: { $cond: [{ $eq: ["$stock", 0] }, 1, 0] },
          },
          featuredProducts: {
            $sum: { $cond: ["$isFeatured", 1, 0] },
          },
          avgRating: { $avg: "$averageRating" },
          totalReviews: { $sum: "$numReviews" },
        },
      },
    ]),

    // Price statistics
    Product.aggregate([
      {
        $match: {
          category: { $in: allCategoryIds },
          isActive: true,
          stock: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          avgPrice: { $avg: "$price" },
        },
      },
    ]),
  ]);

  return {
    products: productStats[0] || {
      totalProducts: 0,
      inStockProducts: 0,
      outOfStockProducts: 0,
      featuredProducts: 0,
      avgRating: 0,
      totalReviews: 0,
    },
    pricing: priceStats[0] || {
      minPrice: 0,
      maxPrice: 0,
      avgPrice: 0,
    },
  };
};

// @desc    Get products in a category
// @route   GET /api/categories/:id/products
// @access  Public
exports.getCategoryProducts = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  if (!category.isActive) {
    return next(new AppError("Category is not available", 404));
  }

  // Get all descendant categories
  const descendants = await category.getAllDescendants();
  const categoryIds = [category._id, ...descendants.map((d) => d._id)];

  // Apply filters using APIFeatures
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

  const products = await features.query;

  // Get total count for pagination
  const totalProducts = await Product.countDocuments({
    category: { $in: categoryIds },
    isActive: true,
  });

  // Get available filters specific to this category
  const filters = await getCategoryFilters(categoryIds);

  // Calculate pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;

  res.status(200).json({
    success: true,
    category: {
      _id: category._id,
      name: category.name,
      description: category.description,
      breadcrumb: await category.getBreadcrumb(),
    },
    results: products.length,
    totalProducts,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      hasNextPage: page < Math.ceil(totalProducts / limit),
      hasPrevPage: page > 1,
    },
    filters,
    products,
  });
});

// Helper function to get category-specific filters
const getCategoryFilters = async (categoryIds) => {
  const [brands, priceRange, specifications] = await Promise.all([
    // Get available brands in this category
    Product.aggregate([
      { $match: { category: { $in: categoryIds }, isActive: true } },
      { $group: { _id: "$specifications.brand", count: { $sum: 1 } } },
      { $match: { _id: { $ne: null } } },
      { $sort: { count: -1, _id: 1 } },
      { $limit: 20 },
    ]),

    // Get price range
    Product.aggregate([
      { $match: { category: { $in: categoryIds }, isActive: true } },
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]),

    // Get common specifications
    Product.aggregate([
      { $match: { category: { $in: categoryIds }, isActive: true } },
      {
        $project: {
          specs: { $objectToArray: "$specifications" },
        },
      },
      { $unwind: "$specs" },
      {
        $group: {
          _id: "$specs.k",
          values: { $addToSet: "$specs.v" },
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $gte: 2 } } }, // Only specs that appear in multiple products
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
  ]);

  return {
    brands: brands.map((b) => ({ name: b._id, count: b.count })),
    priceRange: priceRange[0] || { minPrice: 0, maxPrice: 0 },
    specifications: specifications.map((spec) => ({
      name: spec._id,
      values: spec.values.filter((v) => v && v !== "").slice(0, 10),
      count: spec.count,
    })),
  };
};

// @desc    Get subcategories of a category
// @route   GET /api/categories/:id/subcategories
// @access  Public
exports.getSubcategories = catchAsync(async (req, res, next) => {
  const parentCategory = await Category.findById(req.params.id);

  if (!parentCategory) {
    return next(new AppError("Parent category not found", 404));
  }

  const includeInactive = req.query.includeInactive === "true";
  const withProductCount = req.query.withProductCount === "true";

  let filter = { parent: parentCategory._id };

  if (!includeInactive) {
    filter.isActive = true;
  }

  const subcategories = await Category.find(filter).sort({
    sortOrder: 1,
    name: 1,
  });

  // Add product counts if requested
  if (withProductCount) {
    for (let subcategory of subcategories) {
      await subcategory.updateProductCount();
    }
  }

  res.status(200).json({
    success: true,
    parentCategory: {
      _id: parentCategory._id,
      name: parentCategory.name,
      slug: parentCategory.slug,
    },
    count: subcategories.length,
    subcategories,
  });
});

/// @desc    Create new category (Admin only)
// @route   POST /api/admin/categories
// @access  Private/Admin
exports.createCategory = catchAsync(async (req, res, next) => {
  const { name, description, tags, image, attributes, isFeatured } = req.body;

  // Validation
  if (!name) {
    return next(new AppError("Category name is required", 400));
  }

  // Check if category with same name already exists
  const existingCategory = await Category.findOne({
    name: name.trim(),
  });

  if (existingCategory) {
    return next(new AppError("Category with this name already exists", 400));
  }

  // Create category
  const category = await Category.create({
    name: name.trim(),
    description,
    tags: tags || [],
    image,
    isFeatured: isFeatured || false,
    sortOrder: 0,
    attributes: attributes || [],
    createdBy: req.user?._id,
  });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
exports.updateCategory = catchAsync(async (req, res, next) => {
  const {
    name,
    description,
    tags,
    image,
    isFeatured,
    isActive,
    sortOrder,
    attributes,
  } = req.body;

  let category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  // Check if name is being changed and if it already exists
  if (name && name.trim() !== category.name) {
    const existingCategory = await Category.findOne({
      name: name.trim(),
      _id: { $ne: req.params.id },
    });

    if (existingCategory) {
      return next(new AppError("Category with this name already exists", 400));
    }
  }

  // Process attributes to ensure proper structure
  let processedAttributes;
  if (attributes) {
    // If attributes is an array, use it directly
    if (Array.isArray(attributes)) {
      processedAttributes = attributes.map((attr) => {
        // Remove any MongoDB-generated _id if it's a string
        const { _id, ...cleanAttr } = attr;
        return {
          ...cleanAttr,
          // Only include _id if it's a valid ObjectId, otherwise let Mongoose generate it
          ...(attr._id && typeof attr._id !== "string"
            ? { _id: attr._id }
            : {}),
        };
      });
    } else {
      // If attributes is a single object, wrap it in an array
      const { _id, ...cleanAttr } = attributes;
      processedAttributes = [
        {
          ...cleanAttr,
          ...(attributes._id && typeof attributes._id !== "string"
            ? { _id: attributes._id }
            : {}),
        },
      ];
    }
  }

  // Update fields
  const updateData = {
    ...(name && { name: name.trim() }),
    ...(description !== undefined && { description }),
    ...(tags && { tags }),
    ...(image !== undefined && { image }),
    ...(isFeatured !== undefined && { isFeatured }),
    ...(isActive !== undefined && { isActive }),
    ...(sortOrder !== undefined && { sortOrder }),
    ...(processedAttributes && { attributes: processedAttributes }),
    updatedBy: req.user?._id,
  };

  category = await Category.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: category,
  });
});

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  // Check if category has products
  const Product = require("../models/Product");
  const productCount = await Product.countDocuments({
    category: req.params.id,
    isActive: true,
  });

  if (productCount > 0) {
    return next(
      new AppError(
        `Cannot delete category with ${productCount} products. Please move or delete products first.`,
        400
      )
    );
  }

  await Category.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});
