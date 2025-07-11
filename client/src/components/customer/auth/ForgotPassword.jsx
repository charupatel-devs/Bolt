import React, { useState } from "react";
import "../../../assets/css/customer/Login.css"; // Reusing same styles
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password reset link sent to:", email);
    // You can integrate API logic here
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo-wrapper">
          <Link to="/customer/" style={{ textDecoration: "none" }}>
            <h1 className="login-logo">BollentElectric</h1>
          </Link>
        </div>
        <h2 className="login-title">Forgot Password</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button className="login-btn" type="submit">
            Send Reset Link
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <Link to="/login" style={{ color: "blue", fontSize: "0.9rem" }}>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
