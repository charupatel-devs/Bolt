import api from "../api";

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    const response = await api.get("/admin/dashboard");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch dashboard stats"
    );
  }
};

// Get recent activities
export const getRecentActivities = async () => {
  try {
    const response = await api.get("/admin/activities/recent");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch recent activities"
    );
  }
};

// Get sales analytics
export const getSalesAnalytics = async () => {
  try {
    const response = await api.get("/admin/analytics/sales");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch sales analytics"
    );
  }
};
