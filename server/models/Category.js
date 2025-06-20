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
    tags: [String], // Simple tags for categorization
    image: {
      type: String, // Optional image URL
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

    // Dynamic attributes for this category
    attributes: [
      {
        name: {
          type: String,
          required: true,
        },
        label: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ["text", "number", "select", "multiselect", "boolean", "range"],
          default: "text",
        },
        unit: String, // For number types (e.g., "W", "V", "rpm", "kg")
        options: [String], // For select and multiselect types
        isRequired: {
          type: Boolean,
          default: false,
        },
        isFilterable: {
          type: Boolean,
          default: true,
        },
        displayOrder: {
          type: Number,
          default: 0,
        },
        validationRules: {
          min: Number,
          max: Number,
          pattern: String, // Regex pattern for text validation
        },
        filterConfig: {
          showInFilters: {
            type: Boolean,
            default: true,
          },
          filterType: {
            type: String,
            enum: ["checkbox", "radio", "range", "dropdown"],
            default: "checkbox",
          },
          groupName: String, // For grouping filters in UI
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

// Indexes
categorySchema.index({ name: 1 });
categorySchema.index({ slug: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ isFeatured: 1 });
categorySchema.index({ tags: 1 });

// Pre-save middleware to generate slug
categorySchema.pre("save", async function (next) {
  try {
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
    next();
  } catch (error) {
    next(error);
  }
});

// Method to get filterable attributes
categorySchema.methods.getFilterableAttributes = function () {
  return this.attributes
    .filter((attr) => attr.isFilterable && attr.filterConfig.showInFilters)
    .sort((a, b) => a.displayOrder - b.displayOrder);
};

// Static method to get category with attributes
categorySchema.statics.getCategoryWithAttributes = function (categoryId) {
  return this.findById(categoryId).select("name slug attributes");
};

// Method to add tag
categorySchema.methods.addTag = function (tag) {
  if (!this.tags.includes(tag.toLowerCase())) {
    this.tags.push(tag.toLowerCase());
  }
  return this.save();
};

// Method to remove tag
categorySchema.methods.removeTag = function (tag) {
  this.tags = this.tags.filter((t) => t !== tag.toLowerCase());
  return this.save();
};

module.exports = mongoose.model("Category", categorySchema);
