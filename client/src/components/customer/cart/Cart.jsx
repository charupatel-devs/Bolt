import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import "../../../assets/css/customer/Cart.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../layout/Layout";

import {
  fetchCartStart,
  fetchCartSuccess,
  fetchCartFailure,
  updateCartQuantity,
  clearCartState,
} from "../../../store/customer/cartSlice";

import {
  fetchCartItems,
  updateCartItemQuantity,
  clearCartService,
} from "../../../services_hooks/customer/cartService";

import { fetchCartItemsAction } from "../../../store/customer/cartAction";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userToken } = useSelector((state) => state.userAuth);
  const { cartItems = [], loading } = useSelector((state) => state.cart);

  // Calculate totals with safety checks
  const subtotal = Array.isArray(cartItems) 
    ? cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0)
    : 0;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;
  const totalItems = Array.isArray(cartItems)
    ? cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
    : 0;

  useEffect(() => {
    const loadCart = async () => {
      if (!userToken) {
        console.log("🛒 Cart: No userToken, skipping cart load");
        return;
      }
      
      console.log("🛒 Cart: Loading cart with token:", userToken ? "Present" : "Missing");
      dispatch(fetchCartStart());
      try {
        const items = await fetchCartItems(userToken);
        console.log("🛒 Cart: Fetched cart items:", items);
        dispatch(fetchCartSuccess(items || []));
      } catch (err) {
        console.error("🛒 Cart: Failed to load cart:", err.message);
        dispatch(fetchCartFailure("Failed to load cart"));
      }
    };
    loadCart();
  }, [dispatch, userToken]);

  // Debug cart state
  console.log("🛒 Cart: Current state:", { 
    cartItems, 
    loading, 
    userToken: userToken ? "Present" : "Missing",
    itemCount: cartItems?.length || 0 
  });

  const handleNavigateToProduct = (productId) => {
    const id = productId?._id || productId;
    navigate(`/product/${id}`);
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 0) return;
    
    const id = productId?._id || productId;
    console.log("🔄 Updating quantity:", { productId: id, quantity: newQuantity });
    
    try {
      if (newQuantity === 0) {
        await updateCartItemQuantity(id, 0, userToken);
        
        const updatedItems = cartItems.filter(item => {
          const itemProductId = item.productId?._id || item.productId || item._id;
          return itemProductId !== id;
        });
        dispatch(fetchCartSuccess(updatedItems));
        toast.success("Item removed from cart");
      } else {
        await updateCartItemQuantity(id, newQuantity, userToken);
        
        const updatedItems = cartItems.map(item => {
          const itemProductId = item.productId?._id || item.productId || item._id;
          if (itemProductId === id) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
        
        dispatch(fetchCartSuccess(updatedItems));
        toast.success("Quantity updated");
      }
    } catch (err) {
      console.error("❌ Update quantity error:", err);
      dispatch(fetchCartFailure("Failed to update quantity"));
      toast.error("Failed to update quantity");
      dispatch(fetchCartItemsAction());
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) return;
    
    try {
      await clearCartService(userToken);
      dispatch(clearCartState());
      toast.success("Cart cleared successfully");
    } catch (err) {
      dispatch(fetchCartFailure("Failed to clear cart"));
    }
  };

  // Show login prompt for non-authenticated users
  if (!userToken) {
    return (
      <Layout>
        <div className="cart-container">
          <div className="empty-cart">
            <FaShoppingCart className="empty-cart-icon" />
            <h2>Please log in to view your cart</h2>
            <p>You need to be logged in to access your shopping cart.</p>
            <div className="cart-auth-actions">
              <Link to="/login" className="login-btn">
                Log In
              </Link>
              <Link to="/register" className="register-btn">
                Create Account
              </Link>
            </div>
            <Link to="/" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="cart-loader-container">
          <div className="skeleton-cart">
            {/* Product Image */}
            <div className="skeleton-img shimmer"></div>
            
            {/* Product Info */}
            <div className="skeleton-details">
              <div className="skeleton-line shimmer"></div>
              <div className="skeleton-line shimmer"></div>
              <div className="skeleton-line short shimmer"></div>
            </div>
          </div>

          <div className="skeleton-cart">
            <div className="skeleton-img shimmer"></div>
            <div className="skeleton-details">
              <div className="skeleton-line shimmer"></div>
              <div className="skeleton-line shimmer"></div>
              <div className="skeleton-line short shimmer"></div>
            </div>
          </div>

          <p className="loading-text">Fetching your cart items...</p>
        </div>
      </Layout>
    );
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <Layout>
        <div className="cart-container">
          <div className="empty-cart">
            <FaShoppingCart className="empty-cart-icon" />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <Link to="/" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="cart-container">
        <div className="cart-wrapper">
          {/* Left Side - Shopping Bag */}
          <div className="shopping-bag">
            <div className="bag-header">
              <h2>Shopping Bag</h2>
              <p>{totalItems} items in your bag</p>
            </div>

            <div className="cart-items-list">
              {cartItems.map((item, index) => {
                console.log("🔍 Cart item structure:", item);
                
                const product = item.productId || item;
                const productName = product?.name || item.productName || 'Unknown Product';
                const productPrice = product?.price || item.price || 0;
                
                // Try multiple ways to get the product ID
                let productId = null;
                if (item.productId && typeof item.productId === 'object') {
                  productId = item.productId._id;
                } else if (item.productId && typeof item.productId === 'string') {
                  productId = item.productId;
                } else if (item._id) {
                  productId = item._id;
                } else if (product._id) {
                  productId = product._id;
                }
                
                console.log("🆔 Extracted productId:", productId);
                const quantity = item.quantity || 1;
                
                return (
                  <div 
                    key={productId || index} 
                    className="cart-item"
                    onClick={() => {
                      console.log("🔗 Cart item clicked:", { 
                        productId, 
                        product: product?._id, 
                        item: item._id,
                        fullItem: item,
                        navigatingTo: `/product/${productId}`
                      });
                      if (productId) {
                        handleNavigateToProduct(productId);
                      } else {
                        console.error("❌ No valid product ID found for navigation");
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Product Image */}
                    <div className="item-image">
                      <img
                        src={product?.images?.[0] || "/images/default-product.jpg"}
                        alt={productName}
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="item-details">
                      <h3>{productName}</h3>
                      <div className="item-meta">
                        <span><strong>SKU:</strong> {product?.sku || 'N/A'}</span>
                        <span><strong>Brand:</strong> {product?.brand || 'N/A'}</span>
                        <span><strong>Category:</strong> {product?.category?.name || 'N/A'}</span>
                        <span><strong>Unit:</strong> {product?.unit || 'Each'}</span>
                      </div>
                    </div>
                    
                    {/* Price */}
                    <div className="item-price">
                      <span>₹{productPrice.toFixed(2)}</span>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="quantity-controls">
                      <button 
                        className="quantity-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateQuantity(productId, quantity - 1);
                        }}
                      >
                        <FaMinus />
                      </button>
                      <span className="quantity">{quantity}</span>
                      <button 
                        className="quantity-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateQuantity(productId, quantity + 1);
                        }}
                      >
                        <FaPlus />
                      </button>
                    </div>
                    
                    {/* Total Price */}
                    <div className="item-total">
                      <span>₹{(productPrice * quantity).toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side - Cart Summary */}
          <div className="cart-sidebar">
            {/* Cart Total */}
            <div className="cart-total-section">
              <h3>Cart Total</h3>
              <div className="total-breakdown">
                <div className="total-row">
                  <span>Cart Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Tax (18%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="total-row final-total">
                  <span>Order Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              <button className="checkout-button">Proceed to Checkout</button>
            </div>

            {/* Call Us Anytime */}
            <div className="call-us-section">
              <h3>Call Us Anytime</h3>
              <p>Need help? Our customer support team is available 24/7 at +91-9876543210 for any assistance.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
