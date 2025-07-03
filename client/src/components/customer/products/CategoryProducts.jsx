// client/src/pages/customer/CategoryProducts.jsx
import React from "react";
import { useParams } from "react-router-dom";
import CategorySidebar from "../products/CategorySidebar";
import Products from "../products/Products";

const CategoryProducts = () => {
  const { categoryId } = useParams();
  return (
    <div style={{ display: "flex", gap: "1rem", padding: '1rem' }}>
      <CategorySidebar selectedCategory={categoryId} />
      <Products initialCategory={categoryId} />
    </div>
  );
};

export default CategoryProducts;
