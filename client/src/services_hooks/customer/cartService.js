// services_hooks/customer/cartService.js
import api from "../api";
import axios from "axios";
import toast from "react-hot-toast";

const ErrorToastOptions = { duration: 4000, style: { background: "#f87171", color: "#fff" } };
const SuccessToastOptions = { duration: 3000, style: { background: "#4ade80", color: "#000" } };

const parseError = (error) => {
  if (error.response) return error.response.data.message || "Something went wrong.";
  else if (error.request) return "Network error. Please check your connection.";
  else return "Unexpected error occurred.";
};

export const fetchCartItems = async (token) => {
  try {
    const { data } = await api.get("/orders/cart", {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("🛒 fetchCartItems raw response:", data);
    console.log("🛒 cart.items structure:", data.cart?.items);
    console.log("🛒 first item structure:", data.cart?.items?.[0]);
    // Extract items array from cart object
    return data.cart?.items || [];
  } catch (err) {
    const msg = parseError(err);
    toast.error(msg, ErrorToastOptions);
    throw new Error(msg);
  }
};

export const addCartItem = async (productId, quantity, token) => {
  try {
    console.log("🛒 Adding to cart:", { 
      productId, 
      quantity, 
      token: token ? "Present" : "Missing",
      apiBaseURL: api.defaults.baseURL 
    });
    
    const payload = { productId, quantity };
    console.log("📦 Cart payload:", payload);
    console.log("🌐 Full API URL:", `${api.defaults.baseURL}/orders/cart/add`);
    
    const res = await api.post("/orders/cart/add", payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log("✅ Cart add response:", res.data);
    toast.success("Item added to cart!", SuccessToastOptions);
    return res.data.cart;
  } catch (err) {
    console.error("❌ Cart add error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message,
      productId,
      quantity,
      fullError: err
    });
    
    const msg = parseError(err);
    toast.error(msg, ErrorToastOptions);
    throw new Error(msg);
  }
};

export const updateCartItemQuantity = async (productId, quantity, token) => {
  try {
    const res = await api.put(`/orders/cart/update/${productId}`, { quantity }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success("Quantity updated", SuccessToastOptions);
    return res.data;
  } catch (err) {
    const msg = parseError(err);
    toast.error(msg, ErrorToastOptions);
    throw new Error(msg);
  }
};

export const clearCartService = async (token) => {
  try {
    const res = await api.delete("/orders/cart/clear", {
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success("Cart cleared!", SuccessToastOptions);
    return res.data;
  } catch (err) {
    const msg = parseError(err);
    toast.error(msg, ErrorToastOptions);
    throw new Error(msg);
  }
};

export const calculateShipping = async (address, items, token) => {
  try {
    const res = await api.post("/orders/calculate-shipping", { address, items }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    const msg = parseError(err);
    toast.error(msg, ErrorToastOptions);
    throw new Error(msg);
  }
};
