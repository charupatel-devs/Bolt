import api from "../api";

// Fetch categories
export const getCategories = async () => {
  const res = await api.get("/categories");
  return Array.isArray(res.data) ? res.data : res.data.data || [];
};

// Fetch products based on filters or category
export const getProducts = async (filters) => {
  const { category, page = 1, limit = 12, sort } = filters;
  const params = new URLSearchParams({ page, limit, sort });

  if (filters.minPrice) params.append("minPrice", filters.minPrice);
  if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);

  const url = category
    ? `/products/category/${category}?${params.toString()}`
    : `/products?${params.toString()}`;

  const res = await api.get(url);
  return Array.isArray(res.data) ? res.data : res.data.products || res.data;
};

// ✅ Fetch product by ID (for ProductCard.jsx)
export const getProductById = async (productId) => {
  const response = await api.get(`/products/${productId}`);
  return response.data?.product || response.data;
};
