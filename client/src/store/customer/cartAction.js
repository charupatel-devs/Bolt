import {
  fetchCartStart,
  fetchCartSuccess,
  fetchCartFailure,
  addToCartStart,
  addToCartSuccess,
  addToCartFailure
} from "../../store/customer/cartSlice";
import { fetchCartItems, addCartItem } from "../../services_hooks/customer/cartService";
import toast from "react-hot-toast";

export const fetchCartItemsAction = () => async (dispatch) => {
  dispatch(fetchCartStart());
  try {
    const token = localStorage.getItem("authToken");
    const items = await fetchCartItems(token);
    dispatch(fetchCartSuccess(items));
  } catch (err) {
    dispatch(fetchCartFailure("Failed to fetch cart"));
  }
};

export const addToCartAction = (productId, quantity = 1) => async (dispatch) => {
  dispatch(addToCartStart());
  try {
    const token = localStorage.getItem("authToken");
    const items = await addCartItem(productId, quantity, token);
    dispatch(addToCartSuccess(items));
    toast.success("Item added to cart");
  } catch (err) {
    dispatch(addToCartFailure("Failed to add item"));
    toast.error("Failed to add item to cart");
  }
};
