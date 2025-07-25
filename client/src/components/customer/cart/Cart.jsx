import React, { useEffect } from "react";
import "../../../assets/css/customer/Cart.css";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  fetchCartStart,
  fetchCartSuccess,
  fetchCartFailure,
  updateCartQuantity,
  clearCartState,
} from "../../../store/customer/cartSlice";

import {
  fetchCartItems,
  updateCartItemQuantity,
  clearCartService,
  // placeOrderService, // Order functionality commented out
} from "../../../services_hooks/customer/cartService";

const Cart = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.userAuth.token);
  const { cartItems, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    const loadCart = async () => {
      dispatch(fetchCartStart());
      try {
        const items = await fetchCartItems(token);
        dispatch(fetchCartSuccess(items));
      } catch (err) {
        dispatch(fetchCartFailure("Failed to load cart"));
      }
    };
    loadCart();
  }, [dispatch, token]);

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      await updateCartItemQuantity(productId, quantity, token);
      dispatch(updateCartQuantity({ productId, quantity }));
    } catch (err) {
      dispatch(fetchCartFailure("Failed to update quantity"));
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCartService(token);
      dispatch(clearCartState());
    } catch (err) {
      dispatch(fetchCartFailure("Failed to clear cart"));
    }
  };

  // const handlePlaceOrder = async () => {
  //   try {
  //     const res = await placeOrderService(token);
  //     if (res.success) {
  //       dispatch(clearCartState());
  //       toast.success("Order placed successfully!");
  //     } else {
  //       toast.error("Order failed");
  //     }
  //   } catch (err) {
  //     toast.error("Error placing order");
  //   }
  // };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {loading ? (
        <p>Loading...</p>
      ) : cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.productId}>
                  <td>{item.productName}</td>
                  <td>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.productId, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span style={{ margin: "0 8px" }}>{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.productId, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </td>
                  <td>₹{item.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: "20px", textAlign: "right" }}>
            <button onClick={handleClearCart} className="clear-btn">
              Clear Cart
            </button>
            {/* <button
              onClick={handlePlaceOrder}
              className="order-btn"
              style={{ marginLeft: "10px" }}
            >
              Place Order
            </button> */}
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
