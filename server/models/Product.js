const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide product name"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide product description"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    shortDescription: {
      type: String,
      maxlength: [300, "Short description cannot exceed 300 characters"],
    },
    sku: {
      type: String,
      required: [true, "Please provide SKU"],
      unique: true,
      uppercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Please select a category"],
    },
    price: {
      type: Number,
      required: [true, "Please provide product price"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Original price cannot be negative"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
    },
    priceBreaks: [
      {
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // Dynamic specifications stored as key-value pairs
    specifications: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: new Map(),
    },

    stock: {
      type: Number,
      required: [true, "Please provide stock quantity"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    minOrderQuantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    maxOrderQuantity: {
      type: Number,
      default: 1000,
    },
    unit: {
      type: String,
      default: "piece",
      enum: ["piece", "meter", "kilogram", "liter", "box", "pack"],
    },
    weight: {
      type: Number,
      min: 0,
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: {
        type: String,
        enum: ["mm", "cm", "inch"],
        default: "mm",
      },
    },
    tags: [String],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    isOnSale: {
      type: Boolean,
      default: false,
    },
    availability: {
      type: String,
      enum: ["in_stock", "out_of_stock", "pre_order", "discontinued"],
      default: "in_stock",
    },
    leadTime: {
      type: String,
      default: "1-2 business days",
    },
    reviews: [reviewSchema],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    totalSales: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    seoTitle: String,
    seoDescription: String,
    seoKeywords: [String],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better performance
productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ stock: 1 });

// Create compound indexes for common specification filters
productSchema.index({ "specifications.brand": 1 });
productSchema.index({ "specifications.voltage": 1 });
productSchema.index({ "specifications.power": 1 });
productSchema.index({ "specifications.speed": 1 });

productSchema.methods.incrementViewCount = async function () {
  this.viewCount += 1;
  await this.save();
};
// Virtual for primary image
productSchema.virtual("primaryImage").get(function () {
  const primary = Array.isArray(this.images)
    ? this.images.find((img) => img.isPrimary)
    : null;
  return primary
    ? primary.url
    : Array.isArray(this.images) && this.images[0]
      ? this.images[0].url
      : null;
});

// Method to set specification
productSchema.methods.setSpecification = function (key, value) {
  if (!this.specifications) {
    this.specifications = new Map();
  }
  this.specifications.set(key, value);
  this.markModified("specifications");
  return this;
};

// Method to get specification
productSchema.methods.getSpecification = function (key) {
  return this.specifications ? this.specifications.get(key) : undefined;
};

// Method to get all specifications as object
productSchema.methods.getSpecificationsObject = function () {
  if (!this.specifications) return {};
  return Object.fromEntries(this.specifications);
};

// Static method for advanced filtering
productSchema.statics.filterBySpecifications = function (
  categoryId,
  filters,
  options = {}
) {
  const {
    sort = "-createdAt",
    limit = 20,
    page = 1,
    minPrice,
    maxPrice,
    inStock = true,
  } = options;

  let query = {
    category: categoryId,
    isActive: true,
  };

  // Price range filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = minPrice;
    if (maxPrice) query.price.$lte = maxPrice;
  }

  // Stock filter
  if (inStock) {
    query.stock = { $gt: 0 };
  }

  // Add specification filters
  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      // Multiple values (checkbox filters)
      query[`specifications.${key}`] = { $in: value };
    } else if (
      typeof value === "object" &&
      value.min !== undefined &&
      value.max !== undefined
    ) {
      // Range filter
      query[`specifications.${key}`] = {
        $gte: value.min,
        $lte: value.max,
      };
    } else {
      // Single value
      query[`specifications.${key}`] = value;
    }
  });

  const skip = (page - 1) * limit;

  return this.find(query)
    .populate("category", "name slug")
    .sort(sort)
    .skip(skip)
    .limit(limit);
};
productSchema.methods.getPriceForQuantity = function (quantity) {
  // Basic example: same price per item, can customize for discounts later
  return this.price * quantity;
};
// Static method to get filter options for a category
productSchema.statics.getFilterOptions = async function (categoryId) {
  const Category = mongoose.model("Category");
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new Error("Category not found");
  }

  const filterableAttributes = category.getFilterableAttributes();
  const filterOptions = {};

  for (const attr of filterableAttributes) {
    if (attr.type === "select" || attr.type === "multiselect") {
      // For predefined options
      filterOptions[attr.name] = {
        type: attr.filterConfig.filterType,
        label: attr.label,
        options: attr.options.map((opt) => ({
          value: opt,
          label: opt,
          count: 0,
        })),
      };
    } else if (attr.type === "range" || attr.type === "number") {
      // Get min/max values from products
      const aggregation = await this.aggregate([
        {
          $match: {
            category: mongoose.Types.ObjectId(categoryId),
            isActive: true,
          },
        },
        {
          $group: {
            _id: null,
            min: { $min: `$specifications.${attr.name}` },
            max: { $max: `$specifications.${attr.name}` },
          },
        },
      ]);

      const range = aggregation[0] || { min: 0, max: 100 };
      filterOptions[attr.name] = {
        type: "range",
        label: attr.label,
        unit: attr.unit,
        min: range.min,
        max: range.max,
      };
    } else {
      // For text/other types, get unique values
      const uniqueValues = await this.distinct(`specifications.${attr.name}`, {
        category: categoryId,
        isActive: true,
      });

      filterOptions[attr.name] = {
        type: attr.filterConfig.filterType,
        label: attr.label,
        options: uniqueValues.map((val) => ({
          value: val,
          label: val,
          count: 0,
        })),
      };
    }
  }

  // Get counts for each option
  for (const [attrName, filterData] of Object.entries(filterOptions)) {
    if (filterData.options) {
      for (const option of filterData.options) {
        const count = await this.countDocuments({
          category: categoryId,
          isActive: true,
          [`specifications.${attrName}`]: option.value,
        });
        option.count = count;
      }
    }
  }

  return filterOptions;
};

module.exports = mongoose.model("Product", productSchema);
