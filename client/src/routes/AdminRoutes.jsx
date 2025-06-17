import { Navigate, Route, Routes } from "react-router-dom";
// import AdminProtectedRoute from "../components/admin/auth/AdminProtectedRoute";
// import AdminLayout from "../components/admin/layout/AdminLayout";

// Admin Pages
// import AdminAnalytics from "../pages/admin/AdminAnalytics";
// import AdminBulkUpload from "../pages/admin/AdminBulkUpload";
import AdminProtectedRoute from "../components/admin/auth/AdminProtectedRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminLogin from "../pages/admin/AdminLogin";
// import AdminLowStock from "../pages/admin/AdminLowStock";
// import AdminNotFound from "../pages/admin/AdminNotFound";
// import AdminOrderDetails from "../pages/admin/AdminOrderDetails";
// import AdminOrders from "../pages/admin/AdminOrders";
// import AdminProductDetails from "../pages/admin/AdminProductDetails";
// import AdminProductForm from "../pages/admin/AdminProductForm";
// import AdminProducts from "../pages/admin/AdminProducts";
// import AdminSettings from "../pages/admin/AdminSettings";
// import AdminUserDetails from "../pages/admin/AdminUserDetails";
// import AdminUsers from "../pages/admin/AdminUsers";

const AdminRoutes = () => {
  return (
    <Routes>
      {/* 🔓 PUBLIC: Login page */}
      <Route path="/login" element={<AdminLogin />} />

      {/* 🔐 PROTECTED: Admin pages */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/dashboard" element={<AdminDashboard />} />
        {/* <Route path="/users" element={<AdminUsers />} /> */}
        {/* Add more protected routes here */}
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
