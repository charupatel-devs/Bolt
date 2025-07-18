import React from "react";
import Layout from "../../components/customer/layout/Layout.jsx";
import CategorySidebar from "../../components/customer/products/CategorySidebar.jsx";

const Home = () => {
  return (
    <Layout>
      <div className="flex">
        <CategorySidebar />
        <div className="flex-1 flex items-center justify-center h-[400px] bg-gray-100">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to BollentElectric</h1>
            <p className="text-lg text-gray-600">
              Explore thousands of electronic components with ease.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
