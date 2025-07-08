// src/components/Layout/Layout.jsx
import React from "react";
import { useState } from "react";
// import Header from "../layout/Header";
import Navbar from "../layout/Navbar"; 
import Footer from "../layout/Footer";
import CustomerSidebar from "../../customer/products/CategorySidebar";


const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex w-full min-h-screen">
      {/* Remove this line below: */}
      {/* <CustomerSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} /> */}

      {/* Main content */}
      <div className={`flex-1 flex flex-col transition-all duration-300`}>
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};


export default Layout;


