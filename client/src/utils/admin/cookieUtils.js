// Cookie utility functions for client-side operations
// Note: HttpOnly cookies cannot be read by JavaScript for security
// These functions are for non-HttpOnly cookies only

// Get cookie value (for non-HttpOnly cookies)
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

// Set cookie (for non-HttpOnly cookies)
export const setCookie = (name, value, days = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
};

// Delete cookie
export const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

// Check if user is authenticated (by making API call since token is HttpOnly)
export const checkAuthStatus = async () => {
  try {
    const response = await fetch(
      `${
        process.env.REACT_APP_API_URL || "http://localhost:5001/api"
      }/admin/validate-token`,
      {
        method: "GET",
        credentials: "include", // Important: Include cookies in request
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.ok;
  } catch (error) {
    return false;
  }
};
