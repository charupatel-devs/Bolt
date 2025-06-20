import toast from "react-hot-toast";
import {
  AdminLoginFailure,
  AdminLoginStart,
  AdminLoginSuccess,
  AdminLogoutStart,
  AdminLogoutSuccess,
} from "../../store/admin/adminAuthSlice";
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

// Admin Login API Call (HttpOnly Cookie)
export const adminLogin = async (dispatch, credentials) => {
  dispatch(AdminLoginStart());

  try {
    const { data } = await api.post("/admin/login", {
      email: credentials.email,
      password: credentials.password,
    });

    // No need to store token - backend sets HttpOnly cookie
    // Token is automatically included in future requests

    dispatch(AdminLoginSuccess(data));

    toast.success("Welcome back, Admin!", {
      id: "admin-login",
      ...SuccessToastOptions,
    });

    return data;
  } catch (error) {
    const errorMessage = parseError(error);

    toast.error(errorMessage, {
      id: "admin-login",
      ...ErrorToastOptions,
    });
    dispatch(AdminLoginFailure(errorMessage));
    throw error;
  }
};

// Admin Logout API Call (Clear HttpOnly Cookie)
export const AdminLogout = async (dispatch) => {
  dispatch(AdminLogoutStart());

  try {
    toast.loading("Signing out...", { id: "admin-logout" });

    // Backend will clear the HttpOnly cookie
    await api.post("/admin/logout");

    dispatch(AdminLogoutSuccess());

    toast.success("Logged out successfully", {
      id: "admin-logout",
      ...SuccessToastOptions,
    });

    return true;
  } catch (error) {
    // Even on error, assume logout worked
    dispatch(AdminLogoutSuccess());

    toast.success("Logged out successfully", {
      id: "admin-logout",
      ...SuccessToastOptions,
    });

    return true;
  }
};

// Get Admin Profile API Call
export const GetAdminProfile = async (dispatch) => {
  try {
    const { data } = await api.get("/admin/profile");
    return data;
  } catch (error) {
    throw new Error("Failed to get admin profile");
  }
};

// Validate Admin Token API Call (Check HttpOnly Cookie)
export const ValidateAdminToken = async () => {
  try {
    const { data } = await api.get("/admin/validate-token");
    return data;
  } catch (error) {
    throw new Error("Invalid or expired session");
  }
};
