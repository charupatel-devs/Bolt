import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "http://localhost:5001/api",
  timeout: 10000,
  withCredentials: true, // 🚨 CRITICAL: Include cookies in requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Cookies are automatically included
api.interceptors.request.use(
  (config) => {
    console.log("🚀 API REQUEST:", {
      url: config.url,
      method: config.method,
      fullURL: config.baseURL + config.url,
      withCredentials: config.withCredentials,
      currentPath: window.location.pathname,
    });

    // No need to manually add Authorization header
    // HttpOnly cookies are automatically included by browser

    return config;
  },
  (error) => {
    console.error("❌ REQUEST ERROR:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
api.interceptors.response.use(
  (response) => {
    console.log("✅ API SUCCESS:", {
      url: response.config.url,
      status: response.status,
    });
    return response;
  },
  (error) => {
    console.error("❌ API ERROR:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message,
      currentPath: window.location.pathname,
    });

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      const requestUrl = error.config.url;
      const currentPath = window.location.pathname;

      console.log("🔐 401 UNAUTHORIZED DETECTED:", {
        requestUrl,
        currentPath,
        isAdminRoute: requestUrl.includes("/admin"),
        isLoginPage: currentPath === "/admin/login",
        isLoginRequest: requestUrl.includes("/admin/login"),
      });

      if (requestUrl.includes("/admin")) {
        const isLoginPage = currentPath === "/admin/login";
        const isLoginRequest = requestUrl.includes("/admin/login");

        if (!isLoginPage && !isLoginRequest) {
          console.log("🚨 REDIRECTING TO LOGIN - Invalid admin session");
          window.location.href = "/admin/login";
        } else {
          console.log("💡 Login failed - staying on login page");
        }
      }
      // Handle user routes
      else {
        const currentPath = window.location.pathname;
        const isUserLoginPage =
          currentPath === "/login" || currentPath === "/register";
        const isUserLoginRequest =
          requestUrl.includes("/user/login") ||
          requestUrl.includes("/auth/login");

        if (!isUserLoginPage && !isUserLoginRequest) {
          console.log("🔐 User session expired, redirecting to login");
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
