import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/customer/Home"; 
import Login from "../components/customer/auth/Login";
import Register from "../components/customer/auth/Register";
import ForgotPassword from "../components/customer/auth/ForgotPassword";
import CustomerProducts from "../pages/customer/CustomerProducts";
const CustomerRoutes = () => {
  return (
    <Routes>
      <Route path="home" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="customer-products" element={< CustomerProducts/>} />

    </Routes>
  );
};

export default CustomerRoutes;
