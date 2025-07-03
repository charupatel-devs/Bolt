import React from "react";
import "../../../assets/css/customer/ProductCard.css";

const ProductCard = ({ product }) => (
  <div className="product-card">
    <img src={product.images?.[0] || ""} alt={product.name} />
    <h4>{product.name}</h4>
    <p>{product.brand}</p>
    <p>₹{product.price?.toFixed(2)}</p>
  </div>
);

export default ProductCard;
