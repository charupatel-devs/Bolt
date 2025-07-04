import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/customer/Home"; 
import Login from "../components/customer/auth/Login";
import Register from "../components/customer/auth/Register";
import ForgotPassword from "../components/customer/auth/ForgotPassword";
import Products from "../components/customer/products/Products";
import CategoryProducts from "../components/customer/products/CategoryProducts";

{/*import Dashboard from "../pages/customer/Dashboard";*/}


<Routes></Routes>
const CustomerRoutes = () => {
  return (
   <Routes>
  <Route path="" element={<Home />} />
  <Route path="login" element={<Login />} />
  <Route path="register" element={<Register />} />
  <Route path="forgot-password" element={<ForgotPassword />} />
  <Route path="products" element={<Products />} />
 <Route path="products/category/categoryId" element={<CategoryProducts />} />
  {/*<Route path="dashboard" element={<Dashboard />} /> */}
  
</Routes>

  );
};

export default CustomerRoutes;
