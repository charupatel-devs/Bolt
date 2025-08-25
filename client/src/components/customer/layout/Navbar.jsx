import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaSearch,
  FaUpload,
  FaChevronDown,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../services_hooks/customer/userAuthApi";
import { fetchCartItemsAction } from "../../../store/customer/cartAction";
import "../../../assets/css/customer/Navbar.css";

const Navbar = ({ onMenuClick }) => {
  const fileInputRef = useRef(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Correctly get userData and userToken from Redux state
  const { userData, userToken } = useSelector((state) => state.userAuth);
  const { cartItems = [] } = useSelector((state) => state.cart);
  
  // Calculate total items in cart - with safety check
  const totalItems = Array.isArray(cartItems) 
    ? cartItems.reduce((total, item) => total + (item.quantity || 1), 0)
    : 0;

  // Debug output
  console.log("Navbar userAuth debug:", { userData, userToken });

  useEffect(() => {
    if (userToken) {
      dispatch(fetchCartItemsAction());
    }
  }, [userToken, dispatch]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
        setMobileDropdownOpen(null);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file.name);
    }
  };

  const handleLogout = async () => {
    await logoutUser(dispatch);
    navigate("/customer/");
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleMobileDropdown = (menu) => {
    setMobileDropdownOpen(mobileDropdownOpen === menu ? null : menu);
  };

  const dropdownItems = {
    Products: [
      "Automation",
      "Cables",
      "Connectors",
      "Power",
      "Semiconductors",
    ],
    Manufacturers: [
      "Analog Devices",
      "Diodes Inc",
      "Littelfuse",
      "Omron",
      "ROHM Semiconductor",
    ],
    Resources: ["Blog", "Datasheets", "Training", "Support"],
    Quote: ["Request a Quote", "Bulk Orders", "Pricing Info"],
  };

  return (
    <>
      <nav className="custom-navbar">
        {/* Left: Logo */}
        <div className="navbar-left">
          <Link to="/customer/" className="navbar-logo">
            <span className="logo-text">BollentElectric</span>
          </Link>
        </div>

        {/* Center: Search - Hidden on mobile */}
        <div className="navbar-center">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Enter keyword or part #"
              className="search-input"
            />
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <button className="upload-btn" onClick={handleUploadClick}>
              <FaUpload /> Upload a List
            </button>
            <button className="search-btn">
              <FaSearch />
            </button>
          </div>
        </div>

        {/* Right: Auth & Cart */}
        <div className="navbar-right">
          {/* IF LOGGED IN: Show name and dropdown */}
          {userToken && userData ? (
            <div
              className="auth-dropdown-wrapper"
              onMouseEnter={() => setShowAuthDropdown(true)}
              onMouseLeave={() => setShowAuthDropdown(false)}
            >
              <div className="auth-trigger flex items-center gap-2">
                <FaUser size={14} />
                <span className="auth-name">{userData.name || userData.username || "User"}</span>
                <FaChevronDown size={12} />
              </div>
              {showAuthDropdown && (
                <div className="auth-dropdown">
                  <Link to="/customer/orders" className="dropdown-item">
                    Orders
                  </Link>
                  <Link to="/customer/cart" className="dropdown-item">
                    Cart
                  </Link>
                  <Link to="/lists" className="dropdown-item">
                    Lists
                  </Link>
                  <span className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </span>
                </div>
              )}
            </div>
          ) : (
            // IF NOT LOGGED IN: Guest view
            <div
              className="auth-dropdown-wrapper"
              onMouseEnter={() => setShowAuthDropdown(true)}
              onMouseLeave={() => setShowAuthDropdown(false)}
            >
              <div className="auth-trigger">
                <span className="auth-text">Login or REGISTER</span> <FaChevronDown size={12} />
              </div>
              {showAuthDropdown && (
                <div className="auth-dropdown">
                  <Link to="/login" className="dropdown-item">
                    Login
                  </Link>
                  <Link to="/register" className="dropdown-item">
                    Register
                  </Link>
                  <Link to="/quotes" className="dropdown-item">
                    Quotes
                  </Link>
                  <Link to="/customer/orders" className="dropdown-item">
                    Orders
                  </Link>
                  <Link to="/customer/cart" className="dropdown-item">
                    Cart
                  </Link>
                  <Link to="/lists" className="dropdown-item">
                    Lists
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Cart icon with live item count */}
          <Link 
            to="/customer/cart" 
            className="cart"
            onClick={() => console.log("🛒 Cart icon clicked, navigating to /customer/cart")}
          >
            <FaShoppingCart />
            <span className="cart-text">{totalItems} item(s)</span>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu-container ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          {/* Mobile Search */}
          <div className="mobile-search">
            <div className="mobile-search-bar">
              <input
                type="text"
                placeholder="Search products..."
                className="mobile-search-input"
              />
              <button className="mobile-search-btn">
                <FaSearch />
              </button>
            </div>
            <button className="mobile-upload-btn" onClick={handleUploadClick}>
              <FaUpload /> Upload List
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="mobile-nav">
            {["Products", "Manufacturers", "Resources", "Quote"].map((menu) => (
              <div key={menu} className="mobile-menu-item">
                <button 
                  className="mobile-menu-button"
                  onClick={() => toggleMobileDropdown(menu)}
                >
                  {menu}
                  <FaChevronDown className={`mobile-dropdown-icon ${mobileDropdownOpen === menu ? 'rotated' : ''}`} />
                </button>
                {mobileDropdownOpen === menu && (
                  <div className="mobile-dropdown">
                    {menu === "Products" ? (
                      <div className="mobile-mega-menu">
                        <div className="mobile-mega-section">
                          <h4>New Products</h4>
                          <ul>
                            <li>Electronic Components</li>
                            <li>Sensors Detectors</li>
                            <li>Power Management</li>
                            <li>Connectors & Cables</li>
                          </ul>
                        </div>
                        <div className="mobile-mega-section">
                          <h4>Popular Picks</h4>
                          <ul>
                            <li>Raspberry Pi Boards</li>
                            <li>STM32 Modules</li>
                            <li>Arduino Kits</li>
                            <li>ESP32 Boards</li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      dropdownItems[menu].map((item, idx) => (
                        <div key={idx} className="mobile-dropdown-item">
                          {item}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Auth */}
          <div className="mobile-auth">
            {userToken && userData ? (
              <div className="mobile-user-info">
                <div className="mobile-user-header">
                  <FaUser />
                  <span>{userData.name || userData.username || "User"}</span>
                </div>
                <div className="mobile-user-links">
                  <Link to="/customer/orders" onClick={() => setMobileMenuOpen(false)}>
                    Orders
                  </Link>
                  <Link to="/customer/cart" onClick={() => setMobileMenuOpen(false)}>
                    Cart
                  </Link>
                  <Link to="/lists" onClick={() => setMobileMenuOpen(false)}>
                    Lists
                  </Link>
                  <button onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="mobile-guest-links">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  Register
                </Link>
                <Link to="/quotes" onClick={() => setMobileMenuOpen(false)}>
                  Quotes
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dropdown Menus BELOW NAVBAR - Hidden on mobile */}
      <div className="navbar-dropdowns">
        {["Products", "Manufacturers", "Resources", "Quote"].map((menu) => (
          <div
            className="menu-wrapper"
            key={menu}
            onMouseEnter={() => setActiveDropdown(menu)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <div
              className={`menu-title ${
                menu === "Products" && activeDropdown === "Products"
                  ? "products-active"
                  : ""
              }`}
            >
              {menu} <FaChevronDown size={12} />
            </div>

            {activeDropdown === menu && (
              <div
                className={`dropdown-menu ${
                  menu === "Products" ? "mega-menu" : ""
                }`}
              >
                {menu === "Products" ? (
                  <div className="flex w-full">
                    <div className="w-1/2 pr-6 border-r border-gray-300">
                      <div className="bg-red-600 text-white font-semibold px-4 py-2 mb-2 text-sm">
                        New Products
                      </div>
                      <ul className="text-sm text-gray-700 pl-4 space-y-1">
                        <li className="hover:underline cursor-pointer">
                          Electronic Components
                        </li>
                        <li className="hover:underline cursor-pointer">
                          Sensors Detectors
                        </li>
                        <li className="hover:underline cursor-pointer">
                          Power Management
                        </li>
                        <li className="hover:underline cursor-pointer">
                          Connectors & Cables
                        </li>
                      </ul>
                    </div>
                    <div className="w-1/2 pl-6">
                      <div className="text-sm font-semibold mb-2 text-gray-500">
                        Popular Picks
                      </div>
                      <ul className="space-y-1 text-gray-700 text-sm">
                        <li className="hover:underline cursor-pointer">
                          Raspberry Pi Boards
                        </li>
                        <li className="hover:underline cursor-pointer">
                          STM32 Modules
                        </li>
                        <li className="hover:underline cursor-pointer">
                          Arduino Kits
                        </li>
                        <li className="hover:underline cursor-pointer">
                          ESP32 Boards
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  dropdownItems[menu].map((item, idx) => (
                    <div key={idx} className="dropdown-item">
                      {item}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Navbar;
