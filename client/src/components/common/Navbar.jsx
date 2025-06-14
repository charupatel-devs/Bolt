// src/components/common/Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaSearch, FaUpload, FaTimes } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <nav className="custom-navbar">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <span className="logo-text">DigiKey</span>
          </Link>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Enter keyword or part #"
              className="search-input"
            />
            <button className="upload-btn">
              <FaUpload /> Upload a List
            </button>
            <button className="search-btn">
              <FaSearch />
            </button>
          </div>
        </div>

        <div className="navbar-right">
          <div className="flag-icon" onClick={() => setShowSettings(true)}>
            <img src="/icons/india-flag.png" alt="India" />
          </div>
          <div className="auth-links">
            <Link to="/login">Login</Link> or <Link to="/signup">REGISTER</Link>
          </div>
          <div className="cart">
            <FaShoppingCart />
            <span>0 item(s)</span>
          </div>
        </div>
      </nav>

      {showSettings && (
        <div className="settings-modal">
          <div className="settings-content">
            <button className="close-btn" onClick={() => setShowSettings(false)}>
              <FaTimes />
            </button>
            <h2>Settings</h2>
            <div className="settings-layout">
              <div className="regions-section">
                <h3>Select Your Country/Region</h3>
                <div className="regions-grid">
                  <div><strong>Africa</strong><p>South Africa</p></div>
                  <div><strong>Asia</strong>
                    <p>China<br/>India<br/>Japan<br/>Malaysia<br/>Philippines<br/>Singapore<br/>South Korea<br/>Taiwan<br/>Thailand</p>
                  </div>
                  <div><strong>Europe</strong>
                    <p>Austria<br/>Belgium<br/>France<br/>Germany<br/>Italy<br/>Spain<br/>UK<br/>...etc</p>
                  </div>
                  <div><strong>Middle East</strong><p>Israel</p></div>
                  <div><strong>North America</strong><p>US<br/>Canada<br/>Mexico</p></div>
                  <div><strong>Australia</strong><p>Australia<br/>New Zealand</p></div>
                </div>
              </div>
              <div className="options-section">
                <h3>Other Options</h3>
                <p><strong>Language</strong></p>
                <button className="selected-option">English</button>

                <p><strong>Currency</strong></p>
                <div className="currency-options">
                  <button className="selected-option">INR</button>
                  <button>USD</button>
                </div>
              </div>
            </div>

            <div className="india-summary">
              <h3>India/INR Summary</h3>
              <ul>
                <li><strong>Fast Delivery</strong>: 4 days typically</li>
                <li><strong>Free Shipping</strong>: Orders over ₹7,000</li>
                <li><strong>Payment Types</strong>: VISA, MasterCard, Wire Transfer</li>
                <li><strong>Marketplace Product</strong>: Fully Authorized Partners</li>
                <li><strong>Incoterms</strong>: CPT - Duty/Customs at delivery</li>
              </ul>
              <p>For more info visit <a href="#">Help & Support</a></p>
            </div>

            <div className="modal-actions">
              <button className="update-btn">Update</button>
              <button onClick={() => setShowSettings(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar; 