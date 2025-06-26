// src/components/customer/products/ProductCard.jsx
import React from "react";
import "../../../assets/css/customer/ProductCard.css";

export default function ProductCard({ product, onView }) {
  return (
    <div className="product-card">
      <img src={product.imageUrl} alt={product.name} />
      <h2>{product.name}</h2>
      <p>₹{product.price}</p>
      <button onClick={() => onView(product.slug)}>View Details</button>
    </div>
  );
}
