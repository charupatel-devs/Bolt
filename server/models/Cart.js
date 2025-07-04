const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
  subtotal: {
    type: Number,
    default: 0,
  },
  shippingCost: {
    type: Number,
    default: 0,
  },
  taxAmount: {
    type: Number,
    default: 0,
  },
  discountAmount: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    default: 0,
  },
  couponCode: String,
  discountType: String,
  freeShipping: {
    type: Boolean,
    default: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
cartSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Recalculate cart totals before save
cartSchema.pre("save", function (next) {
  this.subtotal = this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  this.taxAmount = Math.round(this.subtotal * 0.18 * 100) / 100;
  this.totalAmount =
    this.subtotal + this.shippingCost + this.taxAmount - this.discountAmount;

  next();
});

module.exports = mongoose.model("Cart", cartSchema);
