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

// ✅ Fetch product by ID (for ProductCard.jsx)
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
