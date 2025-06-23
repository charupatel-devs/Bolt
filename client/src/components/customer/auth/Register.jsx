import React from "react";
import { Link } from "react-router-dom";
import "../../../assets/css/customer/Register.css";
import Navbar from "../layout/Navbar"
const Register = () => {
  return (
    <div className="reg-container">
      <div className="reg-box">
          <div className="reg-logo-wrapper">
          <Link to="/customer/home" style={{ textDecoration: "none" }}>
    <h1 className="reg-logo">BollentElectric</h1>
  </Link>
        </div>
        <h2>Create Your Account</h2>

        <form className="reg-form">
          {/* Personal Info */}
          <div className="form-group">
            <label> Name</label>
            <input type="text" placeholder="Enter first name" required />
          </div>
         

          {/* Contact Info */}
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="Enter email" required />
          </div>

         

          {/* Password */}
<div className="form-group">
  <label>Password</label>
  <input type="password" placeholder="Create password" required />
</div>

{/* Confirm Password */}
<div className="form-group">
  <label>Confirm Password</label>
  <input type="password" placeholder="Re-enter password" required />
</div>
 <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" placeholder="Enter phone number" />
          </div>

          <div className="form-group checkbox-group">
  <input type="checkbox" id="terms" required />
  <label htmlFor="terms">
    I agree to the <a href="#">Terms & Conditions</a> and{" "}
    <a href="#">Privacy Policy</a>.
  </label>
</div>


          <button className="reg-btn" type="submit">
            Create Account
          </button>
        </form>

        <p className="reg-footer">
          Already have an account? <Link to="/customer/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
