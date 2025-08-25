import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
   baseURL: "https://bolt-pup2.onrender.com/api",
  timeout: 10000,
  withCredentials: true,
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
        errorMessage: error.response?.data?.message,
        timestamp: new Date().toISOString()
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
      // Handle user routes - Only redirect for protected endpoints
      else {
        const currentPath = window.location.pathname;
        const isUserLoginPage =
          currentPath === "/customer/login" || 
          currentPath === "/login" || 
          currentPath === "/register";
        const isUserLoginRequest =
          requestUrl.includes("/user/login") ||
          requestUrl.includes("/auth/login");
        
        // Only redirect for protected user endpoints, not public ones
        const isProtectedUserEndpoint = 
          requestUrl.includes("/user/profile") ||
          requestUrl.includes("/user/orders") ||
          requestUrl.includes("/user/cart") ||
          requestUrl.includes("/user/settings");

        console.log("👤 User route 401 detected:", {
          isUserLoginPage,
          isUserLoginRequest,
          isProtectedUserEndpoint,
          currentPath,
          requestUrl
        });

        // Only redirect if it's a protected endpoint and not on login page
        if (isProtectedUserEndpoint && !isUserLoginPage && !isUserLoginRequest) {
          console.log("🔐 User session expired for protected endpoint, redirecting to login");
          window.location.href = "/customer/login";
        } else {
          console.log("💡 Public endpoint 401 or login page - not redirecting");
        }
      }
    }

    // Handle 429 Rate Limiting - Don't redirect, just log
    if (error.response?.status === 429) {
      console.log("⚠️ RATE LIMIT DETECTED:", {
        url: error.config?.url,
        message: "Too many requests. Please wait before trying again.",
        retryAfter: error.response?.headers?.['retry-after'] || 'unknown'
      });
      // Don't redirect for rate limiting - just let the error bubble up
    }

    return Promise.reject(error);
  }
);

export default api;
