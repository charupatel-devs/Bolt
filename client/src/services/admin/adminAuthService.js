import axios from "../api";

// Admin authentication API calls

// Login admin
export const adminLogin = async (credentials) => {
  try {
    const response = await axios.post("/admin/login", {
      email: credentials.email,
      password: credentials.password,
    });

    return response.data;
  } catch (error) {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data.message || "Invalid credentials");
    } else if (error.request) {
      // Network error
      throw new Error("Network error. Please check your connection.");
    } else {
      // Other error
      throw new Error("Something went wrong. Please try again.");
    }
  }
};

// Get admin profile (to check if logged in)
export const getAdminProfile = async () => {
  try {
    const response = await axios.get("/admin/profile");
    return response.data;
  } catch (error) {
    throw new Error("Failed to get admin profile");
  }
};

// Logout admin
export const adminLogout = async () => {
  try {
    await axios.post("/admin/logout");
    return true;
  } catch (error) {
    // Even if API fails, we can still logout locally
    return true;
  }
};

// Check if admin token is valid
export const validateAdminToken = async () => {
  try {
    const response = await axios.get("/admin/validate-token");
    return response.data;
  } catch (error) {
    throw new Error("Invalid token");
  }
};
