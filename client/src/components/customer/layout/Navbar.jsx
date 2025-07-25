import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaSearch, FaUpload, FaChevronDown, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../services_hooks/customer/userAuthApi";
import { fetchCartItemsAction } from "../../../store/customer/cartAction"; 
import "../../../assets/css/customer/Navbar.css";

const Navbar = () => {
  const fileInputRef = useRef(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.userAuth); 
  const { totalItems } = useSelector((state) => state.cart); 

  useEffect(() => {
    if (token) {
      dispatch(fetchCartItemsAction()); 
    }
  }, [token, dispatch]);

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
  };

  const dropdownItems = {
    Products: ["Automation", "Cables", "Connectors", "Power", "Semiconductors"],
    Manufacturers: ["Analog Devices", "Diodes Inc", "Littelfuse", "Omron", "ROHM Semiconductor"],
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

        {/* Center: Search */}
        <div className="navbar-center">
          <div className="search-bar">
            <input type="text" placeholder="Enter keyword or part #" className="search-input" />
            <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />
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
          {/* 🔥 Show user if logged in */}
          {user ? (
            <div
              className="auth-dropdown-wrapper"
              onMouseEnter={() => setShowAuthDropdown(true)}
              onMouseLeave={() => setShowAuthDropdown(false)}
            >
              <div className="auth-trigger flex items-center gap-2">
                <FaUser size={14} />
                <span>{user.name}</span>
                <FaChevronDown size={12} />
              </div>
              {showAuthDropdown && (
                <div className="auth-dropdown">
                  <Link to="/customer/orders" className="dropdown-item">
                    Orders
                  </Link>
                  <Link to="/carts" className="dropdown-item">
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
            // 🔥 Guest view
            <div
              className="auth-dropdown-wrapper"
              onMouseEnter={() => setShowAuthDropdown(true)}
              onMouseLeave={() => setShowAuthDropdown(false)}
            >
              <div className="auth-trigger">
                Login or REGISTER <FaChevronDown size={12} />
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
                  <Link to="/carts" className="dropdown-item">
                    Cart
                  </Link>
                  <Link to="/lists" className="dropdown-item">
                    Lists
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Cart icon with item count */}
          <div className="cart">
            <FaShoppingCart />
            <span>{totalItems} item(s)</span> {/* ✅ Live cart count */}
          </div>
        </div>
      </nav>

      {/* Dropdown Menus BELOW NAVBAR */}
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
                menu === "Products" && activeDropdown === "Products" ? "products-active" : ""
              }`}
            >
              {menu} <FaChevronDown size={12} />
            </div>

            {activeDropdown === menu && (
              <div className={`dropdown-menu ${menu === "Products" ? "mega-menu" : ""}`}>
                {menu === "Products" ? (
                  <div className="flex w-full">
                    <div className="w-1/2 pr-6 border-r border-gray-300">
                      <div className="bg-red-600 text-white font-semibold px-4 py-2 mb-2 text-sm">New Products</div>
                      <ul className="text-sm text-gray-700 pl-4 space-y-1">
                        <li className="hover:underline cursor-pointer">Electronic Components</li>
                        <li className="hover:underline cursor-pointer">Sensors Detectors</li>
                        <li className="hover:underline cursor-pointer">Power Management</li>
                        <li className="hover:underline cursor-pointer">Connectors & Cables</li>
                      </ul>
                    </div>
                    <div className="w-1/2 pl-6">
                      <div className="text-sm font-semibold mb-2 text-gray-500">Popular Picks</div>
                      <ul className="space-y-1 text-gray-700 text-sm">
                        <li className="hover:underline cursor-pointer">Raspberry Pi Boards</li>
                        <li className="hover:underline cursor-pointer">STM32 Modules</li>
                        <li className="hover:underline cursor-pointer">Arduino Kits</li>
                        <li className="hover:underline cursor-pointer">ESP32 Boards</li>
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
