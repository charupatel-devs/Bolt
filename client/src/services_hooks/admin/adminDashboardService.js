import { toast } from "react-hot-toast"; // Or your toast library
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

// Get dashboard stats cards data
export const getDashboardStats = async () => {
  try {
    const response = await api.get("/admin/dashboard");
    // Optionally show a success toast
    // toast.success("Dashboard stats loaded", SuccessToastOptions);
    return response.data;
  } catch (error) {
    const message = parseError(error);
    toast.error(message, ErrorToastOptions);
    throw new Error(message);
  }
};

export const getSalesChartData = async (range = "7days") => {
  try {
    const response = await api.get(`/admin/sales-chart?range=${range}`);
    return response.data.data;
  } catch (error) {
    const message = parseError(error);
    toast.error(message, ErrorToastOptions);
    throw new Error(message);
  }
};
