import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import "../../../assets/css/customer/Cart.css";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
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

const Cart = () => {
  const dispatch = useDispatch();
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
      if (!userToken) return;
      
      dispatch(fetchCartStart());
      try {
        const items = await fetchCartItems(userToken);
        dispatch(fetchCartSuccess(items || []));
      } catch (err) {
        dispatch(fetchCartFailure("Failed to load cart"));
      }
    };
    loadCart();
  }, [dispatch, userToken]);

  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity < 0) return;
    
    try {
      if (quantity === 0) {
        // Remove item if quantity is 0
        await updateCartItemQuantity(productId, 0, userToken);
        dispatch(updateCartQuantity({ productId, quantity: 0 }));
        // Filter out the item with 0 quantity
        const updatedItems = cartItems.filter(item => item.productId !== productId);
        dispatch(fetchCartSuccess(updatedItems));
        toast.success("Item removed from cart");
      } else {
        await updateCartItemQuantity(productId, quantity, userToken);
        dispatch(updateCartQuantity({ productId, quantity }));
      }
    } catch (err) {
      dispatch(fetchCartFailure("Failed to update quantity"));
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
            <Link to="/customer/" className="continue-shopping-btn">
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
        <div className="cart-container">
          <div className="loading-cart">
            <div className="loading-spinner"></div>
          </div>
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
            <Link to="/customer/" className="continue-shopping-btn">
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
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <div className="cart-items-count">
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </div>
        </div>

        <div className="cart-content">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.productId}>
                  <td>
                    <div className="product-info">
                      <img
                        src="/images/default-product.jpg"
                        alt={item.productName || 'Product'}
                        className="product-image"
                      />
                      <div className="product-details">
                        <h3>{item.productName || 'Unknown Product'}</h3>
                        <div className="product-sku">SKU: {item.productId}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() => handleUpdateQuantity(item.productId, (item.quantity || 1) - 1)}
                        disabled={(item.quantity || 1) <= 1}
                      >
                        <FaMinus size={12} />
                      </button>
                      <span className="quantity-display">{item.quantity || 1}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => handleUpdateQuantity(item.productId, (item.quantity || 1) + 1)}
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>
                  </td>
                  <td className="price-cell">₹{(item.price || 0).toFixed(2)}</td>
                  <td className="price-cell">₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
                  <td>
                    <button
                      className="remove-btn"
                      onClick={() => handleUpdateQuantity(item.productId, 0)}
                      title="Remove item"
                    >
                      <FaTrash size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal ({totalItems} items):</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (GST 18%):</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <div className="cart-actions">
              <button onClick={handleClearCart} className="clear-btn">
                Clear Cart
              </button>
              <Link to="/customer/checkout" className="checkout-btn">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
