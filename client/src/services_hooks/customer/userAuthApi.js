import toast from "react-hot-toast";
import {
  UserLoginStart,
  UserLoginSuccess,
  UserLoginFailure,
  UserRegisterStart,
  UserRegisterSuccess,
  UserRegisterFailure,
  UserLogoutStart,
  UserLogoutSuccess,
} from "../../store/customer/userAuthSlice";
import api from "../api";

// Toast Options
const ErrorToastOptions = { duration: 4000, style: { background: "#f87171", color: "#fff" } };
const SuccessToastOptions = { duration: 3000, style: { background: "#4ade80", color: "#000" } };

const parseError = (error) => {
  if (error.response) {
    return error.response.data.message || "Invalid credentials.";
  } else if (error.request) {
    return "Network error. Please check your connection.";
  } else {
    return "Something went wrong.";
  }
};

// Helper: retry with exponential backoff on 429
async function postWithRetry(endpoint, payload, maxRetries = 3, delay = 1000) {
  let attempt = 0;
  while (true) {
    try {
      return await api.post(endpoint, payload);
    } catch (err) {
      if (err.response?.status === 429 && attempt < maxRetries) {
        const backoff = delay * 2 ** attempt;
        await new Promise((res) => setTimeout(res, backoff));
        attempt++;
        continue;
      }
      throw err;
    }
  }
}

// Register User
export const registerUser = async (dispatch, userData) => {
  dispatch(UserRegisterStart());
  try {
    // Ensure userData includes confirmPassword and phone
    const { data } = await postWithRetry("/user/register", userData);
    dispatch(UserRegisterSuccess(data));
    toast.success("Account created successfully!", { id: "user-register", ...SuccessToastOptions });
    return data;
  } catch (error) {
    const errorMsg = parseError(error);
    dispatch(UserRegisterFailure(errorMsg));
    toast.error(errorMsg, { id: "user-register", ...ErrorToastOptions });
    throw error;
  }
};

// Login User
export const loginUser = async (dispatch, credentials) => {
  dispatch(UserLoginStart());
  try {
    const { data } = await api.post("/user/login", credentials);
    dispatch(UserLoginSuccess(data));
    toast.success(`Welcome back, ${data.user?.name || "User"}!`, { id: "user-login", ...SuccessToastOptions });
    return data;
  } catch (error) {
    const errorMsg = parseError(error);
    dispatch(UserLoginFailure(errorMsg));
    toast.error(errorMsg, { id: "user-login", ...ErrorToastOptions });
    throw error;
  }
};

// Logout User
export const logoutUser = async (dispatch) => {
  dispatch(UserLogoutStart());
  try {
    toast.loading("Signing out...", { id: "user-logout" });
    await api.post("/user/logout");
    dispatch(UserLogoutSuccess());
    toast.success("Logged out successfully", { id: "user-logout", ...SuccessToastOptions });
    return true;
  } catch (error) {
    dispatch(UserLogoutSuccess());
    toast.success("Logged out successfully", { id: "user-logout", ...SuccessToastOptions });
    return true;
  }
};

// Optional APIs
export const getUserProfile = async () => {
  const { data } = await api.get("/user/profile");
  return data;
};

export const validateUserToken = async () => {
  const { data } = await api.get("/user/validate-token");
  return data;
};
