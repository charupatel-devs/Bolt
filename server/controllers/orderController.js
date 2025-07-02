const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/sendEmail");
const Cart = require("../models/Cart");

const getUserCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({
      user: userId,
      items: [],
      subtotal: 0,
      shippingCost: 0,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: 0,
    });
    await cart.save();
  }

  return cart;
};

// Helper function to validate product availability
const validateCartItems = async (cartItems) => {
  const validationErrors = [];
  const validatedItems = [];

  for (const item of cartItems) {
    const product = await Product.findById(item.productId);

    if (!product) {
      validationErrors.push(`Product not found: ${item.productId}`);
      continue;
    }

    if (!product.isActive) {
      validationErrors.push(`Product is no longer available: ${product.name}`);
      continue;
    }

    if (product.stock < item.quantity) {
      validationErrors.push(
        `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
      );
      continue;
    }

    if (item.quantity < product.minOrderQuantity) {
      validationErrors.push(
        `Minimum order quantity for ${product.name} is ${product.minOrderQuantity}`
      );
      continue;
    }

    if (item.quantity > product.maxOrderQuantity) {
      validationErrors.push(
        `Maximum order quantity for ${product.name} is ${product.maxOrderQuantity}`
      );
      continue;
    }

    // Get current price (may have changed)
    const currentPrice = product.getPriceForQuantity(item.quantity);

    validatedItems.push({
      product: product,
      quantity: item.quantity,
      currentPrice: currentPrice,
      originalPrice: item.price || currentPrice,
      priceChanged: item.price && item.price !== currentPrice,
    });
  }

  return { validationErrors, validatedItems };
};

// @desc    Get cart items
// @route   GET /api/orders/cart
// @access  Private
exports.getCartItems = catchAsync(async (req, res, next) => {
  const cart = getUserCart(req.user._id.toString());

  // Validate cart items and update prices
  if (cart.items.length > 0) {
    const productIds = cart.items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } }).select(
      "name price images stock isActive specifications"
    );

    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    // Update cart items with current product info
    cart.items = cart.items
      .map((item) => {
        const product = productMap.get(item.productId);
        if (product) {
          const currentPrice = product.getPriceForQuantity(item.quantity);
          return {
            ...item,
            name: product.name,
            image: product.primaryImage,
            currentPrice,
            priceChanged: item.price !== currentPrice,
            inStock: product.stock >= item.quantity,
            availableStock: product.stock,
            isActive: product.isActive,
          };
        }
        return { ...item, productNotFound: true };
      })
      .filter((item) => !item.productNotFound && item.isActive);

    calculateCartTotals(cart);
  }

  res.status(200).json({
    success: true,
    cart,
  });
});

// @desc    Add item to cart
// @route   POST /api/orders/cart/add
// @access  Private
exports.addToCart = catchAsync(async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;

  // Validation checks
  if (!productId) return next(new AppError("Product ID is required", 400));
  if (quantity < 1)
    return next(new AppError("Quantity must be at least 1", 400));

  const product = await Product.findById(productId);
  if (!product) return next(new AppError("Product not found", 404));
  if (!product.isActive)
    return next(new AppError("Product is not available", 400));

  // Stock and quantity validation
  if (product.stock < quantity) {
    return next(
      new AppError(`Only ${product.stock} items available in stock`, 400)
    );
  }
  if (quantity < product.minOrderQuantity) {
    return next(
      new AppError(`Minimum order quantity is ${product.minOrderQuantity}`, 400)
    );
  }
  if (quantity > product.maxOrderQuantity) {
    return next(
      new AppError(`Maximum order quantity is ${product.maxOrderQuantity}`, 400)
    );
  }

  const userId = req.user._id.toString();
  const cart = await getUserCart(userId);

  // Find existing item index
  const existingItemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (existingItemIndex > -1) {
    const existingItem = cart.items[existingItemIndex];
    const newQuantity = existingItem.quantity + quantity;

    // Additional validations for existing items
    if (newQuantity > product.stock) {
      return next(
        new AppError(
          `Cannot add ${quantity} more items. Total would exceed available stock of ${product.stock}`,
          400
        )
      );
    }
    if (newQuantity > product.maxOrderQuantity) {
      return next(
        new AppError(
          `Cannot add ${quantity} more items. Total would exceed maximum order quantity of ${product.maxOrderQuantity}`,
          400
        )
      );
    }

    // Update existing item
    cart.items[existingItemIndex].quantity = newQuantity;
    cart.items[existingItemIndex].price =
      product.getPriceForQuantity(newQuantity);
  } else {
    // Add new item
    cart.items.push({
      productId,
      name: product.name,
      image: product.primaryImage || "https://via.placeholder.com/300",
      sku: product.sku,
      quantity,
      price: product.getPriceForQuantity(quantity),
      addedAt: new Date(),
    });
  }

  // Save to database (totals calculated automatically via pre-save hook)
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Item added to cart successfully",
    cart: {
      itemCount: cart.items.length,
      totalItems: cart.items.reduce((total, item) => total + item.quantity, 0),
      totalAmount: cart.totalAmount,
    },
  });
});

// @desc    Update cart item quantity
// @route   PUT /api/orders/cart/update/:itemId
// @access  Private
exports.updateCartItem = catchAsync(async (req, res, next) => {
  const { quantity } = req.body;
  const { itemId } = req.params;

  if (!quantity || quantity < 0) {
    return next(new AppError("Valid quantity is required", 400));
  }

  const userId = req.user._id.toString();
  const cart = await getUserCart(userId);

  // Find item by productId (itemId in params is productId)
  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === itemId
  );

  if (itemIndex === -1) {
    return next(new AppError("Item not found in cart", 404));
  }

  const product = await Product.findById(itemId);
  if (!product) return next(new AppError("Product not found", 404));

  if (quantity === 0) {
    // Remove item if quantity is 0
    cart.items.splice(itemIndex, 1);
  } else {
    // Validate new quantity
    if (quantity > product.stock) {
      return next(
        new AppError(`Only ${product.stock} items available in stock`, 400)
      );
    }
    if (quantity < product.minOrderQuantity) {
      return next(
        new AppError(
          `Minimum order quantity is ${product.minOrderQuantity}`,
          400
        )
      );
    }
    if (quantity > product.maxOrderQuantity) {
      return next(
        new AppError(
          `Maximum order quantity is ${product.maxOrderQuantity}`,
          400
        )
      );
    }

    // Update item
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].price = product.getPriceForQuantity(quantity);
  }

  await cart.save();

  res.status(200).json({
    success: true,
    message:
      quantity === 0 ? "Item removed from cart" : "Cart updated successfully",
    cart,
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/orders/cart/remove/:itemId
// @access  Private
exports.removeFromCart = catchAsync(async (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id.toString();
  const cart = await getUserCart(userId);

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === itemId
  );

  if (itemIndex === -1) {
    return next(new AppError("Item not found in cart", 404));
  }

  const removedItem = cart.items.splice(itemIndex, 1)[0];
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Item removed from cart successfully",
    removedItem: removedItem.name,
    cart,
  });
});

// @desc    Clear entire cart
// @route   DELETE /api/orders/cart/clear
// @access  Private
exports.clearCart = catchAsync(async (req, res, next) => {
  const userId = req.user._id.toString();
  const cart = await getUserCart(userId);

  const itemCount = cart.items.length;
  cart.items = [];
  cart.discountAmount = 0;
  cart.couponCode = null;
  cart.freeShipping = false;

  await cart.save();

  res.status(200).json({
    success: true,
    message: `${itemCount} items removed from cart`,
    cart,
  });
});

// @desc    Get cart items
// @route   GET /api/orders/cart
// @access  Private
exports.getCartItems = catchAsync(async (req, res, next) => {
  const userId = req.user._id.toString();
  const cart = await Cart.findOne({ user: userId }).populate(
    "items.productId",
    "name price images stock isActive specifications"
  );

  if (!cart) {
    return res.status(200).json({
      success: true,
      cart: {
        items: [],
        subtotal: 0,
        shippingCost: 0,
        taxAmount: 0,
        discountAmount: 0,
        totalAmount: 0,
      },
    });
  }

  // Validate and update prices
  let hasChanges = false;
  for (const item of cart.items) {
    const product = item.productId;

    // Remove unavailable products
    if (!product || !product.isActive) {
      cart.items = cart.items.filter(
        (i) => i.productId.toString() !== item.productId.toString()
      );
      hasChanges = true;
      continue;
    }

    // Update prices if changed
    const currentPrice = product.getPriceForQuantity(item.quantity);
    if (item.price !== currentPrice) {
      item.price = currentPrice;
      hasChanges = true;
    }
  }

  if (hasChanges) await cart.save();

  res.status(200).json({
    success: true,
    cart,
  });
});

// @desc    Calculate shipping cost
// @route   POST /api/orders/calculate-shipping
// @access  Private
exports.calculateShipping = catchAsync(async (req, res, next) => {
  const { address, items } = req.body;

  if (!address || !address.postalCode) {
    return next(
      new AppError("Shipping address with postal code is required", 400)
    );
  }

  let cartItems = [];
  if (items) {
    cartItems = items;
  } else {
    const userId = req.user._id.toString();
    const cart = await getUserCart(userId);
    if (cart.items.length === 0) {
      return next(new AppError("Cart is empty", 400));
    }
    cartItems = cart.items;
  }

  // Calculate total weight and value
  let totalWeight = 0;
  let totalValue = 0;

  for (const item of cartItems) {
    const product = await Product.findById(item.productId);
    if (product) {
      totalWeight += (product.weight || 0.1) * item.quantity;
      totalValue += item.price * item.quantity;
    }
  }

  // Shipping calculation logic (simplified)
  let shippingCost = 0;

  // Free shipping for orders above ₹1000
  if (totalValue >= 1000) {
    shippingCost = 0;
  } else if (totalWeight <= 0.5) {
    // Up to 500g
    shippingCost = 50;
  } else if (totalWeight <= 2) {
    // Up to 2kg
    shippingCost = 100;
  } else {
    // Above 2kg
    shippingCost = 150 + Math.ceil((totalWeight - 2) / 0.5) * 25;
  }

  // Express shipping option
  const expressShipping = shippingCost === 0 ? 100 : shippingCost + 100;

  // Estimated delivery dates
  const standardDelivery = new Date();
  standardDelivery.setDate(standardDelivery.getDate() + 5);

  const expressDelivery = new Date();
  expressDelivery.setDate(expressDelivery.getDate() + 2);

  const shippingOptions = [
    {
      type: "standard",
      name: "Standard Shipping",
      cost: shippingCost,
      estimatedDays: "3-5 business days",
      estimatedDelivery: standardDelivery.toISOString().split("T")[0],
    },
    {
      type: "express",
      name: "Express Shipping",
      cost: expressShipping,
      estimatedDays: "1-2 business days",
      estimatedDelivery: expressDelivery.toISOString().split("T")[0],
    },
  ];

  res.status(200).json({
    success: true,
    totalWeight,
    totalValue,
    shippingOptions,
  });
});
// @desc    Create new order
// @route   POST /api/orders/create
// @access  Private
exports.createOrder = catchAsync(async (req, res, next) => {
  const {
    shippingAddress,
    billingAddress,
    paymentMethod,
    shippingOption,
    orderNotes,
    useCartItems = true,
  } = req.body;

  if (!shippingAddress) {
    return next(new AppError("Shipping address is required", 400));
  }

  if (!paymentMethod) {
    return next(new AppError("Payment method is required", 400));
  }

  let orderItems = [];
  let cart = null;
  const userId = req.user._id.toString();

  if (useCartItems) {
    cart = await getUserCart(userId);
    if (cart.items.length === 0) {
      return next(new AppError("Cart is empty", 400));
    }
    orderItems = cart.items;
  } else {
    orderItems = req.body.items || [];
  }

  if (orderItems.length === 0) {
    return next(new AppError("No items to order", 400));
  }

  // Validate all items
  const { validationErrors, validatedItems } = await validateCartItems(
    orderItems.map((item) => ({
      productId: item.productId || item.product,
      quantity: item.quantity,
      price: item.price,
    }))
  );

  if (validationErrors.length > 0) {
    return next(
      new AppError(`Validation errors: ${validationErrors.join(", ")}`, 400)
    );
  }

  // Calculate order totals
  let subtotal = 0;
  const orderItemsData = [];

  for (const validatedItem of validatedItems) {
    const itemTotal = validatedItem.currentPrice * validatedItem.quantity;
    subtotal += itemTotal;

    orderItemsData.push({
      product: validatedItem.product._id,
      name: validatedItem.product.name,
      image: validatedItem.product.primaryImage,
      sku: validatedItem.product.sku,
      quantity: validatedItem.quantity,
      price: validatedItem.currentPrice,
      totalPrice: itemTotal,
    });
  }

  // Calculate shipping
  const shipping = shippingOption || { cost: 0 };
  const shippingCost = cart?.freeShipping ? 0 : shipping.cost;

  // Calculate tax (18% GST)
  const taxAmount = Math.round(subtotal * 0.18 * 100) / 100;

  // Apply discount
  const discountAmount = cart?.discountAmount || 0;

  const totalAmount = subtotal + shippingCost + taxAmount - discountAmount;

  // Create order
  const order = await Order.create({
    user: userId,
    items: orderItemsData,
    shippingAddress,
    billingAddress: billingAddress || shippingAddress,
    paymentInfo: {
      method: paymentMethod,
      status: paymentMethod === "cod" ? "pending" : "pending",
    },
    subtotal,
    shippingCost,
    taxAmount,
    discountAmount,
    totalAmount,
    orderNotes,
    couponCode: cart?.couponCode,
    status: "pending",
    shippingOption: shippingOption?.type || "standard",
    estimatedDelivery:
      shippingOption?.estimatedDelivery ||
      new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  });
  await order.save();

  // Clear cart if using cart items
  if (useCartItems && cart) {
    cart.items = [];
    cart.discountAmount = 0;
    cart.couponCode = null;
    cart.freeShipping = false;
    await cart.save();
  }

  // Update product stock
  for (const item of orderItemsData) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  // Send order confirmation email
  try {
    await sendOrderConfirmationEmail(order, req.user);
  } catch (error) {
    console.log("Order confirmation email failed:", error.message);
  }

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    order: {
      _id: order._id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      status: order.status,
      estimatedDelivery: order.estimatedDelivery,
    },
  });
});
// @desc    Apply discount/coupon
// @route   POST /api/orders/apply-discount
// @access  Private
exports.applyDiscount = catchAsync(async (req, res, next) => {
  const { couponCode, cartTotal } = req.body;

  if (!couponCode) {
    return next(new AppError("Coupon code is required", 400));
  }

  // Simplified coupon system (in production, use a Coupon model)
  const coupons = {
    WELCOME10: {
      type: "percentage",
      value: 10,
      minOrder: 500,
      maxDiscount: 200,
    },
    SAVE50: { type: "fixed", value: 50, minOrder: 300 },
    ELECTRONICS20: {
      type: "percentage",
      value: 20,
      minOrder: 1000,
      maxDiscount: 500,
    },
    FREESHIP: { type: "shipping", value: 0, minOrder: 0 },
  };

  const coupon = coupons[couponCode.toUpperCase()];

  if (!coupon) {
    return next(new AppError("Invalid coupon code", 400));
  }

  const orderTotal = cartTotal || getUserCart(req.user._id.toString()).subtotal;

  if (orderTotal < coupon.minOrder) {
    return next(
      new AppError(
        `Minimum order value for this coupon is ₹${coupon.minOrder}`,
        400
      )
    );
  }

  let discountAmount = 0;
  let discountType = "";

  switch (coupon.type) {
    case "percentage":
      discountAmount = (orderTotal * coupon.value) / 100;
      if (coupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscount);
      }
      discountType = `${coupon.value}% off`;
      break;
    case "fixed":
      discountAmount = Math.min(coupon.value, orderTotal);
      discountType = `₹${coupon.value} off`;
      break;
    case "shipping":
      discountAmount = 0; // Handled separately
      discountType = "Free shipping";
      break;
  }

  // Update cart with discount
  const cart = getUserCart(req.user._id.toString());
  cart.discountAmount = discountAmount;
  cart.couponCode = couponCode.toUpperCase();
  cart.discountType = discountType;

  if (coupon.type === "shipping") {
    cart.freeShipping = true;
  }

  calculateCartTotals(cart);

  res.status(200).json({
    success: true,
    message: "Coupon applied successfully",
    couponCode: couponCode.toUpperCase(),
    discountType,
    discountAmount,
    freeShipping: coupon.type === "shipping",
    newTotal: cart.totalAmount,
  });
});

// Helper function to send order confirmation email
const sendOrderConfirmationEmail = async (order, user) => {
  const itemsList = order.items
    .map(
      (item) => `• ${item.name} (Qty: ${item.quantity}) - ₹${item.totalPrice}`
    )
    .join("\n");

  const message = `
Dear ${user.name},

Thank you for your order! Here are the details:

Order Number: ${order.orderNumber}
Order Date: ${order.createdAt.toDateString()}

Items Ordered:
${itemsList}

Subtotal: ₹${order.subtotal}
Shipping: ₹${order.shippingCost}
Tax: ₹${order.taxAmount}
${order.discountAmount > 0 ? `Discount: -₹${order.discountAmount}` : ""}
Total Amount: ₹${order.totalAmount}

Shipping Address:
${order.shippingAddress.name}
${order.shippingAddress.addressLine1}
${
  order.shippingAddress.addressLine2
    ? order.shippingAddress.addressLine2 + "\n"
    : ""
}${order.shippingAddress.city}, ${order.shippingAddress.state} ${
    order.shippingAddress.postalCode
  }

We'll send you another email when your order ships.

Best regards,
Electronics Marketplace Team
  `;

  const htmlMessage = `
    <h2>Order Confirmation</h2>
    <p>Dear ${user.name},</p>
    <p>Thank you for your order! Here are the details:</p>
    
    <h3>Order Information</h3>
    <p><strong>Order Number:</strong> ${order.orderNumber}</p>
    <p><strong>Order Date:</strong> ${order.createdAt.toDateString()}</p>
    
    <h3>Items Ordered</h3>
    <ul>
      ${order.items
        .map(
          (item) =>
            `<li>${item.name} (Qty: ${item.quantity}) - ₹${item.totalPrice}</li>`
        )
        .join("")}
    </ul>
    
    <h3>Order Summary</h3>
    <p>Subtotal: ₹${order.subtotal}</p>
    <p>Shipping: ₹${order.shippingCost}</p>
    <p>Tax: ₹${order.taxAmount}</p>
    ${
      order.discountAmount > 0
        ? `<p>Discount: -₹${order.discountAmount}</p>`
        : ""
    }
    <p><strong>Total Amount: ₹${order.totalAmount}</strong></p>
    
    <h3>Shipping Address</h3>
    <p>
      ${order.shippingAddress.name}<br>
      ${order.shippingAddress.addressLine1}<br>
      ${
        order.shippingAddress.addressLine2
          ? order.shippingAddress.addressLine2 + "<br>"
          : ""
      }
      ${order.shippingAddress.city}, ${order.shippingAddress.state} ${
        order.shippingAddress.postalCode
      }
    </p>
    
    <p>We'll send you another email when your order ships.</p>
    <p>Best regards,<br>Electronics Marketplace Team</p>
  `;

  await sendEmail({
    email: user.email,
    subject: `Order Confirmation - ${order.orderNumber}`,
    message,
    html: htmlMessage,
  });
};

// Continuation of orderController.js

// @desc    Get user's orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getUserOrders = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;
  const sortBy = req.query.sortBy || "-createdAt";

  const skip = (page - 1) * limit;

  // Build query
  let query = { user: req.user._id };

  if (status) {
    query.status = status;
  }

  const orders = await Order.find(query)
    .populate("items.product", "name images price")
    .sort(sortBy)
    .skip(skip)
    .limit(limit);

  const totalOrders = await Order.countDocuments(query);

  // Calculate order statistics
  const orderStats = await Order.aggregate([
    { $match: { user: req.user._id } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalAmount: { $sum: "$totalAmount" },
      },
    },
  ]);

  const stats = {
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalSpent: 0,
  };

  orderStats.forEach((stat) => {
    stats[stat._id] = stat.count;
    stats.total += stat.count;
    if (stat._id === "delivered") {
      stats.totalSpent += stat.totalAmount;
    }
  });

  res.status(200).json({
    success: true,
    results: orders.length,
    totalOrders,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      hasNextPage: page < Math.ceil(totalOrders / limit),
      hasPrevPage: page > 1,
    },
    stats,
    orders,
  });
});

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email phone")
    .populate("items.product", "name images price specifications");

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  // Check if user owns this order
  if (order.user._id.toString() !== req.user._id.toString()) {
    return next(new AppError("Access denied", 403));
  }

  // Calculate delivery timeline
  const timeline = [
    {
      status: "pending",
      title: "Order Placed",
      completed: true,
      date: order.createdAt,
    },
    {
      status: "processing",
      title: "Order Processing",
      completed: ["processing", "shipped", "delivered"].includes(order.status),
      date: order.status === "processing" ? new Date() : null,
    },
    {
      status: "shipped",
      title: "Order Shipped",
      completed: ["shipped", "delivered"].includes(order.status),
      date: order.shippedAt,
    },
    {
      status: "delivered",
      title: "Order Delivered",
      completed: order.status === "delivered",
      date: order.deliveredAt,
    },
  ];

  res.status(200).json({
    success: true,
    order,
    timeline,
  });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = catchAsync(async (req, res, next) => {
  const { reason } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  // Check if user owns this order
  if (order.user.toString() !== req.user._id.toString()) {
    return next(new AppError("Access denied", 403));
  }

  // Check if order can be cancelled
  if (!["pending", "processing"].includes(order.status)) {
    return next(new AppError("Order cannot be cancelled at this stage", 400));
  }

  try {
    await order.cancelOrder(reason || "Cancelled by customer");

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    // Send cancellation email
    try {
      await sendEmail({
        email: req.user.email,
        subject: `Order Cancelled - ${order.orderNumber}`,
        message: `Your order ${
          order.orderNumber
        } has been cancelled successfully. ${
          reason ? `Reason: ${reason}` : ""
        }`,
        html: `
          <h2>Order Cancellation Confirmation</h2>
          <p>Your order <strong>${
            order.orderNumber
          }</strong> has been cancelled successfully.</p>
          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
          <p>If you paid for this order, you will receive a refund within 5-7 business days.</p>
          <p>Best regards,<br>Electronics Marketplace Team</p>
        `,
      });
    } catch (error) {
      console.log("Order cancellation email failed:", error.message);
    }

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        cancelledAt: order.cancelledAt,
        cancellationReason: order.cancellationReason,
      },
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
});

// @desc    Get order tracking information
// @route   GET /api/orders/:id/tracking
// @access  Private
exports.getOrderTracking = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "items.product",
    "name images"
  );

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  // Check if user owns this order
  if (order.user.toString() !== req.user._id.toString()) {
    return next(new AppError("Access denied", 403));
  }

  // Create detailed tracking information
  const trackingInfo = {
    orderNumber: order.orderNumber,
    status: order.status,
    trackingNumber: order.trackingNumber,
    shippingProvider: order.shippingProvider,
    estimatedDelivery: order.estimatedDelivery,
    currentLocation: "Processing Center", // This would come from shipping API

    // Tracking timeline
    timeline: [
      {
        date: order.createdAt,
        status: "Order Placed",
        description: "Your order has been received and is being processed",
        completed: true,
      },
    ],
  };

  // Add timeline events based on order status
  if (order.status === "processing") {
    trackingInfo.timeline.push({
      date: new Date(),
      status: "Processing",
      description: "Your order is being prepared for shipment",
      completed: true,
    });
  }

  if (order.shippedAt) {
    trackingInfo.timeline.push({
      date: order.shippedAt,
      status: "Shipped",
      description: `Your order has been shipped${
        order.trackingNumber
          ? ` with tracking number ${order.trackingNumber}`
          : ""
      }`,
      completed: true,
    });
  }

  if (order.deliveredAt) {
    trackingInfo.timeline.push({
      date: order.deliveredAt,
      status: "Delivered",
      description: "Your order has been successfully delivered",
      completed: true,
    });
  }

  if (order.status === "cancelled") {
    trackingInfo.timeline.push({
      date: order.cancelledAt,
      status: "Cancelled",
      description: `Order cancelled. ${order.cancellationReason || ""}`,
      completed: true,
    });
  }

  // Add estimated future events
  if (order.status === "processing") {
    const estimatedShipping = new Date();
    estimatedShipping.setDate(estimatedShipping.getDate() + 1);

    trackingInfo.timeline.push({
      date: estimatedShipping,
      status: "Expected to Ship",
      description: "Your order is expected to ship",
      completed: false,
      estimated: true,
    });
  }

  if (
    ["processing", "shipped"].includes(order.status) &&
    order.estimatedDelivery
  ) {
    trackingInfo.timeline.push({
      date: order.estimatedDelivery,
      status: "Expected Delivery",
      description: "Your order is expected to be delivered",
      completed: false,
      estimated: true,
    });
  }

  res.status(200).json({
    success: true,
    tracking: trackingInfo,
  });
});

// @desc    Process payment for order
// @route   POST /api/orders/:id/payment
// @access  Private
exports.processPayment = catchAsync(async (req, res, next) => {
  const { paymentMethod, paymentData } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  // Check if user owns this order
  if (order.user.toString() !== req.user._id.toString()) {
    return next(new AppError("Access denied", 403));
  }

  // Check if order is in pending status
  if (order.status !== "pending") {
    return next(
      new AppError("Payment can only be processed for pending orders", 400)
    );
  }

  // Check if payment is already completed
  if (order.paymentInfo.status === "completed") {
    return next(new AppError("Payment already completed for this order", 400));
  }

  // Simulate payment processing (integrate with actual payment gateway)
  let paymentResult = {};

  try {
    switch (paymentMethod) {
      case "credit_card":
      case "debit_card":
        paymentResult = await processCardPayment(order, paymentData);
        break;
      case "upi":
        paymentResult = await processUPIPayment(order, paymentData);
        break;
      case "net_banking":
        paymentResult = await processNetBankingPayment(order, paymentData);
        break;
      case "wallet":
        paymentResult = await processWalletPayment(order, paymentData);
        break;
      case "cod":
        paymentResult = {
          success: true,
          transactionId: `COD_${order.orderNumber}`,
          message: "Cash on Delivery order confirmed",
        };
        break;
      default:
        return next(new AppError("Invalid payment method", 400));
    }

    if (paymentResult.success) {
      // Update order payment info
      await order.markAsPaid({
        method: paymentMethod,
        transactionId: paymentResult.transactionId,
        paymentGateway: paymentResult.gateway || "internal",
      });

      // Update product stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }

      res.status(200).json({
        success: true,
        message: "Payment processed successfully",
        transactionId: paymentResult.transactionId,
        order: {
          _id: order._id,
          orderNumber: order.orderNumber,
          status: order.status,
          paymentStatus: order.paymentInfo.status,
        },
      });
    } else {
      // Payment failed
      order.paymentInfo.status = "failed";
      await order.save();

      return next(
        new AppError(paymentResult.message || "Payment processing failed", 400)
      );
    }
  } catch (error) {
    // Payment processing error
    order.paymentInfo.status = "failed";
    await order.save();

    return next(new AppError(`Payment error: ${error.message}`, 500));
  }
});

// Mock payment processing functions (replace with actual payment gateway integration)
const processCardPayment = async (order, paymentData) => {
  // Simulate card payment processing
  // In production, integrate with Stripe, Razorpay, etc.

  const { cardNumber, expiryMonth, expiryYear, cvv, holderName } = paymentData;

  // Basic validation
  if (!cardNumber || !expiryMonth || !expiryYear || !cvv || !holderName) {
    throw new Error("Complete card information required");
  }

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Simulate success/failure (90% success rate)
  const success = Math.random() > 0.1;

  if (success) {
    return {
      success: true,
      transactionId: `TXN_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      gateway: "stripe",
      message: "Card payment successful",
    };
  } else {
    return {
      success: false,
      message: "Card payment declined",
    };
  }
};

const processUPIPayment = async (order, paymentData) => {
  const { upiId } = paymentData;

  if (!upiId) {
    throw new Error("UPI ID required");
  }

  // Simulate UPI payment
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    success: true,
    transactionId: `UPI_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`,
    gateway: "razorpay",
    message: "UPI payment successful",
  };
};

