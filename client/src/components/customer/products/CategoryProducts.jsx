import React from "react";
import { useParams } from "react-router-dom";
import CategorySidebar from "../products/CategorySidebar";
import Products from "../products/Products";
import Layout from "../layout/Layout"
const CategoryProducts = () => {
  const { categoryId } = useParams();
return (
  <Layout>
    <div className="w-full min-h-screen flex">
      <div className="w-1/4">
        <CategorySidebar />
      </div>
      <div className="w-3/4">
        <Products categoryId={categoryId} />
      </div>
    </div>
  </Layout>
);

};

export default CategoryProducts;
