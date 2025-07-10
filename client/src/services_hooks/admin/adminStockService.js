import toast from "react-hot-toast";
import {
  ProductActionFailure,
  ProductActionStart,
  ProductActionSuccess,
} from "../../store/admin/adminStockSlice";
import api from "../api";

// Toast options
const ErrorToastOptions = {
  duration: 4000,
  style: {
    background: "#f87171",
    color: "#fff",
  },
};

const SuccessToastOptions = {
  duration: 3000,
  style: {
    background: "#4ade80",
    color: "#000",
  },
};

// Parse error function
const parseError = (error) => {
  if (error.response) {
    return error.response.data.message || "Invalid credentials";
  } else if (error.request) {
    return "Network error. Please check your connection.";
  } else {
    return "Something went wrong. Please try again.";
  }
};

export const fetchStocks = async (
  dispatch,
  { page = 1, limit = 20, search = "", status = "", category = "" } = {}
) => {
  try {
    dispatch(ProductActionStart());
    // Build query string
    const queryParams = new URLSearchParams();
    if (search) queryParams.append("search", search);
    if (status) queryParams.append("status", status);
    if (category) queryParams.append("category", category);
    if (page) queryParams.append("page", page);
    if (limit) queryParams.append("limit", limit);

    const { data } = await api.get(`/stocks?${queryParams.toString()}`);

    if (data.success) {
      dispatch(
        ProductActionSuccess({
          type: "GET_STOCKS",
          payload: data,
        })
      );
      toast.success("Stocks loaded successfully!", SuccessToastOptions);
    } else {
      throw new Error("Failed to fetch stocks");
    }
  } catch (error) {
    const errorMessage = parseError(error);
    dispatch(ProductActionFailure(errorMessage));
    toast.error(errorMessage, ErrorToastOptions);
    throw new Error("Error fetching stocks: " + errorMessage);
  }
};
export const getStockById = async (dispatch, productId) => {
  try {
    dispatch(ProductActionStart());
    const { data } = await api.get(`/stocks/${productId}`);
    if (data.success) {
      dispatch(
        ProductActionSuccess({
          type: "GET_STOCK_BY_ID",
          payload: data.product,
        })
      );
      toast.success("Product stock loaded!", SuccessToastOptions);
    } else {
      throw new Error("Failed to fetch product stock");
    }
  } catch (error) {
    const errorMessage = parseError(error);
    dispatch(ProductActionFailure(errorMessage));
    toast.error(errorMessage, ErrorToastOptions);
    throw new Error("Error fetching product stock: " + errorMessage);
  }
};
export const adjustStock = async (
  dispatch,
  productId,
  { type, quantity, reason }
) => {
  try {
    dispatch(ProductActionStart());
    const { data } = await api.patch(`/stocks/adjust/${productId}`, {
      type,
      quantity,
      reason,
    });
    if (data.success) {
      dispatch(
        ProductActionSuccess({
          type: "ADJUST_STOCK",
          payload: data.data,
        })
      );
      toast.success("Stock adjusted successfully!", SuccessToastOptions);
    } else {
      throw new Error("Failed to adjust stock");
    }
  } catch (error) {
    const errorMessage = parseError(error);
    dispatch(ProductActionFailure(errorMessage));
    toast.error(errorMessage, ErrorToastOptions);
    throw new Error("Error adjusting stock: " + errorMessage);
  }
};
export const getRecentAdjustments = async (
  dispatch,
  { page = 1, limit = 20, search = "", type = "" } = {}
) => {
  try {
    dispatch(ProductActionStart());
    const queryParams = new URLSearchParams();
    if (search) queryParams.append("search", search);
    if (type && type !== "all") queryParams.append("type", type);
    if (page) queryParams.append("page", page);
    if (limit) queryParams.append("limit", limit);

    const { data } = await api.get(
      `/stocks/recent-adjustments?${queryParams.toString()}`
    );

    if (data.success) {
      dispatch(
        ProductActionSuccess({
          type: "GET_STOCK_ADJUSTMENTS",
          payload: data,
        })
      );
      toast.success("Recent adjustments loaded!", SuccessToastOptions);
    } else {
      throw new Error("Failed to fetch adjustments");
    }
  } catch (error) {
    const errorMessage = parseError(error);
    dispatch(ProductActionFailure(errorMessage));
    toast.error(errorMessage, ErrorToastOptions);
    throw new Error("Error fetching adjustments: " + errorMessage);
  }
};
