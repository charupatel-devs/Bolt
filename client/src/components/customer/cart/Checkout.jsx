import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { calculateShipping } from "../../../services_hooks/customer/cartService";
import toast from "react-hot-toast";
import "../../../assets/css/customer/Checkout.css";

const Checkout = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.userAuth);
  
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India"
  });
  
  const [shippingCost, setShippingCost] = useState(0);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0
  });

  // Calculate subtotal whenever cart items change
  useEffect(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + shippingCost + tax;
    
    setOrderSummary({
      subtotal,
      shipping: shippingCost,
      tax,
      total
    });
  }, [cartItems, shippingCost]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCalculateShipping = async () => {
    if (!shippingAddress.name || !shippingAddress.addressLine1 || !shippingAddress.city) {
      toast.error("Please fill in required address fields");
      return;
    }

    setIsCalculatingShipping(true);
    try {
      const items = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      }));

      const result = await calculateShipping(shippingAddress, items, token);
      setShippingCost(result.shippingCost || 0);
      toast.success("Shipping calculated successfully");
    } catch (error) {
      toast.error("Failed to calculate shipping");
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  const handlePlaceOrder = () => {
    if (!shippingAddress.name || !shippingAddress.addressLine1) {
      toast.error("Please complete shipping address");
      return;
    }
    
    // Here you would integrate with your order placement API
    toast.success("Order placement functionality to be implemented");
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add some items to proceed with checkout</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <div className="checkout-left">
          <div className="shipping-section">
            <h2>Shipping Address</h2>
            <div className="address-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={shippingAddress.name}
                    onChange={handleAddressChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleAddressChange}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Address Line 1 *</label>
                <input
                  type="text"
                  name="addressLine1"
                  value={shippingAddress.addressLine1}
                  onChange={handleAddressChange}
                  placeholder="Street address, building, apartment"
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    placeholder="City"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleAddressChange}
                    placeholder="State"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleAddressChange}
                    placeholder="Postal code"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <select
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleAddressChange}
                  >
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                  </select>
                </div>
              </div>
              
              <button 
                className="calculate-shipping-btn"
                onClick={handleCalculateShipping}
                disabled={isCalculatingShipping}
              >
                {isCalculatingShipping ? "Calculating..." : "Calculate Shipping"}
              </button>
            </div>
          </div>
        </div>

        <div className="checkout-right">
          <div className="order-summary">
            <h2>Order Summary</h2>
            
            <div className="cart-items-summary">
              {cartItems.map((item) => (
                <div key={item.productId} className="summary-item">
                  <div className="item-details">
                    <span className="item-name">{item.productName}</span>
                    <span className="item-qty">Qty: {item.quantity}</span>
                  </div>
                  <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="summary-calculations">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{orderSummary.subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>₹{orderSummary.shipping.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax (GST 18%):</span>
                <span>₹{orderSummary.tax.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{orderSummary.total.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              className="place-order-btn"
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;