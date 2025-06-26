// src/services/customer/productService.js
import api from "../api";
import toast from "react-hot-toast";
import {
  ProductActionStart,
  ProductActionSuccess,
  ProductActionFailure,
} from "../../store/customer/customerProductSlice";

const ErrorToastOptions = {
  duration: 4000,
  style: {
    background: "#f87171",
    color: "#fff",
  },
};

// ✅ Get products for customer
export const getCustomerProducts = async (dispatch, params = {}) => {
  try {
    dispatch(ProductActionStart());

    const {
      page = 1,
      limit = 12,
      search = "",
      category = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder,
    });

    if (search) queryParams.append("search", search);
    if (category) queryParams.append("category", category);

    const { data } = await api.get(`/products?${queryParams.toString()}`);

    dispatch(
      ProductActionSuccess({
        type: "GET_CUSTOMER_PRODUCTS",
        payload: data,
      })
    );

    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.statusText ||
      error.message ||
      "Failed to load products";

    dispatch(ProductActionFailure(errorMessage));
    toast.error(errorMessage, ErrorToastOptions);
    throw error;
  }
};
