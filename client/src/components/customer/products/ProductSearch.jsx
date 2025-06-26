// src/components/customer/products/ProductSearch.jsx
import React from "react";
import "../../../assets/css/customer/ProductSearch.css";

export default function ProductSearch({ search, setSearch }) {
  return (
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search products..."
      className="product-search"
    />
  );
}
