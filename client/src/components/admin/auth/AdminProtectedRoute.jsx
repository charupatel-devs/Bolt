import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const AdminProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if admin token exists
      const adminToken = localStorage.getItem("adminToken");

      if (!adminToken) {
        setIsAuthenticated(false);
        return;
      }

      // Validate token with backend (optional - uncomment if you want API validation)
      /*
      try {
        await validateAdminToken();
        setIsAuthenticated(true);
      } catch (error) {
        // Token is invalid, remove it
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
      }
      */

      // Simple client-side check (comment out if using API validation above)
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Authentication check failed:", error);
      localStorage.removeItem("adminToken");
      setIsAuthenticated(false);
      setError("Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div
            className="spinner-border text-primary mb-3"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-muted">Verifying access...</h5>
        </div>
      </div>
    );
  }

  // Error state (optional)
  if (error) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="alert alert-danger">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
          <button
            className="btn btn-primary"
            onClick={() => (window.location.href = "/admin/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Authenticated - render protected admin pages
  return <Outlet />;
};

export default AdminProtectedRoute;
