import React, { useState, useEffect } from "react";
import "../../../assets/css/customer/Login.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../services_hooks/customer/userAuthApi"; 

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isProcessingLogin, setIsProcessingLogin] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, userToken } = useSelector((state) => state.userAuth);

  // Debug: Log current auth state
  useEffect(() => {
    console.log("🔍 Current auth state:", { 
      userToken: userToken ? "Present" : "Missing", 
      loading, 
      error,
      isProcessingLogin 
    });
  }, [userToken, loading, error, isProcessingLogin]);

  // Redirect if already authenticated
  useEffect(() => {
    console.log("🔍 Login useEffect - userToken:", userToken, "location:", location.pathname, "isProcessingLogin:", isProcessingLogin);
    if (userToken && !isProcessingLogin) {
      const from = location.state?.from?.pathname || "/";
      console.log("🚀 Redirecting authenticated user to:", from);
      
      // Add a small delay to ensure Redux state is properly updated
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 100);
    }
  }, [userToken, navigate, location, isProcessingLogin]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (isProcessingLogin) {
      console.log("🔄 Login already in progress, ignoring duplicate request");
      return;
    }
    
    console.log("🔐 Starting login process with credentials:", { email, password });
    setIsProcessingLogin(true);
    
    // Clear any existing errors when starting a new login attempt
    if (error) {
      dispatch({ type: 'userAuth/ClearUserError' });
    }

    try {
      const response = await loginUser(dispatch, { email, password }); 
      console.log("✅ Login Successful:", response);
      
      // Don't navigate here - let the useEffect handle navigation
      // This prevents double navigation attempts
      
    } catch (err) {
      console.error("❌ Login Failed:", err.message);
    } finally {
      setIsProcessingLogin(false);
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

          <button className="login-btn" type="submit" disabled={loading || isProcessingLogin}>
            {loading || isProcessingLogin ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && (
          <p className="login-error-msg">
            {typeof error === "string" ? error : "Login failed. Try again."}
          </p>
        )}

        <div className="login-links">
          <Link to="/forgot-password" className="forgot-password-link">
            Forgot Password
          </Link>
        </div>

        <hr />

        <div className="register-link">
          Don't have an account?{" "}
          <Link to="/register" className="register-now-link">
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
