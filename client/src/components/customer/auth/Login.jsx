import React, { useState } from "react";
import "../../../assets/css/customer/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../services_hooks/customer/userAuthApi"; // ✅ Corrected import

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.userAuth);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(" Sending credentials:", { email, password });

    try {
      const response = await loginUser(dispatch, { email, password }); // ✅ Corrected call
      console.log("Login Successful:", response);
      navigate("dashboard");
    } catch (err) {
      console.error(" Login Failed:", err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo-wrapper">
          <Link to="/customer/" className="login-logo-link">
            <h1 className="login-logo">BollentElectric</h1>
          </Link>
        </div>

        <h2 className="login-title">Login</h2>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email / Username</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group password-group">
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="eye-icon"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && (
          <p className="login-error-msg">
            {typeof error === "string" ? error : "Login failed. Try again."}
          </p>
        )}

        <div className="login-links">
          <Link to="/customer/forgot-password" className="forgot-password-link">
            Forgot Password
          </Link>
        </div>

        <hr />

        <div className="register-link">
          Don’t have an account?{" "}
          <Link to="/customer/register" className="register-now-link">
            Register Now
          </Link>
        </div>
      </div>

      <footer className="login-footer">
        Copyright © 1995–2025, BollentElectric.
        <br />
        <a href="#">Terms & Conditions</a> |{" "}
        <a href="#">Privacy Statement</a>
      </footer>
    </div>
  );
};

export default Login;
