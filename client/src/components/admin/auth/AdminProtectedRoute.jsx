import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { GetAdminProfile } from "../../../services_hooks/admin/adminAuthService";

const AdminProtectedRoute = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { isAuthenticated, token, isFetching, admin } = useSelector(
    (state) => state.adminAuth
  );

  // Check authentication on mount
  useEffect(() => {
    if (token && !admin && !isFetching) {
      // We have a token but no admin profile, fetch it
      GetAdminProfile(dispatch).catch(() => {
        // Error is handled in the API call
      });
    }
  }, [dispatch, token, admin, isFetching]);

  // Show loading while checking authentication
  if (isFetching) {
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

  // Redirect to login if not authenticated
  if (!isAuthenticated || !token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Render protected admin pages if authenticated
  return <Outlet />;
};

export default AdminProtectedRoute;
