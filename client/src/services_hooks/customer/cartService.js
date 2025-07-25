// import {
//   fetchCartStart,
//   fetchCartSuccess,
//   fetchCartFailure,
//   addToCartStart,
//   addToCartSuccess,
//   addToCartFailure,
//   updateCartQuantity,
//   removeCartItem,
//   clearCart,
// } from "../../store/customer/cartSlice";
// import toast from "react-hot-toast";
// import api from "../api";

// // Toast Options
// const ErrorToastOptions = { duration: 4000, style: { background: "#f87171", color: "#fff" } };
// const SuccessToastOptions = { duration: 3000, style: { background: "#4ade80", color: "#000" } };

// const parseError = (error) => {
//   if (error.response) {
//     return error.response.data.message || "Invalid credentials.";
//   } else if (error.request) {
//     return "Network error. Please check your connection.";
//   } else {
//     return "Something went wrong.";
//   }
// };



// // Fetch Cart
// export const fetchCart = () => async (dispatch) => {
//   dispatch(fetchCartStart());
//   try {
//     const token = localStorage.getItem("userToken");
//     const { data } = await api.get("/orders/cart", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     dispatch(fetchCartSuccess(data.cartItems));
//   } catch (error) {
//     dispatch(fetchCartFailure("Failed to load cart"));
//   }
// };

// // Add to Cart
// export const addToCart = (productId, quantity = 1) => async (dispatch) => {
//   dispatch(addToCartStart());
//   try {
//     const token = localStorage.getItem("userToken");
//     const { data } = await api.post(
//       "/orders/cart/add",
//       { productId, quantity },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     dispatch(addToCartSuccess(data.cartItems));
//   } catch (error) {
//     dispatch(addToCartFailure("Failed to add item to cart"));
//   }
// };



// services_hooks/customer/cartService.js
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE = "http://localhost:5001/api/orders";

const ErrorToastOptions = { duration: 4000, style: { background: "#f87171", color: "#fff" } };
const SuccessToastOptions = { duration: 3000, style: { background: "#4ade80", color: "#000" } };

const parseError = (error) => {
  if (error.response) return error.response.data.message || "Something went wrong.";
  else if (error.request) return "Network error. Please check your connection.";
  else return "Unexpected error occurred.";
};

export const fetchCartItems = async (token) => {
  try {
    const res = await axios.get(`${API_BASE}/cart`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.cartItems;
  } catch (err) {
    const msg = parseError(err);
    toast.error(msg, ErrorToastOptions);
    throw new Error(msg);
  }
};

export const addCartItem = async (productId, quantity, token) => {
  try {
    const res = await axios.post(`${API_BASE}/cart/add`, { productId, quantity }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success("Item added to cart!", SuccessToastOptions);
    return res.data.cartItems;
  } catch (err) {
    const msg = parseError(err);
    toast.error(msg, ErrorToastOptions);
    throw new Error(msg);
  }
};

export const updateCartItemQuantity = async (productId, quantity, token) => {
  try {
    const res = await axios.put(`${API_BASE}/cart/update/${productId}`, { quantity }, {
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
    const res = await axios.delete(`${API_BASE}/cart/clear`, {
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


