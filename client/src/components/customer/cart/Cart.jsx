import React, { useEffect, useState } from "react";
import "../../../assets/css/customer/Cart.css"
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetch("http://localhost:5001/api/orders/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCartItems(data.cartItems || []))
      .catch((err) => console.error(err));
  }, []);

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await fetch(`http://localhost:5001/api/orders/cart/update/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      const data = await res.json();
      if (data.success) {
        setCartItems((prev) =>
          prev.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          )
        );
      } else {
        alert("Failed to update quantity");
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const handleClearCart = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/orders/cart/clear", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setCartItems([]);
        alert("Cart cleared successfully.");
      } else {
        alert("Failed to clear cart.");
      }
    } catch (err) {
      console.error("Clear cart error:", err);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/orders/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.success) {
        setCartItems([]);
        alert("Order placed successfully!");
      } else {
        alert("Order failed.");
      }
    } catch (err) {
      console.error("Place order error:", err);
    }
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
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
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span style={{ margin: "0 8px" }}>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
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
            <button
              onClick={handlePlaceOrder}
              className="order-btn"
              style={{ marginLeft: "10px" }}
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
