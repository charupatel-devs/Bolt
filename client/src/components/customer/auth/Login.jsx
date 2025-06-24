import React, { useState } from "react";
import "../../../assets/css/customer/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../../../services_hooks/customer/userAuthApi"; // ✅ fixed path

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
      const res = await userLogin(dispatch, { email, password });
      console.log("Login Successful:", res);
      navigate("/customer/dashboard");
    } catch (err) {
      console.log(" Login Failed:", err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo-wrapper">
          <Link to="/customer/home" style={{ textDecoration: "none" }}>
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

          <div className="form-group" style={{ position: "relative" }}>
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
          <p style={{ color: "red", textAlign: "center", marginTop: "1rem" }}>
            {error}
          </p>
        )}

        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <Link
            to="/customer/forgot-password"
            style={{ color: "blue", fontSize: "0.9rem" }}
          >
            Forgot Password
          </Link>
        </div>

        <hr />

        <div className="register-link">
          Don’t have an account?{" "}
          <Link
            to="/customer/register"
            style={{ color: "red", fontWeight: "bold" }}
          >
            Register Now
          </Link>
        </div>
      </div>

      <p className="login-footer">
        Copyright © 1995–2025, BollentElectric.
        <br />
        <a href="#">Terms & Conditions</a> |{" "}
        <a href="#">Privacy Statement</a>
      </p>
    </div>
  );
};

export default Login;
