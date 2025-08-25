import toast from "react-hot-toast";
import {
  UserLoginStart,
  UserLoginSuccess,
  UserLoginFailure,
  UserRegisterStart,
  UserRegisterSuccess,
  UserRegisterFailure,
  UserLogout,

} from "../../store/customer/userAuthSlice";
import api from "../api";

// Toast Options
const ErrorToastOptions = { 
  duration: 4000, 
  style: { background: "#f87171", color: "#fff" },
  id: "error-toast" // Prevent duplicate toasts
};
const SuccessToastOptions = { 
  duration: 3000, 
  style: { background: "#4ade80", color: "#000" },
  id: "success-toast" // Prevent duplicate toasts
};

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
        console.log(`🔄 Rate limited, retrying in ${backoff}ms (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise((res) => setTimeout(res, backoff));
        attempt++;
        continue;
      }
      throw err;
    }
  }
}

// Helper: retry with exponential backoff for GET requests
async function getWithRetry(endpoint, maxRetries = 2, delay = 1000) {
  let attempt = 0;
  while (true) {
    try {
      return await api.get(endpoint);
    } catch (err) {
      if (err.response?.status === 429 && attempt < maxRetries) {
        const backoff = delay * 2 ** attempt;
        console.log(`🔄 Rate limited, retrying in ${backoff}ms (attempt ${attempt + 1}/${maxRetries})`);
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
    console.log("🔄 Attempting login with credentials:", { email: credentials.email });
    const { data } = await postWithRetry("/user/login", credentials);
    console.log("✅ Login API response:", data);
    
    // Validate the response structure
    if (!data || !data.user || !data.token) {
      throw new Error("Invalid response structure from server");
    }
    
    // data = { user, token, ... }
    dispatch(UserLoginSuccess(data)); // <-- pass as-is
    toast.success(`Welcome back, ${data.user?.name || "User"}!`, { id: "user-login", ...SuccessToastOptions });
    return data;
  } catch (error) {
    console.error("❌ Login error details:", error);
    const errorMsg = parseError(error);
    dispatch(UserLoginFailure(errorMsg));
    
    // Only show error toast if it's a real error, not a network timeout that might still succeed
    if (error.response?.status >= 400) {
      toast.error(errorMsg, { id: "user-login", ...ErrorToastOptions });
    }
    throw error;
  }
};

// Logout User
export const logoutUser = async (dispatch) => {
  dispatch(UserLogout());
  toast.success("Logged out successfully", { id: "user-logout", ...SuccessToastOptions });
  return true;
};

// Optional APIs
export const getUserProfile = async () => {
  const { data } = await getWithRetry("/user/profile");
  return data;
};

export const validateUserToken = async () => {
  const { data } = await getWithRetry("/user/validate-token");
  return data;
};