const processNetBankingPayment = async (order, paymentData) => {
  const { bankCode } = paymentData;

  if (!bankCode) {
    throw new Error("Bank selection required");
  }

  // Simulate net banking
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return {
    success: true,
    transactionId: `NB_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`,
    gateway: "payu",
    message: "Net banking payment successful",
  };
};

const processWalletPayment = async (order, paymentData) => {
  const { walletType } = paymentData;

  // Simulate wallet payment
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    success: true,
    transactionId: `WALLET_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`,
    gateway: walletType || "paytm",
    message: "Wallet payment successful",
  };
};

// @desc    Verify payment status
// @route   POST /api/orders/:id/verify-payment
// @access  Private
exports.verifyPayment = catchAsync(async (req, res, next) => {
  const { transactionId, signature } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  // Check if user owns this order
  if (order.user.toString() !== req.user._id.toString()) {
    return next(new AppError("Access denied", 403));
  }

  // Verify payment with payment gateway
  // This is a simplified verification - in production, verify with actual gateway

  if (order.paymentInfo.transactionId === transactionId) {
    res.status(200).json({
      success: true,
      verified: true,
      paymentStatus: order.paymentInfo.status,
      message: "Payment verified successfully",
    });
  } else {
    res.status(200).json({
      success: true,
      verified: false,
      message: "Payment verification failed",
    });
  }
});

