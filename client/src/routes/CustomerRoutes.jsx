import { Route, Routes, Navigate } from "react-router-dom";
import ForgotPassword from "../components/customer/auth/ForgotPassword";
import Login from "../components/customer/auth/Login";
import Register from "../components/customer/auth/Register";
import CategoryProducts from "../components/customer/products/CategoryProducts";
import Products from "../components/customer/products/Products";
import Home from "../pages/customer/Home";
import AboutUs from "../pages/customer/AboutUs";
import ContactUs from "../pages/customer/ContactUs";
import ProductCard from "../components/customer/products/ProductCard";
import Cart from "../components/customer/cart/Cart";
// import OrderDetails from "../components/customer/orders/OrderDetails";
import ProtectedRoute from "../utils/customer/ProtectedRoute";
// import Dashboard from "../pages/customer/Dashboard";

const CustomerRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="products" element={<Products />} />
      <Route path="products/category/:categoryId" element={<CategoryProducts />} />
      <Route path="product/:productId" element={<ProductCard />} />
      <Route path="about" element={<AboutUs />} />
      <Route path="contact" element={<ContactUs />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="customer/cart" element={<Cart />} />
        {/* <Route path="customer/order-details/:orderId" element={<OrderDetails />} /> */}
        {/* {/* <Route path="dashboard" element={<Dashboard />} />  */}
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default CustomerRoutes;
