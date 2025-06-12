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

const specificationSchema = new mongoose.Schema(
  {
    brand: String,
    model: String,
    manufacturer: String,
    partNumber: String,
    voltage: String,
    current: String,
    power: String,
    resistance: String,
    capacitance: String,
    frequency: String,
    temperature: String,
    dimensions: String,
    weight: String,
    material: String,
    color: String,
    warranty: String,
    certifications: [String],
    features: [String],
    applications: [String],
    packageType: String,
    mountingType: String,
    operatingTemperature: String,
    storageTemperature: String,
  },
  { _id: false }
);

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
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
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
    specifications: specificationSchema,
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
productSchema.index({
  name: "text",
  description: "text",
  "specifications.brand": "text",
});
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ stock: 1 });
productSchema.index({ "specifications.brand": 1 });

// Virtual for discount percentage
productSchema.virtual("discountPercentage").get(function () {
  if (this.originalPrice && this.price) {
    return Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100
    );
  }
  return 0;
});

// Virtual for stock status
productSchema.virtual("stockStatus").get(function () {
  if (this.stock === 0) return "out_of_stock";
  if (this.stock <= 10) return "low_stock";
  return "in_stock";
});

// Virtual for primary image
productSchema.virtual("primaryImage").get(function () {
  const primary = this.images.find((img) => img.isPrimary);
  return primary ? primary.url : this.images[0] ? this.images[0].url : null;
});

// Pre-save middleware to update availability based on stock
productSchema.pre("save", function (next) {
  if (this.stock === 0) {
    this.availability = "out_of_stock";
  } else if (this.stock > 0 && this.availability === "out_of_stock") {
    this.availability = "in_stock";
  }

  // Calculate discount if originalPrice is set
  if (this.originalPrice && this.price) {
    this.discount = Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100
    );
  }

  next();
});

// Method to calculate average rating
productSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    this.numReviews = 0;
  } else {
    const totalRating = this.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    this.averageRating =
      Math.round((totalRating / this.reviews.length) * 10) / 10;
    this.numReviews = this.reviews.length;
  }
  return this.save();
};

// Method to add review
productSchema.methods.addReview = function (userId, userName, rating, comment) {
  // Check if user already reviewed this product
  const existingReview = this.reviews.find(
    (review) => review.user.toString() === userId.toString()
  );

  if (existingReview) {
    throw new Error("You have already reviewed this product");
  }

  this.reviews.push({
    user: userId,
    name: userName,
    rating,
    comment,
  });

  return this.calculateAverageRating();
};

// Method to update stock
productSchema.methods.updateStock = function (
  quantity,
  operation = "subtract"
) {
  if (operation === "subtract") {
    if (this.stock < quantity) {
      throw new Error("Insufficient stock");
    }
    this.stock -= quantity;
  } else if (operation === "add") {
    this.stock += quantity;
  }

  return this.save();
};

// Method to increment view count
productSchema.methods.incrementViewCount = function () {
  this.viewCount += 1;
  return this.save({ validateBeforeSave: false });
};

// Method to get price for quantity (considering price breaks)
productSchema.methods.getPriceForQuantity = function (quantity) {
  if (!this.priceBreaks || this.priceBreaks.length === 0) {
    return this.price;
  }

  // Sort price breaks by quantity in descending order
  const sortedPriceBreaks = this.priceBreaks.sort(
    (a, b) => b.quantity - a.quantity
  );

  // Find the applicable price break
  for (let priceBreak of sortedPriceBreaks) {
    if (quantity >= priceBreak.quantity) {
      return priceBreak.price;
    }
  }

  return this.price;
};

// Static method to get featured products
productSchema.statics.getFeaturedProducts = function (limit = 10) {
  return this.find({ isFeatured: true, isActive: true })
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get best sellers
productSchema.statics.getBestSellers = function (limit = 10) {
  return this.find({ isActive: true })
    .populate("category", "name")
    .sort({ totalSales: -1 })
    .limit(limit);
};

// Static method to get new arrivals
productSchema.statics.getNewArrivals = function (limit = 10) {
  return this.find({ isActive: true })
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to search products
productSchema.statics.searchProducts = function (searchTerm, options = {}) {
  const {
    category,
    minPrice,
    maxPrice,
    brand,
    inStock = true,
    sort = "-createdAt",
    limit = 20,
    page = 1,
  } = options;

  let query = { isActive: true };

  // Text search
  if (searchTerm) {
    query.$text = { $search: searchTerm };
  }

  // Category filter
  if (category) {
    query.category = category;
  }

  // Price range filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = minPrice;
    if (maxPrice) query.price.$lte = maxPrice;
  }

  // Brand filter
  if (brand) {
    query["specifications.brand"] = new RegExp(brand, "i");
  }

  // Stock filter
  if (inStock) {
    query.stock = { $gt: 0 };
  }

  const skip = (page - 1) * limit;

  return this.find(query)
    .populate("category", "name")
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

// Static method to get related products
productSchema.statics.getRelatedProducts = function (
  productId,
  categoryId,
  limit = 4
) {
  return this.find({
    _id: { $ne: productId },
    category: categoryId,
    isActive: true,
    stock: { $gt: 0 },
  })
    .populate("category", "name")
    .sort({ averageRating: -1, totalSales: -1 })
    .limit(limit);
};

// Pre-remove middleware
productSchema.pre("remove", async function (next) {
  try {
    // Remove product from all wishlists
    await this.model("User").updateMany(
      { wishlist: this._id },
      { $pull: { wishlist: this._id } }
    );
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Product", productSchema);
