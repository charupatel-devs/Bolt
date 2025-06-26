// src/components/customer/products/ProductDetails.jsx
import React from "react";
import "../../../assets/css/customer/ProductDetails.css";


export default function ProductDetails({ product, onClose }) {
  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{product.name}</h2>
        <img src={product.imageUrl} alt={product.name} />
        <p>{product.description}</p>
        <p>Price: ₹{product.price}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
