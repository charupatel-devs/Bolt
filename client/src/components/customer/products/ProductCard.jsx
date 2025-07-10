import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../../assets/css/customer/ProductCard.css";
import Layout from "../layout/Layout";

const ProductCard = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/products/${productId}`);
        const data = await res.json();

        if (data.success) {
          setProduct(data.product);
        } else {
          setError("Failed to load product data.");
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (loading) return <div className="loading">Loading product...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return null;

  return (
    <Layout>
      <div className="product-card-container">
        {/* Product Display Card */}
        <div className="product-card-v2">
          <div className="left-panel">
            <img
              src="/images/default-product.jpg"
              alt={product.name}
              className="main-product-img"
            />
            <p className="product-id-text">Product ID: {product._id}</p>
            <p className="stock-status">
              <strong>In-Stock:</strong> {product.stock}
            </p>
            <p className="price-tag">Price: ₹{product.price?.toFixed(2)}</p>
            <button className="btn-add-cart">Add to Cart</button>
          </div>

          <div className="right-panel">
            <h1 className="product-title">{product.name}</h1>

            <div className="product-meta">
              <p><strong>SKU:</strong> {product.sku}</p>
              <p><strong>Category:</strong> {product.category?.name || "N/A"}</p>
              <p><strong>Unit:</strong> {product.unit}</p>
              <p><strong>Description:</strong> {product.description || "No description available"}</p>
            </div>

            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <>
                <h3 className="spec-heading">Technical Specifications</h3>
                <div className="spec-grid">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div className="spec-row" key={key}>
                      <span className="spec-label">{key}:</span>
                      <span className="spec-value">{value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* DigiKey-style Attributes Table */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="attribute-table-container">
            <h2 className="attribute-heading">Product Attributes</h2>
            <table className="attribute-table">
              <thead>
                <tr>
                  <th>TYPE</th>
                  <th>DESCRIPTION</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductCard;
