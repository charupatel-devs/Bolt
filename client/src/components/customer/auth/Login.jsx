import React, { useState } from "react";
import "../../../assets/css/customer/Login.css";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-container">
      <div className="login-box">
         <div className="login-logo-wrapper">
         <Link to="/customer/home" style={{ textDecoration: "none" }}>
    <h1 className="login-logo">BollentElectric</h1>
  </Link>
        </div>
        <h2 className="login-title">Login</h2>

        <form>
          <div className="form-group">
            <label>Email / Username</label>
            <input type="email" placeholder="Enter email" />
          </div>

          <div className="form-group" style={{ position: "relative" }}>
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button className="login-btn" type="submit">
            Login
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1rem" }}>
  <Link to="/customer/forgot-password" style={{ color: "blue", fontSize: "0.9rem" }}>
    Forgot Password
  </Link>
</div>


        <hr />

        <div className="register-link">
          Don’t have an account?{" "}
          <Link to="/customer/register" style={{ color: "red", fontWeight: "bold" }}>
            Register Now
          </Link>
        </div>
      </div>

     
<p className="login-footer">
  Copyright © 1995–2025, BollentElectric.<br />
  <a href="#">Terms & Conditions</a> | <a href="#">Privacy Statement</a>
</p>
    </div>
  );
};

export default Login;
