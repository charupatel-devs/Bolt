import { Navigate, Route, Routes } from "react-router-dom";
import AdminProtectedRoute from "../components/admin/auth/AdminProtectedRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminLogin from "../pages/admin/AdminLogin";

// Product Pages
import ProductList from "../components/admin/products/ProductList";
import AdminAddProduct from "../pages/admin/AdminAddProducts";
import AdminCategories from "../pages/admin/AdminCategories";
import AdminProducts from "../pages/admin/AdminProducts";

// Order Pages
import AllOrders from "../pages/admin/AdminAllOrders";
import Orders from "../pages/admin/AdminOrders";
import PendingOrders from "../pages/admin/AdminPendingOrders";
import CustomerGroups from "../pages/admin/CustomerGroups";
import CustomerReviews from "../pages/admin/CustomerReviews";
import Customers from "../pages/admin/Customers";
import DeliveredOrders from "../pages/admin/DeliveredOrders";
import ProcessingOrders from "../pages/admin/ProcessingOrders";
import Returns from "../pages/admin/Returns";
import ShippedOrders from "../pages/admin/ShippedOrders";
import StockAdjustments from "../pages/admin/StockAdjustments";
import StockManagement from "../pages/admin/StockManagement";

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
        <Route path="/products" element={<AdminProducts />} />
        <Route path="/products/list" element={<ProductList />} />
        <Route path="/products/add" element={<AdminAddProduct />} />
        <Route path="/products/categories" element={<AdminCategories />} />
        <Route path="/products/low-stock" element={<ProductList />} />
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
        <Route path="/inventory/supplier" element={<StockManagement />} />
        <Route
          path="/inventory/purchase-orders"
          element={<StockManagement />}
        />

        {/* 📊 ANALYTICS ROUTES (Future) */}
        {/* <Route path="/analytics" element={<AdminAnalytics />} /> */}
        {/* <Route path="/analytics/sales" element={<AdminSalesAnalytics />} /> */}
        {/* <Route path="/analytics/products" element={<AdminProductAnalytics />} /> */}
        {/* <Route path="/analytics/customers" element={<AdminCustomerAnalytics />} /> */}

        {/* 💰 FINANCE ROUTES (Future) */}
        {/* <Route path="/finance" element={<AdminFinance />} /> */}
        {/* <Route path="/finance/transactions" element={<AdminTransactions />} /> */}
        {/* <Route path="/finance/refunds" element={<AdminRefunds />} /> */}
        {/* <Route path="/finance/reports" element={<AdminFinanceReports />} /> */}

        {/* 📢 MARKETING ROUTES (Future) */}
        {/* <Route path="/marketing" element={<AdminMarketing />} /> */}
        {/* <Route path="/marketing/campaigns" element={<AdminCampaigns />} /> */}
        {/* <Route path="/marketing/coupons" element={<AdminCoupons />} /> */}
        {/* <Route path="/marketing/emails" element={<AdminEmails />} /> */}

        {/* 🔧 SETTINGS ROUTES (Future) */}
        {/* <Route path="/settings" element={<AdminSettings />} /> */}
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
