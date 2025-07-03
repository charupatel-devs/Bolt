// src/services_hooks/customer/categoryApi.js
import api from "../api";

export const fetchCategories = async () => {
  const { data } = await api.get("/categories"); // GET /api/categories
  return data.categories || data; // adjust according to your backend shape
};
