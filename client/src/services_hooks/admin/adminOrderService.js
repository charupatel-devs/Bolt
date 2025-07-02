// adminOrderService.js
import toast from "react-hot-toast";
import {
  fetchOrdersFailure,
  fetchOrdersStart,
  fetchOrdersSuccess,
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
    return data;
  } catch (error) {
    const errorMessage = parseError(error);

    toast.error(`Failed to fetch ${status} orders: ${errorMessage}`, {
      id: `orders-${status}`,
      ...ErrorToastOptions,
    });
    dispatch(fetchOrdersFailure(error.message));
    throw error;
  }
};

export const fetchOrderStats = async (dispatch) => {
  try {
    const { data } = await api.get("/orders/management");
    return data;
  } catch (error) {
    const errorMessage = parseError(error);
    toast.error(`Failed to fetch order stats: ${errorMessage}`, {
      id: "order-stats",
      ...ErrorToastOptions,
    });
    throw error;
  }
};
