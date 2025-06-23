import React from 'react';
import Footer from "../../components/customer/layout/Footer.jsx";
import Navbar from "../../components/customer/layout/Navbar.jsx";
import Sidebar from "../../components/customer/layout/Sidebar.jsx";

const Home = () => {
  return (
    <>
      <Navbar />

      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center h-[400px] bg-gray-100">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to BollentElectric</h1>
            <p className="text-lg text-gray-600">Explore thousands of electronic components with ease.</p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;
