import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaTrash, FaShoppingCart } from "react-icons/fa";
import "../../../assets/css/customer/Wishlist.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../layout/Layout";
import { getWishlist, removeFromWishlist } from "../../../services_hooks/customer/productService";
import { addToCartAction } from "../../../store/customer/cartAction";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userToken } = useSelector((state) => state.userAuth);
  
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      if (!userToken) {
        console.log("💖 Wishlist: No userToken, redirecting to login");
        navigate("/login");
        return;
      }
      
      console.log("💖 Wishlist: Loading wishlist with token:", userToken ? "Present" : "Missing");
      setLoading(true);
      try {
        const wishlistData = await getWishlist(userToken);
        console.log("💖 Wishlist: Fetched wishlist items:", wishlistData);
        setWishlistItems(wishlistData || []);
      } catch (err) {
        console.error("❌ Wishlist load error:", err);
        toast.error("Failed to load wishlist");
        setWishlistItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [userToken, navigate]);

  const handleNavigateToProduct = (productId) => {
    const id = productId?._id || productId;
    navigate(`/product/${id}`);
  };

  const handleRemoveFromWishlist = async (productId) => {
    const id = productId?._id || productId;
    console.log("💖 Removing from wishlist:", { productId: id });
    
    try {
      await removeFromWishlist(id, userToken);
      const updatedItems = wishlistItems.filter(item => {
        const itemProductId = item.productId?._id || item.productId || item._id;
        return itemProductId !== id;
      });
      setWishlistItems(updatedItems);
      toast.success("Item removed from wishlist");
    } catch (err) {
      console.error("❌ Remove from wishlist error:", err);
      toast.error("Failed to remove from wishlist");
    }
  };

  const handleClearWishlist = async () => {
    if (!window.confirm("Are you sure you want to clear your wishlist?")) return;
    
    try {
      // Remove all items one by one since there's no clear all API
      const removePromises = wishlistItems.map(item => {
        const id = item.productId?._id || item.productId || item._id;
        return removeFromWishlist(id, userToken);
      });

      await Promise.all(removePromises);
      setWishlistItems([]);
      toast.success("Wishlist cleared successfully");
    } catch (err) {
      console.error("❌ Clear wishlist error:", err);
      toast.error("Failed to clear wishlist");
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await dispatch(addToCartAction(product));
      toast.success("Item added to cart");
    } catch (err) {
      console.error("❌ Add to cart error:", err);
      toast.error("Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="wishlist-loader-container">
          <div className="skeleton-wishlist">
            {/* Product Image */}
            <div className="skeleton-img shimmer"></div>
            
            {/* Product Info */}
            <div className="skeleton-details">
              <div className="skeleton-line shimmer"></div>
              <div className="skeleton-line shimmer"></div>
              <div className="skeleton-line short shimmer"></div>
            </div>
          </div>

          <div className="skeleton-wishlist">
            <div className="skeleton-img shimmer"></div>
            <div className="skeleton-details">
              <div className="skeleton-line shimmer"></div>
              <div className="skeleton-line shimmer"></div>
              <div className="skeleton-line short shimmer"></div>
            </div>
          </div>

          <p className="loading-text">Fetching your wishlist items...</p>
        </div>
      </Layout>
    );
  }

  if (!userToken) {
    return (
      <Layout>
        <div className="wishlist-container">
          <div className="wishlist-empty">
            <FaHeart size={64} color="#ccc" />
            <h2>Please Login</h2>
            <p>You need to be logged in to view your wishlist.</p>
            <Link to="/login" className="login-btn">
              Login
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (!Array.isArray(wishlistItems) || wishlistItems.length === 0) {
    return (
      <Layout>
        <div className="wishlist-container">
          <div className="wishlist-empty">
            <FaHeart size={64} color="#ccc" />
            <h2>Your Wishlist is Empty</h2>
            <p>Start adding products to your wishlist to see them here.</p>
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
      <div className="wishlist-container">
        <div className="wishlist-wrapper">
          {/* Main Wishlist Section */}
          <div className="wishlist-bag">
            <div className="bag-header">
              <h2>
                <FaHeart /> My Wishlist ({wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''})
              </h2>
              {wishlistItems.length > 0 && (
                <button className="clear-wishlist-btn" onClick={handleClearWishlist}>
                  Clear Wishlist
                </button>
              )}
            </div>

            <div className="wishlist-items">
              {wishlistItems.map((item, index) => {
                const product = item.productId || item;
                const productId = product?._id || product?.id;
                
                return (
                  <div key={index} className="wishlist-item">
                    <div className="item-image">
                      <img
                        src={product?.primaryImage || product?.images?.[0] || "/images/default-product.jpg"}
                        alt={product?.name || "Product"}
                        onClick={() => handleNavigateToProduct(productId)}
                        style={{ cursor: "pointer" }}
                      />
                    </div>

                    <div className="item-details">
                      <h3 
                        onClick={() => handleNavigateToProduct(productId)}
                        style={{ cursor: "pointer" }}
                      >
                        {product?.name || "Product Name"}
                      </h3>
                      <div className="item-meta">
                        <span>SKU: {product?.sku || "N/A"}</span>
                        <span>Brand: {product?.brand || "N/A"}</span>
                        {product?.category && (
                          <span>Category: {typeof product.category === 'object' ? product.category.name : product.category}</span>
                        )}
                      </div>
                      <p className="item-description">
                        {product?.description || "No description available"}
                      </p>
                    </div>

                    <div className="item-actions">
                      <div className="item-price">
                        ₹{Number(product?.price || 0).toFixed(2)}
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveFromWishlist(productId)}
                        title="Remove from wishlist"
                      >
                        <FaTrash /> Remove
                      </button>
                      <button
                        className="add-to-cart-btn"
                        onClick={() => handleAddToCart(product)}
                        title="Add to cart"
                      >
                        <FaShoppingCart /> Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Wishlist Summary Section */}
          <div className="wishlist-sidebar">
            <div className="wishlist-summary-section">
              <h3>Wishlist Summary</h3>
              <div className="summary-row">
                <span>Total Items:</span>
                <span>{wishlistItems.length}</span>
              </div>
              <div className="summary-actions">
                <Link to="/customer/" className="continue-shopping-btn">
                  Continue Shopping
                </Link>
              </div>
            </div>

            <div className="call-us-section">
              <h4>Need Help?</h4>
              <p>Call us at <strong>+91-XXXXXXXXXX</strong></p>
              <p>Email: support@bollentelectric.com</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Wishlist;
