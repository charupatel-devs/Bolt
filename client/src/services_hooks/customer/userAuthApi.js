import toast from "react-hot-toast";
import {
  UserLoginStart,
  UserLoginSuccess,
  UserLoginFailure,
  UserLogoutStart,
  UserLogoutSuccess,
} from "../../store/user/userAuthSlice"; // 👈 Make sure you have this slice
import api from "../api";

// Toast configurations
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

// Parse error helper
const parseError = (error) => {
  if (error.response) {
    return error.response.data.message || "Invalid credentials";
  } else if (error.request) {
    return "Network error. Please check your connection.";
  } else {
    return "Something went wrong. Please try again.";
  }
};

// 🔐 USER LOGIN
export const userLogin = async (dispatch, credentials) => {
  dispatch(UserLoginStart());

  try {
    const { data } = await api.post("/user/login", {
      email: credentials.email,
      password: credentials.password,
    });

    dispatch(UserLoginSuccess(data));

    toast.success("Welcome back!", {
      id: "user-login",
      ...SuccessToastOptions,
    });

    return data;
  } catch (error) {
    const errorMessage = parseError(error);

    toast.error(errorMessage, {
      id: "user-login",
      ...ErrorToastOptions,
    });

    dispatch(UserLoginFailure(errorMessage));
    throw error;
  }
};

// 🚪 USER LOGOUT
export const userLogout = async (dispatch) => {
  dispatch(UserLogoutStart());

  try {
    toast.loading("Logging out...", { id: "user-logout" });

    await api.post("/user/logout"); // HttpOnly cookie gets cleared

    dispatch(UserLogoutSuccess());

    toast.success("Logged out successfully", {
      id: "user-logout",
      ...SuccessToastOptions,
    });

    return true;
  } catch (error) {
    dispatch(UserLogoutSuccess());

    toast.success("Logged out successfully", {
      id: "user-logout",
      ...SuccessToastOptions,
    });

    return true;
  }
};

// 👤 GET USER PROFILE
export const getUserProfile = async () => {
  try {
    const { data } = await api.get("/user/profile");
    return data;
  } catch (error) {
    throw new Error("Failed to fetch user profile");
  }
};

// 🔍 VALIDATE USER TOKEN (SESSION)
export const validateUserToken = async () => {
  try {
    const { data } = await api.get("/user/validate-token");
    return data;
  } catch (error) {
    throw new Error("User session invalid or expired");
  }
};

// 📝 REGISTER NEW USER
export const userRegister = async (credentials) => {
  try {
    const { data } = await api.post("/user/register", {
      name: credentials.name,
      email: credentials.email,
      password: credentials.password,
    });

    toast.success("Registered successfully!", {
      id: "user-register",
      ...SuccessToastOptions,
    });

    return data;
  } catch (error) {
    const errorMessage = parseError(error);

    toast.error(errorMessage, {
      id: "user-register",
      ...ErrorToastOptions,
    });

    throw new Error(errorMessage);
  }
};
