import toast from "react-hot-toast";
import {
  fetchOrdersFailure,
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchRecentOrdersSuccess,
} from "../../store/admin/adminOrderSlice";
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
    return error.response.data.message || "An error occurred";
  } else if (error.request) {
    return "Network error. Please check your connection.";
  } else {
    return "Something went wrong. Please try again.";
  }
};

// Get orders by status (Admin only)
export const getOrdersByStatus = async (status, dispatch) => {
  dispatch(fetchOrdersStart());
  try {
    const { data } = await api.get(`/orders/orders/${status}`);
    dispatch(fetchOrdersSuccess(data));
    toast.success(`Fetched ${status} orders!`, {
      id: `orders-${status}`,
      ...SuccessToastOptions,
    });
    return data;
  } catch (error) {
    const errorMessage = parseError(error);
    toast.error(`Failed to fetch ${status} orders: ${errorMessage}`, {
      id: `orders-${status}`,
      ...ErrorToastOptions,
    });
    dispatch(fetchOrdersFailure(errorMessage));
  }
};

export const fetchOrderStats = async (dispatch) => {
  dispatch(fetchOrdersStart());
  try {
    const { data } = await api.get("/orders/management");
    console.log("Order stats fetched:", data);
    dispatch(fetchRecentOrdersSuccess(data));
    toast.success("Order stats loaded!", {
      id: "order-stats",
      ...SuccessToastOptions,
    });
  } catch (error) {
    const errorMessage = parseError(error);
    toast.error(`Failed to fetch order stats: ${errorMessage}`, {
      id: "order-stats",
      ...ErrorToastOptions,
    });
    dispatch(fetchOrdersFailure(errorMessage));
  }
};
