import { Navigate, Route, Routes } from "react-router-dom";
import AdminProtectedRoute from "../components/admin/auth/AdminProtectedRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminLogin from "../pages/admin/AdminLogin";

// Product Pages
import AdminAddProduct from "../pages/admin/AdminAddProducts";
import AdminCategories from "../pages/admin/AdminCategories";

// Order Pages
import AllOrders from "../pages/admin/AdminAllOrders";
import Orders from "../pages/admin/AdminOrders";
import PendingOrders from "../pages/admin/AdminPendingOrders";
import AdminProductsManagement from "../pages/admin/AdminProductsManagement";
import AdminSettings from "../pages/admin/AdminSettings";
import AllProducts from "../pages/admin/AllProducts";
import CustomerAnalytics from "../pages/admin/CustomerAnalytics";
import CustomerGroups from "../pages/admin/CustomerGroups";
import CustomerReviews from "../pages/admin/CustomerReviews";
import Customers from "../pages/admin/Customers";
import DeliveredOrders from "../pages/admin/DeliveredOrders";
import PaymentMethods from "../pages/admin/PaymentMethods";
import ProcessingOrders from "../pages/admin/ProcessingOrders";
import ProductPerformance from "../pages/admin/ProductPerformance";
import PurchaseOrders from "../pages/admin/PurchaseOrders";
import Refunds from "../pages/admin/Refunds";
import Returns from "../pages/admin/Returns";
import SalesReports from "../pages/admin/SalesReports";
import ShippedOrders from "../pages/admin/ShippedOrders";
import ShippingMethods from "../pages/admin/ShippingMethods";
import ShippingZones from "../pages/admin/ShippingZones";
import StockAdjustments from "../pages/admin/StockAdjustments";
import StockManagement from "../pages/admin/StockManagement";
import Suppliers from "../pages/admin/Suppliers";
import TrackShipments from "../pages/admin/TrackShipments";

// Commented out pages for future implementation
// import AdminAnalytics from "../pages/admin/AdminAnalytics";
// import AdminBulkUpload from "../pages/admin/AdminBulkUpload";
// import AdminLowStock from "../pages/admin/AdminLowStock";
// import AdminNotFound from "../pages/admin/AdminNotFound";
// import AdminOrderDetails from "../pages/admin/AdminOrderDetails";
// import AdminProductDetails from "../pages/admin/AdminProductDetails";
// import AdminProductForm from "../pages/admin/AdminProductForm";
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
        {/* Dashboard */}
        <Route path="/dashboard" element={<AdminDashboard />} />

        {/* 📦 PRODUCTS ROUTES */}
        <Route path="/products" element={<AdminProductsManagement />} />
        <Route path="/products/list" element={<AllProducts />} />
        <Route path="/products/add" element={<AdminAddProduct />} />
        <Route path="/products/categories" element={<AdminCategories />} />
        <Route path="/products/low-stock" element={<AllProducts />} />
        {/* <Route path="/products/:id" element={<AdminProductDetails />} /> */}
        {/* <Route path="/products/edit/:id" element={<AdminProductForm />} /> */}
        {/* <Route path="/products/bulk-upload" element={<AdminBulkUpload />} /> */}

        {/* 🛒 ORDERS ROUTES */}
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/all" element={<AllOrders />} />
        <Route path="/orders/pending" element={<PendingOrders />} />
        <Route path="/orders/processing" element={<ProcessingOrders />} />
        <Route path="/orders/shipped" element={<ShippedOrders />} />
        <Route path="/orders/delivered" element={<DeliveredOrders />} />
        <Route path="/orders/returns" element={<Returns />} />
        {/* <Route path="/orders/:id" element={<AdminOrderDetails />} /> */}

        {/* 👥 CUSTOMERS ROUTES (Future) */}
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/groups" element={<CustomerGroups />} />
        <Route path="/customers/reviews" element={<CustomerReviews />} />
        {/* <Route path="/customers/:id" element={<AdminUserDetails />} />


        {/* 📊 INVENTORY ROUTES (Future) */}
        <Route path="/inventory" element={<StockManagement />} />
        <Route path="/inventory/adjustments" element={<StockAdjustments />} />
        <Route path="/inventory/suppliers" element={<Suppliers />} />
        <Route path="/inventory/purchase-orders" element={<PurchaseOrders />} />

        {/* 📊 ANALYTICS ROUTES (Future) */}
        <Route path="/analytics/sales" element={<SalesReports />} />
        <Route path="/analytics/products" element={<ProductPerformance />} />
        <Route path="/analytics/customers" element={<CustomerAnalytics />} />

        {/* 💰 SHIPPING ROUTES (Future) */}
        <Route path="/shipping/methods" element={<ShippingMethods />} />
        <Route path="/shipping/zones" element={<ShippingZones />} />
        <Route path="/shipping/tracking" element={<TrackShipments />} />

        {/* 💰 FINANCE ROUTES (Future) */}
        <Route path="/finance/payments" element={<PaymentMethods />} />
        <Route path="/finance/refunds" element={<Refunds />} />

        {/* 📢 MARKETING ROUTES (Future) */}
        {/* <Route path="/marketing" element={<AdminMarketing />} />
        <Route path="/marketing/campaigns" element={<AdminCampaigns />} />
        <Route path="/marketing/coupons" element={<AdminCoupons />} />
        <Route path="/marketing/emails" element={<AdminEmails />} /> */}

        {/* 🔧 SETTINGS ROUTES (Future) */}
        <Route path="/settings" element={<AdminSettings />} />
        {/* <Route path="/settings/general" element={<AdminGeneralSettings />} /> */}
        {/* <Route path="/settings/payment" element={<AdminPaymentSettings />} /> */}
        {/* <Route path="/settings/shipping" element={<AdminShippingSettings />} /> */}
        {/* <Route path="/settings/notifications" element={<AdminNotificationSettings />} /> */}

        {/* 👨‍💼 STAFF MANAGEMENT (Future) */}
        {/* <Route path="/staff" element={<AdminStaff />} /> */}
        {/* <Route path="/staff/roles" element={<AdminRoles />} /> */}
        {/* <Route path="/staff/permissions" element={<AdminPermissions />} /> */}

        {/* 📋 INVENTORY ROUTES (Future) */}
        {/* <Route path="/inventory" element={<AdminInventory />} /> */}
        {/* <Route path="/inventory/stock" element={<AdminStock />} /> */}
        {/* <Route path="/inventory/suppliers" element={<AdminSuppliers />} /> */}
        {/* <Route path="/inventory/warehouses" element={<AdminWarehouses />} /> */}

        {/* 🎫 SUPPORT ROUTES (Future) */}
        {/* <Route path="/support" element={<AdminSupport />} /> */}
        {/* <Route path="/support/tickets" element={<AdminTickets />} /> */}
        {/* <Route path="/support/chat" element={<AdminChat />} /> */}
        {/* <Route path="/support/knowledge-base" element={<AdminKnowledgeBase />} /> */}
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

      {/* 404 Not Found (Future) */}
      {/* <Route path="*" element={<AdminNotFound />} /> */}
    </Routes>
  );
};

export default AdminRoutes;
