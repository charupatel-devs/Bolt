const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide category name"],
      trim: true,
      unique: true,
      maxlength: [100, "Category name cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    level: {
      type: Number,
      default: 0,
      min: 0,
      max: 3,
    },
    image: {
      url: String,
      alt: String,
    },
    icon: String,
    color: {
      type: String,
      default: "#007bff",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    productCount: {
      type: Number,
      default: 0,
    },
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
    attributes: [
      {
        name: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ["text", "number", "boolean", "select", "multiselect"],
          default: "text",
        },
        options: [String], // For select and multiselect types
        isRequired: {
          type: Boolean,
          default: false,
        },
        isFilterable: {
          type: Boolean,
          default: true,
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better performance
categorySchema.index({ name: 1 });
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ level: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ isFeatured: 1 });
categorySchema.index({ sortOrder: 1 });

// Virtual for getting children categories
categorySchema.virtual("children", {
  ref: "Category",
  localField: "_id",
  foreignField: "parent",
});

// Virtual for full path (breadcrumb)
categorySchema.virtual("fullPath").get(function () {
  // This will be populated by a method since virtuals can't be async
  return this._fullPath || [];
});

// Pre-save middleware to generate slug and set level
categorySchema.pre("save", async function (next) {
  try {
    // Generate slug from name
    if (this.isModified("name")) {
      this.slug = this.name
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      // Ensure slug uniqueness
      let counter = 1;
      let originalSlug = this.slug;

      while (
        await this.constructor.findOne({
          slug: this.slug,
          _id: { $ne: this._id },
        })
      ) {
        this.slug = `${originalSlug}-${counter}`;
        counter++;
      }
    }

    // Set level based on parent
    if (this.parent) {
      const parentCategory = await this.constructor.findById(this.parent);
      if (parentCategory) {
        this.level = parentCategory.level + 1;

        // Prevent too deep nesting (max 3 levels: 0, 1, 2)
        if (this.level > 2) {
          throw new Error("Category nesting cannot exceed 3 levels");
        }
      }
    } else {
      this.level = 0;
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Pre-remove middleware to handle children and products
categorySchema.pre("remove", async function (next) {
  try {
    // Check if category has children
    const childrenCount = await this.constructor.countDocuments({
      parent: this._id,
    });
    if (childrenCount > 0) {
      throw new Error(
        "Cannot delete category with subcategories. Please delete subcategories first."
      );
    }

    // Check if category has products
    const Product = this.model("Product");
    const productCount = await Product.countDocuments({ category: this._id });
    if (productCount > 0) {
      throw new Error(
        "Cannot delete category with products. Please move or delete products first."
      );
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Method to get full category path
categorySchema.methods.getFullPath = async function () {
  const path = [];
  let currentCategory = this;

  while (currentCategory) {
    path.unshift({
      _id: currentCategory._id,
      name: currentCategory.name,
      slug: currentCategory.slug,
    });

    if (currentCategory.parent) {
      currentCategory = await this.constructor.findById(currentCategory.parent);
    } else {
      currentCategory = null;
    }
  }

  this._fullPath = path;
  return path;
};

// Method to get all descendants (recursive)
categorySchema.methods.getAllDescendants = async function () {
  const descendants = [];

  const getChildren = async (categoryId) => {
    const children = await this.constructor.find({ parent: categoryId });

    for (const child of children) {
      descendants.push(child);
      await getChildren(child._id);
    }
  };

  await getChildren(this._id);
  return descendants;
};

// Method to update product count
categorySchema.methods.updateProductCount = async function () {
  const Product = this.model("Product");

  // Get direct product count
  const directCount = await Product.countDocuments({
    category: this._id,
    isActive: true,
  });

  // Get products from all descendant categories
  const descendants = await this.getAllDescendants();
  const descendantIds = descendants.map((d) => d._id);

  const descendantCount = await Product.countDocuments({
    category: { $in: descendantIds },
    isActive: true,
  });

  this.productCount = directCount + descendantCount;
  await this.save();

  return this.productCount;
};

// Method to move category to new parent
categorySchema.methods.moveTo = async function (newParentId) {
  if (newParentId) {
    const newParent = await this.constructor.findById(newParentId);
    if (!newParent) {
      throw new Error("New parent category not found");
    }

    // Check if moving would create circular reference
    const newParentPath = await newParent.getFullPath();
    if (
      newParentPath.some((cat) => cat._id.toString() === this._id.toString())
    ) {
      throw new Error("Cannot move category to its own descendant");
    }

    // Check depth limit
    if (newParent.level >= 2) {
      throw new Error("Moving would exceed maximum nesting depth");
    }

    this.parent = newParentId;
  } else {
    this.parent = null;
  }

  await this.save();

  // Update all children levels recursively
  await this.updateChildrenLevels();

  return this;
};

// Method to update children levels recursively
categorySchema.methods.updateChildrenLevels = async function () {
  const children = await this.constructor.find({ parent: this._id });

  for (const child of children) {
    child.level = this.level + 1;
    await child.save();
    await child.updateChildrenLevels();
  }
};

// Static method to get category tree
categorySchema.statics.getCategoryTree = async function (
  parentId = null,
  maxDepth = 3
) {
  const categories = await this.find({
    parent: parentId,
    isActive: true,
  }).sort({ sortOrder: 1, name: 1 });

  const tree = [];

  for (const category of categories) {
    const categoryObj = category.toObject();

    if (category.level < maxDepth) {
      categoryObj.children = await this.getCategoryTree(category._id, maxDepth);
    }

    tree.push(categoryObj);
  }

  return tree;
};

// Static method to get root categories
categorySchema.statics.getRootCategories = function () {
  return this.find({
    parent: null,
    isActive: true,
  }).sort({ sortOrder: 1, name: 1 });
};

// Static method to get featured categories
categorySchema.statics.getFeaturedCategories = function (limit = 10) {
  return this.find({
    isFeatured: true,
    isActive: true,
  })
    .sort({ sortOrder: 1, name: 1 })
    .limit(limit);
};

// Static method to search categories
categorySchema.statics.searchCategories = function (searchTerm, options = {}) {
  const { includeInactive = false, limit = 20 } = options;

  let query = {};

  if (!includeInactive) {
    query.isActive = true;
  }

  if (searchTerm) {
    query.$or = [
      { name: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
    ];
  }

  return this.find(query)
    .populate("parent", "name slug")
    .sort({ name: 1 })
    .limit(limit);
};

// Static method to get categories with product counts
categorySchema.statics.getCategoriesWithCounts = async function () {
  const Product = mongoose.model("Product");

  return await this.aggregate([
    {
      $match: { isActive: true },
    },
    {
      $lookup: {
        from: "products",
        let: { categoryId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$category", "$categoryId"] },
              isActive: true,
            },
          },
        ],
        as: "products",
      },
    },
    {
      $addFields: {
        productCount: { $size: "$products" },
      },
    },
    {
      $project: {
        products: 0,
      },
    },
    {
      $sort: { name: 1 },
    },
  ]);
};

// Static method to rebuild category tree (for data integrity)
categorySchema.statics.rebuildTree = async function () {
  // Reset all levels
  await this.updateMany({}, { level: 0 });

  // Get all categories ordered by creation
  const categories = await this.find().sort({ createdAt: 1 });

  for (const category of categories) {
    if (category.parent) {
      const parent = await this.findById(category.parent);
      if (parent) {
        category.level = parent.level + 1;
        await category.save();
      }
    }
  }

  console.log("Category tree rebuilt successfully");
};

// Method to get category breadcrumb
categorySchema.methods.getBreadcrumb = async function () {
  const path = await this.getFullPath();
  return path.map((cat) => ({
    name: cat.name,
    slug: cat.slug,
    url: `/categories/${cat.slug}`,
  }));
};

// Method to add attribute
categorySchema.methods.addAttribute = function (attributeData) {
  const existingAttribute = this.attributes.find(
    (attr) => attr.name.toLowerCase() === attributeData.name.toLowerCase()
  );

  if (existingAttribute) {
    throw new Error("Attribute with this name already exists");
  }

  this.attributes.push(attributeData);
  return this.save();
};

// Method to remove attribute
categorySchema.methods.removeAttribute = function (attributeName) {
  this.attributes = this.attributes.filter(
    (attr) => attr.name.toLowerCase() !== attributeName.toLowerCase()
  );
  return this.save();
};

// Method to update attribute
categorySchema.methods.updateAttribute = function (attributeName, updateData) {
  const attribute = this.attributes.find(
    (attr) => attr.name.toLowerCase() === attributeName.toLowerCase()
  );

  if (!attribute) {
    throw new Error("Attribute not found");
  }

  Object.assign(attribute, updateData);
  return this.save();
};

// Method to get all inherited attributes (from parent categories)
categorySchema.methods.getAllAttributes = async function () {
  const allAttributes = [...this.attributes];
  const path = await this.getFullPath();

  // Get attributes from parent categories (excluding current)
  for (let i = path.length - 2; i >= 0; i--) {
    const parentCategory = await this.constructor.findById(path[i]._id);
    if (parentCategory) {
      for (const attr of parentCategory.attributes) {
        // Only add if not already present
        if (
          !allAttributes.find(
            (a) => a.name.toLowerCase() === attr.name.toLowerCase()
          )
        ) {
          allAttributes.push(attr);
        }
      }
    }
  }

  return allAttributes;
};

// Post-save middleware to update parent product counts
categorySchema.post("save", async function (doc, next) {
  try {
    // Update product count for this category
    await doc.updateProductCount();

    // Update product count for parent categories up the tree
    let parent = doc.parent
      ? await this.constructor.findById(doc.parent)
      : null;

    while (parent) {
      await parent.updateProductCount();
      parent = parent.parent
        ? await this.constructor.findById(parent.parent)
        : null;
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Transform JSON output
categorySchema.methods.toJSON = function () {
  const categoryObject = this.toObject();

  // Remove internal fields if needed
  delete categoryObject.__v;

  return categoryObject;
};

module.exports = mongoose.model("Category", categorySchema);
