import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../assets/css/customer/Register.css";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../services_hooks/customer/userAuthApi";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Error states
  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validatePhone = (num) => /^\d{10,}$/.test(num);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Password validation
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }
    setPasswordError("");

    // Phone number validation
    if (!validatePhone(phone)) {
      setPhoneError("Phone number must be at least 10 digits.");
      return;
    }
    setPhoneError("");

    setIsSubmitting(true);
    try {
      await registerUser(dispatch, { name, email, password, confirmPassword, phone });
      console.log("Registration successful");
      navigate("/customer/login");
    } catch (err) {
      console.error("Registration failed:", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reg-container">
      <div className="reg-box">
        <div className="reg-logo-wrapper">
          <Link to="/customer/" style={{ textDecoration: "none" }}>
            <h1 className="reg-logo">BollentElectric</h1>
          </Link>
        </div>

        <h2>Create Your Account</h2>

        <form className="reg-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
            />
            {passwordError && <p className="text-error">{passwordError}</p>}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter password"
              required
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setPasswordError("");
              }}
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="Enter phone number"
              required
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value.replace(/\D/, "")); // allow only digits
                setPhoneError("");
              }}
            />
            {phoneError && <p className="text-error">{phoneError}</p>}
          </div>

          <div className="form-group checkbox-group">
            <input type="checkbox" id="terms" required disabled={isSubmitting} />
            <label htmlFor="terms">
              I agree to the <a href="#">Terms & Conditions</a> and{" "}
              <a href="#">Privacy Policy</a>.
            </label>
          </div>

          <button className="reg-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Create Account"}
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
