import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const AdminProtectedRoute = () => {
  const [authState, setAuthState] = useState({
    isChecking: true,
    isAuthenticated: false,
    error: null,
  });

  const location = useLocation();

  useEffect(() => {
    validateAdminAccess();
  }, []);

  const validateAdminAccess = async () => {
    try {
      // Validate token with backend (HttpOnly cookie automatically included)
      const response = await fetch(
        `${"https://bolt-pup2.onrender.com/api"}/admin/validate-token`,
        {
          method: "GET",
          credentials: "include", // 🚨 CRITICAL: Include HttpOnly cookies
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Check if user is actually admin
        if (data.role === "admin" || data.isAdmin || data.admin) {
          setAuthState({
            isChecking: false,
            isAuthenticated: true,
            error: null,
          });
        } else {
          // Valid user but not admin
          setAuthState({
            isChecking: false,
            isAuthenticated: false,
            error: "Access denied: Admin role required",
          });
        }
      } else {
        // Invalid token/session
        setAuthState({
          isChecking: false,
          isAuthenticated: false,
          error: "Invalid or expired session",
        });
      }
    } catch (error) {
      console.error("Admin auth validation failed:", error);
      setAuthState({
        isChecking: false,
        isAuthenticated: false,
        error: "Unable to verify access. Please try again.",
      });
    }
  };

  // Show loading while checking
  if (authState.isChecking) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div
            className="spinner-border text-primary mb-3"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Verifying admin access...</span>
          </div>
          <h5 className="text-muted">Checking permissions...</h5>
          <small className="text-muted">This should only take a moment</small>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!authState.isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        state={{ from: location, error: authState.error }}
        replace
      />
    );
  }

  // Render protected content
  return <Outlet />;
};

export default AdminProtectedRoute;
