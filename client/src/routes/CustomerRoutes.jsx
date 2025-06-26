import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/customer/Home"; 
import Login from "../components/customer/auth/Login";
import Register from "../components/customer/auth/Register";
import ForgotPassword from "../components/customer/auth/ForgotPassword";
import CustomerProducts from "../pages/customer/CustomerProducts";
import Dashboard from "../pages/customer/Dashboard";
import ProductList from "../components/customer/products/ProductList";
const CustomerRoutes = () => {
  return (
   <Routes>
  <Route path="" element={<Home />} />
  <Route path="login" element={<Login />} />
  <Route path="register" element={<Register />} />
  <Route path="forgot-password" element={<ForgotPassword />} />
  <Route path="customer-products" element={<CustomerProducts />} />
  <Route path="dashboard" element={<Dashboard />} />
</Routes>

  );
};

export default CustomerRoutes;
