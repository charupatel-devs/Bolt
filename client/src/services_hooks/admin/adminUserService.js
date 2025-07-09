import toast from "react-hot-toast";
import {
  CustomerActionFailure,
  CustomerActionStart,
  CustomerActionSuccess,
} from "../../store/admin/adminCustomerSlice";
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
export const getAllCustomers = async (dispatch) => {
  try {
    dispatch(CustomerActionStart());
    const { data } = await api.get("/admin/customers");
    dispatch(CustomerActionSuccess({ type: "GET_CUSTOMERS", payload: data }));
  } catch (error) {
    const errorMessage = parseError(error);

    toast.error(errorMessage, {
      id: "get-customers-error",
      ...ErrorToastOptions,
    });
    dispatch(CustomerActionFailure(errorMessage));
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user details"
    );
  }
};

// Update user role
export const updateUserRole = async (userId, role) => {
  try {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update user role"
    );
  }
};

// Delete user
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete user");
  }
};
