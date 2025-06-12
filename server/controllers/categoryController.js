const Category = require("../models/Category");
const Product = require("../models/Product");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

// @desc    Get all categories with optional filtering
// @route   GET /api/categories
// @access  Public
exports.getAllCategories = catchAsync(async (req, res, next) => {
  const {
    includeInactive = false,
    parentId = null,
    level,
    featured,
    withProductCount = false,
    sort = "sortOrder name",
  } = req.query;

  // Build filter object
  let filter = {};

  if (!includeInactive) {
    filter.isActive = true;
  }

  if (parentId !== null) {
    filter.parent = parentId === "null" ? null : parentId;
  }

  if (level !== undefined) {
    filter.level = parseInt(level);
  }

  if (featured === "true") {
    filter.isFeatured = true;
  }

  let query = Category.find(filter);

  // Populate parent information if needed
  if (req.query.includeParent === "true") {
    query = query.populate("parent", "name slug");
  }

  // Sort categories
  query = query.sort(sort);

  const categories = await query;

  // Add product counts if requested
  if (withProductCount === "true") {
    for (let category of categories) {
      await category.updateProductCount();
    }
  }

  // Group by level for better organization
  const categoriesByLevel = categories.reduce((acc, category) => {
    const level = category.level;
    if (!acc[level]) acc[level] = [];
    acc[level].push(category);
    return acc;
  }, {});

  res.status(200).json({
    success: true,
    count: categories.length,
    categoriesByLevel,
    categories,
  });
});

// @desc    Get category tree structure
// @route   GET /api/categories/tree
// @access  Public
exports.getCategoryTree = catchAsync(async (req, res, next) => {
  const maxDepth = parseInt(req.query.maxDepth) || 3;
  const includeInactive = req.query.includeInactive === "true";
  const withProductCount = req.query.withProductCount === "true";

  // Get the complete category tree
  const tree = await Category.getCategoryTree(null, maxDepth);

  // Filter out inactive categories if needed
  const filteredTree = includeInactive ? tree : filterActiveCategories(tree);

  // Add product counts if requested
  if (withProductCount) {
    await addProductCountsToTree(filteredTree);
  }

  // Calculate tree statistics
  const stats = calculateTreeStats(filteredTree);

  res.status(200).json({
    success: true,
    maxDepth,
    stats,
    tree: filteredTree,
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

// @desc    Get single category by ID
// @route   GET /api/categories/:id
// @access  Public
exports.getCategoryById = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id)
    .populate("parent", "name slug description")
    .populate("children", "name slug description image productCount isActive");

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  // Get category path/breadcrumb
  const breadcrumb = await category.getBreadcrumb();

  // Get all attributes (including inherited from parent categories)
  const allAttributes = await category.getAllAttributes();

  // Update product count
  await category.updateProductCount();

  // Get direct children
  const children = await Category.find({
    parent: category._id,
    isActive: true,
  }).sort({ sortOrder: 1, name: 1 });

  // Get some featured products from this category
  const featuredProducts = await Product.find({
    category: category._id,
    isActive: true,
    isFeatured: true,
  })
    .populate("category", "name")
    .limit(8);

  // Category statistics
  const stats = await getCategoryStats(category._id);

  res.status(200).json({
    success: true,
    category: {
      ...category.toObject(),
      breadcrumb,
      allAttributes,
      children,
      stats,
    },
    featuredProducts,
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

// @desc    Create new category (Admin only)
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = catchAsync(async (req, res, next) => {
  const {
    name,
    description,
    parent,
    image,
    icon,
    color,
    isFeatured,
    sortOrder,
    attributes,
    metaTitle,
    metaDescription,
    metaKeywords,
  } = req.body;

  // Validation
  if (!name) {
    return next(new AppError("Category name is required", 400));
  }

  // Check if category with same name already exists
  const existingCategory = await Category.findOne({
    name: name.trim(),
    parent: parent || null,
  });

  if (existingCategory) {
    return next(
      new AppError("Category with this name already exists at this level", 400)
    );
  }

  // Validate parent if provided
  if (parent) {
    const parentCategory = await Category.findById(parent);
    if (!parentCategory) {
      return next(new AppError("Parent category not found", 404));
    }

    if (parentCategory.level >= 2) {
      return next(
        new AppError("Maximum category depth exceeded (3 levels)", 400)
      );
    }
  }

  // Create category
  const category = await Category.create({
    name: name.trim(),
    description,
    parent: parent || null,
    image,
    icon,
    color,
    isFeatured: isFeatured || false,
    sortOrder: sortOrder || 0,
    attributes: attributes || [],
    metaTitle,
    metaDescription,
    metaKeywords,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    category,
  });
});

// @desc    Update category (Admin only)
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  const {
    name,
    description,
    parent,
    image,
    icon,
    color,
    isActive,
    isFeatured,
    sortOrder,
    attributes,
    metaTitle,
    metaDescription,
    metaKeywords,
  } = req.body;

  // Validate name if provided
  if (name && name.trim() !== category.name) {
    const existingCategory = await Category.findOne({
      name: name.trim(),
      parent: parent !== undefined ? parent : category.parent,
      _id: { $ne: category._id },
    });

    if (existingCategory) {
      return next(
        new AppError(
          "Category with this name already exists at this level",
          400
        )
      );
    }
  }

  // Validate parent change if provided
  if (parent !== undefined && parent !== category.parent) {
    if (parent) {
      const newParent = await Category.findById(parent);
      if (!newParent) {
        return next(new AppError("New parent category not found", 404));
      }

      // Check for circular reference
      const newParentPath = await newParent.getFullPath();
      if (
        newParentPath.some(
          (cat) => cat._id.toString() === category._id.toString()
        )
      ) {
        return next(
          new AppError("Cannot move category to its own descendant", 400)
        );
      }

      // Check depth limit
      if (newParent.level >= 2) {
        return next(
          new AppError("Moving would exceed maximum nesting depth", 400)
        );
      }
    }

    // Move category
    try {
      await category.moveTo(parent);
    } catch (error) {
      return next(new AppError(error.message, 400));
    }
  }

  // Update other fields
  const updateFields = {
    updatedBy: req.user._id,
  };

  if (name) updateFields.name = name.trim();
  if (description !== undefined) updateFields.description = description;
  if (image !== undefined) updateFields.image = image;
  if (icon !== undefined) updateFields.icon = icon;
  if (color !== undefined) updateFields.color = color;
  if (isActive !== undefined) updateFields.isActive = isActive;
  if (isFeatured !== undefined) updateFields.isFeatured = isFeatured;
  if (sortOrder !== undefined) updateFields.sortOrder = sortOrder;
  if (attributes !== undefined) updateFields.attributes = attributes;
  if (metaTitle !== undefined) updateFields.metaTitle = metaTitle;
  if (metaDescription !== undefined)
    updateFields.metaDescription = metaDescription;
  if (metaKeywords !== undefined) updateFields.metaKeywords = metaKeywords;

  const updatedCategory = await Category.findByIdAndUpdate(
    req.params.id,
    updateFields,
    {
      new: true,
      runValidators: true,
    }
  ).populate("parent", "name slug");

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    category: updatedCategory,
  });
});

// @desc    Delete category (Admin only)
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  // Check if category has children
  const childrenCount = await Category.countDocuments({ parent: category._id });
  if (childrenCount > 0) {
    return next(
      new AppError(
        "Cannot delete category with subcategories. Please delete or move subcategories first.",
        400
      )
    );
  }

  // Check if category has products
  const productCount = await Product.countDocuments({ category: category._id });
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
