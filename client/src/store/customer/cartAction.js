import {
  fetchCartStart,
  fetchCartSuccess,
  fetchCartFailure,
  addToCartStart,
  addToCartSuccess,
  addToCartFailure
} from "./cartSlice";
import { fetchCartItems, addCartItem } from "../../services_hooks/customer/cartService";
import toast from "react-hot-toast";

export const fetchCartItemsAction = () => async (dispatch) => {
  dispatch(fetchCartStart());
  try {
    const token = localStorage.getItem("userToken");
    const items = await fetchCartItems(token);
    dispatch(fetchCartSuccess(items));
  } catch (err) {
    dispatch(fetchCartFailure("Failed to fetch cart"));
  }
};

export const addToCartAction = (productId, quantity = 1) => async (dispatch) => {
  dispatch(addToCartStart());
  try {
    const token = localStorage.getItem("userToken");
    console.log("🎯 CartAction: Dispatching addToCart with:", { productId, quantity, token: token ? "Present" : "Missing" });
    
    const items = await addCartItem(productId, quantity, token);
    dispatch(addToCartSuccess(items));
    // Remove duplicate toast - cartService already shows success message
  } catch (err) {
    console.error("🎯 CartAction: Add to cart failed:", err.message);
    dispatch(addToCartFailure("Failed to add item"));
    // Remove duplicate toast - cartService already shows error message
  }
};
