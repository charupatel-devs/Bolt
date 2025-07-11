import {
  fetchCartStart,
  fetchCartSuccess,
  fetchCartFailure,
  addToCartStart,
  addToCartSuccess,
  addToCartFailure,
  updateCartQuantity,
  removeCartItem,
  clearCart,
} from "../../store/customer/cartSlice";
import toast from "react-hot-toast";
import api from "../api";

// Toast Options
const ErrorToastOptions = { duration: 4000, style: { background: "#f87171", color: "#fff" } };
const SuccessToastOptions = { duration: 3000, style: { background: "#4ade80", color: "#000" } };

const parseError = (error) => {
  if (error.response) {
    return error.response.data.message || "Invalid credentials.";
  } else if (error.request) {
    return "Network error. Please check your connection.";
  } else {
    return "Something went wrong.";
  }
};



// Fetch Cart
export const fetchCart = () => async (dispatch) => {
  dispatch(fetchCartStart());
  try {
    const token = localStorage.getItem("userToken");
    const { data } = await api.get("/orders/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(fetchCartSuccess(data.cartItems));
  } catch (error) {
    dispatch(fetchCartFailure("Failed to load cart"));
  }
};

// Add to Cart
export const addToCart = (productId, quantity = 1) => async (dispatch) => {
  dispatch(addToCartStart());
  try {
    const token = localStorage.getItem("userToken");
    const { data } = await api.post(
      "/orders/cart/add",
      { productId, quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    dispatch(addToCartSuccess(data.cartItems));
  } catch (error) {
    dispatch(addToCartFailure("Failed to add item to cart"));
  }
};
