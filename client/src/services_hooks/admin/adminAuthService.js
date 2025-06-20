import toast from "react-hot-toast";
import {
  AdminLoginFailure,
  AdminLoginStart,
  AdminLoginSuccess,
  AdminLogoutStart,
  AdminLogoutSuccess,
  GetAdminProfileFailure,
  GetAdminProfileStart,
  GetAdminProfileSuccess,
} from "../../store/admin/adminAuthSlice";
import axios from "../api";

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

// Parse error function (like yours)
const parseError = (error) => {
  if (error.response) {
    return error.response.data.message || "Invalid credentials";
  } else if (error.request) {
    return "Network error. Please check your connection.";
  } else {
    return "Something went wrong. Please try again.";
  }
};

// Admin Login API Call
export const adminLogin = async (dispatch, credentials) => {
  dispatch(AdminLoginStart());

  try {
    const { data } = await axios.post("/admin/login", {
      email: credentials.email,
      password: credentials.password,
    });

    localStorage.setItem("adminToken", data.token);

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
    // throw error;
  }
};

// Get Admin Profile API Call
export const GetAdminProfile = async (dispatch) => {
  dispatch(GetAdminProfileStart());
  const token = localStorage.getItem("adminToken");

  try {
    const { data } = await axios.get("/admin/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch(GetAdminProfileSuccess(data));
    return data;
  } catch (error) {
    const errorMessage = parseError(error);
    dispatch(GetAdminProfileFailure(errorMessage));
    // Remove invalid token
    localStorage.removeItem("adminToken");
    throw error;
  }
};

// Admin Logout API Call
export const AdminLogout = async (dispatch) => {
  dispatch(AdminLogoutStart());
  const token = localStorage.getItem("adminToken");

  try {
    toast.loading("Signing out...", { id: "admin-logout" });

    await axios.post(
      "/admin/logout",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Remove token from localStorage
    localStorage.removeItem("adminToken");

    dispatch(AdminLogoutSuccess());

    toast.success("Logged out successfully", {
      id: "admin-logout",
      ...SuccessToastOptions,
    });

    return true;
  } catch (error) {
    // Even on error, logout locally
    localStorage.removeItem("adminToken");
    dispatch(AdminLogoutSuccess());

    toast.success("Logged out successfully", {
      id: "admin-logout",
      ...SuccessToastOptions,
    });

    return true;
  }
};

// Validate Admin Token API Call
export const ValidateAdminToken = async (dispatch) => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    throw new Error("No token found");
  }

  try {
    const { data } = await axios.get("/admin/validate-token", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return data;
  } catch (error) {
    localStorage.removeItem("adminToken");
    throw new Error("Invalid token");
  }
};
