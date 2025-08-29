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

export const fetchCartItemsAction = () => async (dispatch, getState) => {
  dispatch(fetchCartStart());
  try {
    const { userToken } = getState().userAuth;
    const items = await fetchCartItems(userToken);
    dispatch(fetchCartSuccess(items));
  } catch (err) {
    dispatch(fetchCartFailure("Failed to fetch cart"));
  }
};

export const addToCartAction = (productId, quantity = 1) => async (dispatch, getState) => {
  dispatch(addToCartStart());
  try {
    const { userToken } = getState().userAuth;
    console.log("🎯 CartAction: Dispatching addToCart with:", { productId, quantity, token: userToken ? "Present" : "Missing" });
    
    const items = await addCartItem(productId, quantity, userToken);
    console.log("🎯 CartAction: Add to cart response:", items);
    
    dispatch(addToCartSuccess(items));
    
    // Force refresh cart after successful add
    console.log("🎯 CartAction: Refreshing cart after add...");
    setTimeout(() => {
      dispatch(fetchCartItemsAction());
    }, 500);
    
    // Remove duplicate toast - cartService already shows success message
  } catch (err) {
    console.error("🎯 CartAction: Add to cart failed:", err.message);
    dispatch(addToCartFailure("Failed to add item"));
    // Remove duplicate toast - cartService already shows error message
  }
};
