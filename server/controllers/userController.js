const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

// Generate JWT token and send response
const sendTokenResponse = (user, statusCode, res, message = "Success") => {
  const token = generateToken(user._id);
  user.password = undefined;
  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      addresses: user.addresses,
      wishlist: user.wishlist,
      isActive: user.isActive,
      createdAt: user.createdAt,
    },
  });
};

// @desc    Register new user
// @route   POST /api/user/register
// @access  Public
exports.registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword, phone } = req.body;

  // Validation
  if (!name || !email || !password || !confirmPassword) {
    return next(new AppError("Please provide all required fields", 400));
  }

  if (password !== confirmPassword) {
    return next(new AppError("Passwords do not match", 400));
  }

  if (password.length < 6) {
    return next(new AppError("Password must be at least 6 characters", 400));
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("User already exists with this email", 400));
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: "user",
  });

  // Send welcome email
  try {
    await sendEmail({
      email: user.email,
      subject: "Welcome to Electronics Marketplace!",
      message: `Hi ${user.name},\n\nWelcome to our electronics marketplace! Start exploring thousands of electronic components.\n\nBest regards,\nElectronics Marketplace Team`,
      html: `
        <h2>Welcome to Electronics Marketplace!</h2>
        <p>Hi ${user.name},</p>
        <p>Welcome to our electronics marketplace! Start exploring thousands of electronic components.</p>
        <p>Best regards,<br>Electronics Marketplace Team</p>
      `,
    });
  } catch (error) {
    console.log("Welcome email failed to send:", error.message);
  }

  sendTokenResponse(user, 201, res, "User registered successfully");
});
// @desc    Login user
// @route   POST /api/user/login
// @access  Public
exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  // Check if user exists and include password for comparison
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new AppError("Invalid email or password", 401));
  }

  // Check if account is active
  if (!user.isActive) {
    return next(
      new AppError(
        "Your account has been deactivated. Please contact support.",
        401
      )
    );
  }

  // Check password
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    return next(new AppError("Invalid email or password", 401));
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res, "Login successful");
});

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
exports.getUserProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .populate("wishlist", "name price images stock")
    .select("-password");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
exports.updateUserProfile = catchAsync(async (req, res, next) => {
  const { name, phone, avatar } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Update fields if provided
  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (avatar) user.avatar = avatar;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
    },
  });
});

// @desc    Change password
// @route   PUT /api/user/change-password
// @access  Private
exports.changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  // Validation
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new AppError("Please provide all password fields", 400));
  }

  if (newPassword !== confirmNewPassword) {
    return next(new AppError("New passwords do not match", 400));
  }

  if (newPassword.length < 6) {
    return next(
      new AppError("New password must be at least 6 characters", 400)
    );
  }

  // Get user with password
  const user = await User.findById(req.user._id).select("+password");

  // Check current password
  const isCurrentPasswordCorrect = await user.comparePassword(currentPassword);

  if (!isCurrentPasswordCorrect) {
    return next(new AppError("Current password is incorrect", 400));
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

// @desc    Forgot password
// @route   POST /api/user/forgot-password
// @access  Public
exports.forgotPassword = catchAsync(async (req, res, next) => {
  console.log("📧 Email settings check:");
  console.log("SMTP_HOST:", process.env.SMTP_HOST);
  console.log("SMTP_PORT:", process.env.SMTP_PORT);
  console.log("SMTP_EMAIL:", process.env.SMTP_EMAIL);
  console.log("SMTP_PASSWORD exists:", !!process.env.SMTP_PASSWORD);
  const { email } = req.body;

  if (!email) {
    return next(new AppError("Please provide email address", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("No user found with this email address", 404));
  }

  // Generate reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/user/reset-password/${resetToken}`;

  const message = `
    You are receiving this email because you (or someone else) has requested the reset of a password.
    Please click on the following link or paste it into your browser to complete the process:
    
    ${resetUrl}
    
    If you did not request this, please ignore this email and your password will remain unchanged.
  `;

  const htmlMessage = `
    <h2>Password Reset Request</h2>
    <p>You are receiving this email because you (or someone else) has requested the reset of a password.</p>
    <p>Please click on the following link to complete the process:</p>
    <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
    <p>If the button doesn't work, copy and paste this link into your browser:</p>
    <p>${resetUrl}</p>
    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
    <p>This link will expire in 10 minutes.</p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request - Electronics Marketplace",
      message,
      html: htmlMessage,
    });

    res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError("Email could not be sent", 500));
  }
});

// @desc    Reset password
// @route   PUT /api/user/reset-password/:token
// @access  Public
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    return next(
      new AppError("Please provide password and confirm password", 400)
    );
  }

  if (password !== confirmPassword) {
    return next(new AppError("Passwords do not match", 400));
  }

  if (password.length < 6) {
    return next(new AppError("Password must be at least 6 characters", 400));
  }

  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Invalid or expired reset token", 400));
  }

  // Set new password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res, "Password reset successful");
});

// @desc    Logout user
// @route   POST /api/user/logout
// @access  Public
exports.logoutUser = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// @desc    Get user orders
// @route   GET /api/user/orders
// @access  Private
exports.getUserOrders = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find({ user: req.user._id })
    .populate("items.product", "name price images")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalOrders = await Order.countDocuments({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
      hasNextPage: page < Math.ceil(totalOrders / limit),
      hasPrevPage: page > 1,
    },
  });
});

// @desc    Add product to wishlist
// @route   POST /api/user/wishlist/add/:productId
// @access  Private
exports.addToWishlist = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }
  const user = await User.findById(req.user._id);
  // Check if product already in wishlist
  if (user.wishlist.includes(productId)) {
    return next(new AppError("Product already in wishlist", 400));
  }

  user.wishlist.push(productId);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Product added to wishlist successfully",
  });
});

// @desc    Remove product from wishlist
// @route   DELETE /api/user/wishlist/remove/:productId
// @access  Private
exports.removeFromWishlist = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  const user = await User.findById(req.user._id);

  // Check if product in wishlist
  if (!user.wishlist.includes(productId)) {
    return next(new AppError("Product not in wishlist", 400));
  }

  user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Product removed from wishlist successfully",
  });
});

// @desc    Get user wishlist
// @route   GET /api/user/wishlist
// @access  Private
exports.getWishlist = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate({
    path: "wishlist",
    select: "name price images stock category specifications",
    populate: {
      path: "category",
      select: "name",
    },
  });

  res.status(200).json({
    success: true,
    wishlist: user.wishlist,
  });
});
