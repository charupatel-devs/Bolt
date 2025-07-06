// src/components/Layout/Layout.jsx
import React from "react";
// import Header from "../layout/Header";
import Navbar from "../layout/Navbar"; 
import Footer from "../layout/Footer";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Header /> */}

      <Navbar />

      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
