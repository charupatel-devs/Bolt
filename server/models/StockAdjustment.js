const mongoose = require("mongoose");

const stockAdjustmentSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["increase", "decrease", "set"],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  reason: {
    type: String,
    maxlength: 300,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // Set to true if you want to require user always
  },
  date: {
    type: Date,
    default: Date.now,
  },
  oldStock: Number,
  newStock: Number,
});

module.exports = mongoose.model("StockAdjustment", stockAdjustmentSchema);
