import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "http://localhost:5001/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Add admin token for admin routes
    if (config.url.includes("/admin")) {
      const adminToken = localStorage.getItem("adminToken");
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      }
    }

    // Add user token for user routes
    else {
      const userToken = localStorage.getItem("userToken");
      if (userToken) {
        config.headers.Authorization = `Bearer ${userToken}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // If admin route, clear admin token and redirect to admin login
      if (error.config.url.includes("/admin")) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
      }
      // If user route, clear user token and redirect to user login
      else {
        localStorage.removeItem("userToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
