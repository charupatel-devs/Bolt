import api from "../api";

// Helper function to parse errors
const parseProductError = (error) => {
  if (error.response) {
    return error.response.data.message || "Failed to fetch data.";
  } else if (error.request) {
    return "Network error. Please check your connection.";
  } else {
    return "An unexpected error occurred.";
  }
};

// Fetch categories
export const getCategories = async () => {
  try {
    const res = await api.get("/categories");
    return Array.isArray(res.data) ? res.data : res.data.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error(parseProductError(error));
  }
};

// Fetch products based on filters or category
export const getProducts = async (filters) => {
  try {
    const { category, page = 1, limit = 12, sort } = filters;
    const params = new URLSearchParams({ page, limit, sort });

    if (filters.minPrice) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);

    const url = category
      ? `/products/category/${category}?${params.toString()}`
      : `/products?${params.toString()}`;

    const res = await api.get(url);
    return Array.isArray(res.data) ? res.data : res.data.products || res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error(parseProductError(error));
  }
};

// Fetch product by ID (for ProductCard.jsx)
export const getProductById = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}`);
    return response.data?.product || response.data;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw new Error(parseProductError(error));
  }
};

// Fetch featured products
export const getFeaturedProducts = async (limit = 8) => {
  try {
    const res = await api.get(`/products/featured?limit=${limit}`);
    return Array.isArray(res.data) ? res.data : res.data.products || res.data;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    throw new Error(parseProductError(error));
  }
};

// Wishlist APIs
export const getWishlist = async (userToken) => {
  try {
    const response = await api.get("/user/wishlist", {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    
    return response.data.wishlist || [];
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    throw new Error(parseProductError(error));
  }
};

export const addToWishlist = async (productId, userToken) => {
  try {
    console.log("🔗 API Call: Adding to wishlist", { productId, hasToken: !!userToken });
    
    const response = await api.post(`/user/wishlist/add/${productId}`, {}, {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    
    console.log("✅ Add to wishlist success:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error adding to wishlist:", error);
    throw new Error(parseProductError(error));
  }
};

export const removeFromWishlist = async (productId, userToken) => {
  try {
    console.log("🔗 API Call: Removing from wishlist", { productId, hasToken: !!userToken });
    
    const response = await api.delete(`/user/wishlist/remove/${productId}`, {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    
    console.log("✅ Remove from wishlist success:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error removing from wishlist:", error);
    throw new Error(parseProductError(error));
  }
};

// Product Specifications API
export const getProductSpecifications = async (productId) => {
  try {
    const res = await api.get(`/products/${productId}/specifications`);
    return res.data?.specifications || res.data || {};
  } catch (error) {
    console.error("Error fetching product specifications:", error);
    throw new Error(parseProductError(error));
  }
};

// Product Reviews APIs
export const getProductReviews = async (productId) => {
  try {
    const res = await api.get(`/products/${productId}/reviews`);
    return res.data?.reviews || res.data || [];
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    throw new Error(parseProductError(error));
  }
};

export const addProductReview = async (productId, reviewData, userToken) => {
  try {
    const res = await api.post(`/products/${productId}/reviews`, reviewData, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    return res.data;
  } catch (error) {
    console.error("Error adding product review:", error);
    throw new Error(parseProductError(error));
  }
};
