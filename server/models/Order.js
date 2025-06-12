const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: String,
  sku: String,
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
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
});

const shippingAddressSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    addressLine1: {
      type: String,
      required: true,
    },
    addressLine2: String,
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
      default: "India",
    },
  },
  { _id: false }
);

const paymentInfoSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      enum: [
        "credit_card",
        "debit_card",
        "upi",
        "net_banking",
        "wallet",
        "cod",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    transactionId: String,
    paymentGateway: String,
    paymentDate: Date,
    refundId: String,
    refundAmount: Number,
    refundDate: Date,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    billingAddress: shippingAddressSchema,
    paymentInfo: paymentInfoSchema,
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    taxAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },
    orderNotes: String,
    adminNotes: String,
    trackingNumber: String,
    shippingProvider: String,
    estimatedDelivery: Date,
    shippedAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
    cancellationReason: String,
    isGift: {
      type: Boolean,
      default: false,
    },
    giftMessage: String,
    couponCode: String,
    invoiceNumber: String,
    invoiceDate: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better performance
orderSchema.index({ user: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ "paymentInfo.status": 1 });
orderSchema.index({ trackingNumber: 1 });

// Virtual for total items count
orderSchema.virtual("totalItems").get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for order age in days
orderSchema.virtual("orderAge").get(function () {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for status display
orderSchema.virtual("statusDisplay").get(function () {
  const statusMap = {
    pending: "Order Pending",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    refunded: "Refunded",
  };
  return statusMap[this.status] || this.status;
});

// Pre-save middleware to generate order number
orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    // Generate unique order number
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    this.orderNumber = `EM${timestamp.slice(-8)}${random}`;

    // Set invoice number and date for completed payments
    if (
      this.paymentInfo &&
      this.paymentInfo.status === "completed" &&
      !this.invoiceNumber
    ) {
      this.invoiceNumber = `INV-${this.orderNumber}`;
      this.invoiceDate = new Date();
    }
  }

  // Update status timestamps
  if (this.isModified("status")) {
    const now = new Date();
    switch (this.status) {
      case "shipped":
        if (!this.shippedAt) this.shippedAt = now;
        break;
      case "delivered":
        if (!this.deliveredAt) this.deliveredAt = now;
        break;
      case "cancelled":
        if (!this.cancelledAt) this.cancelledAt = now;
        break;
    }
  }

  next();
});

// Method to calculate order totals
orderSchema.methods.calculateTotals = function () {
  this.subtotal = this.items.reduce(
    (total, item) => total + item.totalPrice,
    0
  );

  // Calculate tax (18% GST for India)
  this.taxAmount = Math.round(this.subtotal * 0.18 * 100) / 100;

  // Calculate total
  this.totalAmount =
    this.subtotal + this.shippingCost + this.taxAmount - this.discountAmount;

  return this;
};

// Method to add item to order
orderSchema.methods.addItem = function (productData, quantity, price) {
  const existingItem = this.items.find(
    (item) => item.product.toString() === productData._id.toString()
  );

  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.totalPrice = existingItem.quantity * existingItem.price;
  } else {
    this.items.push({
      product: productData._id,
      name: productData.name,
      image: productData.primaryImage,
      sku: productData.sku,
      quantity,
      price,
      totalPrice: quantity * price,
    });
  }

  return this.calculateTotals();
};

// Method to remove item from order
orderSchema.methods.removeItem = function (productId) {
  this.items = this.items.filter(
    (item) => item.product.toString() !== productId.toString()
  );

  return this.calculateTotals();
};

// Method to update item quantity
orderSchema.methods.updateItemQuantity = function (productId, quantity) {
  const item = this.items.find(
    (item) => item.product.toString() === productId.toString()
  );

  if (item) {
    item.quantity = quantity;
    item.totalPrice = item.quantity * item.price;
    this.calculateTotals();
  }

  return this;
};

// Method to apply discount
orderSchema.methods.applyDiscount = function (
  discountAmount,
  couponCode = null
) {
  this.discountAmount = discountAmount;
  if (couponCode) {
    this.couponCode = couponCode;
  }
  return this.calculateTotals();
};

// Method to update shipping cost
orderSchema.methods.updateShippingCost = function (cost) {
  this.shippingCost = cost;
  return this.calculateTotals();
};

// Method to mark as paid
orderSchema.methods.markAsPaid = function (paymentData) {
  this.paymentInfo = {
    ...this.paymentInfo,
    ...paymentData,
    status: "completed",
    paymentDate: new Date(),
  };

  if (!this.invoiceNumber) {
    this.invoiceNumber = `INV-${this.orderNumber}`;
    this.invoiceDate = new Date();
  }

  // Update status to processing if it's pending
  if (this.status === "pending") {
    this.status = "processing";
  }

  return this.save();
};

// Method to cancel order
orderSchema.methods.cancelOrder = function (reason) {
  if (["delivered", "cancelled", "refunded"].includes(this.status)) {
    throw new Error("Cannot cancel this order");
  }

  this.status = "cancelled";
  this.cancelledAt = new Date();
  this.cancellationReason = reason;

  return this.save();
};

// Method to process refund
orderSchema.methods.processRefund = function (refundAmount, refundId) {
  this.paymentInfo.status = "refunded";
  this.paymentInfo.refundAmount = refundAmount || this.totalAmount;
  this.paymentInfo.refundId = refundId;
  this.paymentInfo.refundDate = new Date();
  this.status = "refunded";

  return this.save();
};

// Static method to get orders by status
orderSchema.statics.getOrdersByStatus = function (status, limit = 10) {
  return this.find({ status })
    .populate("user", "name email")
    .populate("items.product", "name images")
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get user's order history
orderSchema.statics.getUserOrders = function (userId, options = {}) {
  const { status, limit = 10, page = 1 } = options;

  let query = { user: userId };
  if (status) {
    query.status = status;
  }

  const skip = (page - 1) * limit;

  return this.find(query)
    .populate("items.product", "name images price")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to get orders in date range
orderSchema.statics.getOrdersInDateRange = function (startDate, endDate) {
  return this.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  }).populate("user", "name email");
};

// Static method to get revenue statistics
orderSchema.statics.getRevenueStats = function (startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: { $in: ["processing", "shipped", "delivered"] },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
        totalOrders: { $sum: 1 },
        averageOrderValue: { $avg: "$totalAmount" },
      },
    },
  ]);
};

// Static method to get top selling products
orderSchema.statics.getTopSellingProducts = function (
  limit = 10,
  startDate = null
) {
  const matchStage = {
    status: { $in: ["processing", "shipped", "delivered"] },
  };

  if (startDate) {
    matchStage.createdAt = { $gte: startDate };
  }

  return this.aggregate([
    { $match: matchStage },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        totalSold: { $sum: "$items.quantity" },
        revenue: { $sum: "$items.totalPrice" },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
  ]);
};

// Pre-remove middleware to update product sales
orderSchema.pre("remove", async function (next) {
  try {
    // Update product total sales when order is removed
    for (const item of this.items) {
      await this.model("Product").findByIdAndUpdate(item.product, {
        $inc: { totalSales: -item.quantity },
      });
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Post-save middleware to update product sales
orderSchema.post("save", async function (doc, next) {
  try {
    // Update product total sales when order status changes to delivered
    if (doc.isModified("status") && doc.status === "delivered") {
      for (const item of doc.items) {
        await doc
          .model("Product")
          .findByIdAndUpdate(item.product, {
            $inc: { totalSales: item.quantity },
          });
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Order", orderSchema);