// @desc    Download order invoice
// @route   GET /api/orders/:id/invoice
// @access  Private
exports.downloadInvoice = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email phone")
    .populate("items.product", "name sku");

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  // Check if user owns this order
  if (order.user._id.toString() !== req.user._id.toString()) {
    return next(new AppError("Access denied", 403));
  }

  // Check if order is paid
  if (order.paymentInfo.status !== "completed") {
    return next(new AppError("Invoice not available for unpaid orders", 400));
  }

  // Generate invoice data (in production, you might use a PDF generator)
  const invoice = {
    invoiceNumber: order.invoiceNumber,
    invoiceDate: order.invoiceDate,
    orderNumber: order.orderNumber,
    orderDate: order.createdAt,

    // Company details
    company: {
      name: "Electronics Marketplace Pvt Ltd",
      address: "123 Tech Street, Electronic City, Bangalore - 560100",
      phone: "+91-80-12345678",
      email: "orders@electronicsmarketplace.com",
      gstin: "29ABCDE1234F1Z5",
    },

    // Customer details
    customer: {
      name: order.user.name,
      email: order.user.email,
      phone: order.user.phone,
      address: order.shippingAddress,
    },

    // Order items
    items: order.items.map((item) => ({
      name: item.name,
      sku: item.sku,
      quantity: item.quantity,
      unitPrice: item.price,
      totalPrice: item.totalPrice,
    })),

    // Totals
    subtotal: order.subtotal,
    shippingCost: order.shippingCost,
    taxAmount: order.taxAmount,
    discountAmount: order.discountAmount,
    totalAmount: order.totalAmount,

    // Payment details
    paymentMethod: order.paymentInfo.method,
    transactionId: order.paymentInfo.transactionId,
    paymentDate: order.paymentInfo.paymentDate,
  };

  res.status(200).json({
    success: true,
    invoice,
  });
});
exports.getOrdersByStatus = async (req, res) => {
  const { status } = req.params;
  const allowedStatuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "refunded",
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid order status" });
  }

  try {
    const orders = await Order.find({ status }).populate("user", "name email"); // populates the user who created the order

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// controllers/orderController.js

exports.getOrderManagementData = async (req, res) => {
  try {
    // Get all recent orders (limit as needed, e.g., 20 most recent)
    const recentOrders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(20);

    // Define all statuses you want to show on dashboard
    const statuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "refunded",
    ];

    // Compute stats for time filters (today, week, month)
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Helper to get stats in a time range
    const getStats = async (startDate) => {
      const match = { createdAt: { $gte: startDate } };
      const total = await Order.countDocuments(match);
      const revenueAgg = await Order.aggregate([
        { $match: { ...match } },
        { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
      ]);
      const revenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

      // Status counts
      const statusCounts = {};
      for (const s of statuses) {
        statusCounts[s] = await Order.countDocuments({ ...match, status: s });
      }

      return {
        total,
        revenue,
        ...statusCounts,
      };
    };

    // Gather stats for each time filter
    const todayStats = await getStats(startOfToday);
    const weekStats = await getStats(startOfWeek);
    const monthStats = await getStats(startOfMonth);

    res.json({
      recentOrders,
      stats: {
        today: todayStats,
        week: weekStats,
        month: monthStats,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
