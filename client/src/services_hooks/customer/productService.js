// client/src/services_hooks/customer/productService.js

import api from "../api";

// Fetch categories
export const getCategories = () =>
  api.get("/categories").then(res => {
    const data = Array.isArray(res.data)
      ? res.data
      : res.data.data || [];
    return { data };
  });

// Fetch products based on filters or category
export const getProducts = (filters) => {
  const { category, page = 1, limit = 12, sort } = filters;
  const params = new URLSearchParams({ page, limit, sort });
  if (filters.minPrice) params.append("minPrice", filters.minPrice);
  if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
  // add other optional filters...

  const url = category
    ? `/products/category/${category}?${params.toString()}`
    : `/products?${params.toString()}`;

  return api.get(url)
    .then(res => {
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];
      return { data };
    });
};
