import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../layout/Layout";
import "../../../assets/css/customer/ProductCard.css";
import { useDispatch, useSelector } from "react-redux"; 
import { addToCartAction } from "../../../store/customer/cartAction"; 
import { 
  getProductById, 
  getWishlist, 
  addToWishlist, 
  removeFromWishlist,
  getProductSpecifications,
  getProductReviews,
  addProductReview
} from "../../../services_hooks/customer/productService";
import { toast } from "react-toastify";

const ProductCard = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const { userToken } = useSelector((state) => state.userAuth);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  // New states for additional data
  const [specifications, setSpecifications] = useState({});
  const [reviews, setReviews] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // Fetch product details
        const productData = await getProductById(productId);
        
        if (productData && productData._id) {
          setProduct(productData);
          
          // Fetch additional data in parallel
          const [specsData, reviewsData, wishlistData] = await Promise.all([
            getProductSpecifications(productId).catch(err => {
              return {};
            }),
            getProductReviews(productId).catch(err => {
              return [];
            }),
            userToken ? getWishlist(userToken).catch(err => {
              return [];
            }) : Promise.resolve([])
          ]);
          
          setSpecifications(specsData);
          setReviews(reviewsData);
          setWishlist(wishlistData);
          
          // Ensure wishlistData is an array before using .some()
          const wishlistArray = Array.isArray(wishlistData) ? wishlistData : [];
          setIsInWishlist(wishlistArray.some(item => item._id === productId || item.productId === productId));
          
        } else {
          setError("Product not found.");
        }
      } catch (err) {
        console.error("❌ Error fetching product:", err);
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchAllData();
    }
  }, [productId, userToken]);

  const handleAddToCart = () => {
    if (!userToken) {
      return alert("Please login to add items to cart.");
    }
    if (!product || !product._id) {
      return;
    }

    dispatch(addToCartAction(product._id, quantity)); 
  };

  const handleWishlistToggle = async () => {
    console.log("🔄 Wishlist toggle clicked", { 
      userToken: !!userToken, 
      productId, 
      isInWishlist,
      product: product?._id 
    });
    
    // Debug token format
    if (userToken) {
      console.log("🔑 Token preview:", userToken.substring(0, 20) + "...");
    }
    
    if (!userToken) {
      console.error("❌ No user token - user not logged in");
      toast.error("Please login to manage wishlist");
      return;
    }

    if (!productId && !product?._id) {
      console.error("❌ No product ID available");
      toast.error("Product ID not found");
      return;
    }

    const idToUse = productId || product._id;
    console.log("🔍 Using product ID:", idToUse);
    console.log("🔍 Product object:", product);

    try {
      if (isInWishlist) {
        console.log("🗑️ Removing from wishlist...");
        const result = await removeFromWishlist(idToUse, userToken);
        console.log("✅ Remove result:", result);
        setIsInWishlist(false);
        toast.success("Removed from wishlist");
      } else {
        console.log("➕ Adding to wishlist...");
        console.log("📡 Making API call to add to wishlist...");
        const result = await addToWishlist(idToUse, userToken);
        console.log("✅ Add result:", result);
        setIsInWishlist(true);
        toast.success("Added to wishlist");
      }
      
      // Refresh wishlist data after successful operation
      console.log("🔄 Refreshing wishlist data...");
      try {
        const updatedWishlist = await getWishlist(userToken);
        console.log("📦 Raw wishlist response:", updatedWishlist);
        const wishlistArray = Array.isArray(updatedWishlist) ? updatedWishlist : [];
        setWishlist(wishlistArray);
        console.log("🔄 Wishlist refreshed:", wishlistArray.length, "items");
      } catch (refreshError) {
        console.warn("⚠️ Failed to refresh wishlist:", refreshError);
      }
      
    } catch (error) {
      console.error("❌ Wishlist operation failed:", error);
      console.error("❌ Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      toast.error(`Failed to update wishlist: ${error.message}`);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!userToken) {
      toast.error("Please login to submit a review");
      return;
    }

    try {
      await addProductReview(productId, newReview, userToken);
      const updatedReviews = await getProductReviews(productId);
      setReviews(updatedReviews);
      setNewReview({ rating: 5, comment: "" });
      setShowReviewForm(false);
      toast.success("Review submitted successfully");
    } catch (error) {
      toast.error("Failed to submit review");
    }
  };

  // Use specifications from API or fallback to product.specifications
  const productSpecs = Object.keys(specifications).length > 0 ? specifications : (product?.specifications || {});

  // Quantity pricing tiers
  const pricingTiers = product?.pricingTiers || [
    { qty: 1, price: product?.price || 0, extPrice: (product?.price || 0) * 1 }
  ];

  if (loading) return (
    <Layout>
         <div className="loading-container">
                <div className="dot-loader">
    <span></span><span></span><span></span>
  </div>
                <p>Loading featured product details...</p>
              </div>
    </Layout>
  );

  if (error) return (
    <Layout>
      <div className="product-error">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    </Layout>
  );

  if (!product) return (
    <Layout>
      <div className="product-error">
        <h2>Product Not Found</h2>
        <p>The requested product could not be found.</p>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="product-page">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <span>Product Index</span>
          <span>›</span>
          <span>{typeof product.category === 'object' ? (product.category?.name || 'Category') : (product.category || 'Category')}</span>
          <span>›</span>
          <span>{String(product.name || 'Product')}</span>
        </nav>

        {/* Main Product Section */}
        <div className="product-main">
          <div className="product-left-section">
            {/* Product Badge - only show if backend provides status */}
            {product.status && (
              <div className="product-badge">{String(product.status)}</div>
            )}
            
            {/* Product Title */}
            <h1 className="product-title">{String(product.name || 'Product')}</h1>
            
            {/* Product Image */}
            <div className="product-image-section">
              <img
                src={product.images?.[selectedImage] || "/images/default-product.jpg"}
                alt={String(product.name || 'Product')}
                className="main-product-image"
              />
              <p className="image-disclaimer">
                {String(product.imageDisclaimer || "Image shown is a representation only. Exact specifications should be obtained from the product data sheet.")}
              </p>
            </div>
          </div>

          {/* Product Details Table */}
          <div className="product-details-section">
            <div className="product-info-table">
              <div className="info-row">
                <span className="info-label">Part Number</span>
                <span className="info-value">{String(product.sku || 'N/A')}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Manufacturer</span>
                <span className="info-value manufacturer">{String(product.brand || "N/A")}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Manufacturer Product Number</span>
                <span className="info-value">{String(product.manufacturerPartNumber || product.sku || 'N/A')}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Description</span>
                <span className="info-value">{String(product.description || "N/A")}</span>
              </div>
              {product.leadTime && (
                <div className="info-row">
                  <span className="info-label">Manufacturer Standard Lead Time</span>
                  <span className="info-value">{String(product.leadTime)}</span>
                </div>
              )}
              <div className="info-row">
                <span className="info-label">Customer Reference</span>
                <span className="info-value">
                  <input type="text" className="reference-input" placeholder="Enter reference" />
                </span>
              </div>
              {product.datasheet && (
                <div className="info-row">
                  <span className="info-label">Datasheet</span>
                  <span className="info-value">
                    <a href={String(product.datasheet)} className="datasheet-link" target="_blank" rel="noopener noreferrer">
                      📄 Datasheet
                    </a>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Stock and Pricing */}
          <div className="product-right-section">
            <div className="stock-info">
              <h3>In-Stock: {String(product.stock || 0)}</h3>
              {product.additionalStockInfo && (
                <p className="additional-stock">{String(product.additionalStockInfo)}</p>
              )}
            </div>

            {/* Quantity Pricing Table - only show if backend provides pricing data */}
            {pricingTiers.length > 0 && (
              <div className="pricing-section">
                <h4>QUANTITY</h4>
                <div className="pricing-table">
                  <div className="pricing-header">
                    <span>QTY</span>
                    <span>UNIT PRICE</span>
                    <span>EXT PRICE</span>
                  </div>
                  {pricingTiers.map((tier, index) => (
                    <div key={index} className="pricing-row">
                      <span>{String(tier.qty || tier.quantity || 1)}</span>
                      <span>₹{Number(tier.price || 0).toFixed(2)}</span>
                      <span>₹{Number(tier.extPrice || (tier.price || 0) * (tier.qty || tier.quantity || 1)).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                {product.packageInfo && (
                  <div className="package-info">
                    <span>{String(product.packageInfo)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Add to Cart Section */}
            <div className="cart-section">
              <div className="quantity-input">
                <label>QUANTITY</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock || 999}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>
              
              <div className="cart-buttons">
                <button 
                  className="add-to-list-btn" 
                  onClick={handleWishlistToggle}
                >
                  {isInWishlist ? "Remove from List" : "Add to List"}
                </button>
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                  Add to Cart
                </button>
              </div>
              
              <p className="pricing-note">{String(product.pricingNote || "All prices are in INR")}</p>
            </div>
          </div>
        </div>

        {/* Product Attributes Section */}
        {Object.keys(productSpecs).length > 0 && (
          <div className="product-attributes-section">
            <h2>Product Attributes</h2>
            <div className="attributes-table">
              <div className="attributes-header">
                <span>TYPE</span>
                <span>DESCRIPTION</span>
                <span>SELECT ALL</span>
              </div>
              {Object.entries(productSpecs).map(([key, value]) => (
                <div key={key} className="attribute-row">
                  <span className="attribute-type">{key}</span>
                  <span className="attribute-description">
                    {typeof value === 'object' && value !== null 
                      ? String(value.value || value.label || JSON.stringify(value))
                      : String(value || 'N/A')
                    }
                  </span>
                  <span className="attribute-select">
                    <input type="checkbox" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Description Section */}
        {product.description && (
          <div className="product-description-section">
            <h2>Description</h2>
            <div className="description-content">
              <p>{String(product.description)}</p>
              {product.detailedDescription && (
                <div className="detailed-description">
                  <h3>Detailed Description</h3>
                  <p>{String(product.detailedDescription)}</p>
                </div>
              )}
              {product.features && Array.isArray(product.features) && product.features.length > 0 && (
                <div className="features-section">
                  <h3>Features</h3>
                  <ul>
                    {product.features.map((feature, index) => (
                      <li key={index}>{String(feature)}</li>
                    ))}
                  </ul>
                </div>
              )}
              {product.applications && Array.isArray(product.applications) && product.applications.length > 0 && (
                <div className="applications-section">
                  <h3>Applications</h3>
                  <ul>
                    {product.applications.map((application, index) => (
                      <li key={index}>{String(application)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="reviews-section">
            <h2>Reviews</h2>
            <div className="reviews-list">
              {reviews.map((review, index) => (
                <div key={index} className="review-item">
                  <h3>{String(review.title || 'Review')}</h3>
                  <p>{String(review.comment || 'No comment')}</p>
                  <p>Rating: {String(review.rating || 0)}/5</p>
                </div>
              ))}
            </div>
            <button className="add-review-btn" onClick={() => setShowReviewForm(true)}>
              Add Review
            </button>
            {showReviewForm && (
              <form onSubmit={handleSubmitReview}>
                <h3>Submit Review</h3>
                <label>Rating:</label>
                <select value={newReview.rating} onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <label>Comment:</label>
                <textarea value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} />
                <button type="submit">Submit Review</button>
              </form>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductCard;
