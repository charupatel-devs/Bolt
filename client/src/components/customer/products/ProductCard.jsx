import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../layout/Layout";
import "../../../assets/css/customer/ProductCard.css";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../services_hooks/customer/cartService";
import { getProductById } from "../../../services_hooks/customer/productService";

const ProductCard = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(productId);
        if (data && data._id) {
          setProduct(data);
        } else {
          setError("Product not found.");
        }
      } catch (err) {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product || !product._id) return;
    dispatch(addToCart(product._id, 1));
  };

  if (loading) return <div className="loading-product">Loading...</div>;
  if (error) return <div className="error-product">{error}</div>;

  return (
    <Layout>
      <div className="product-wrapper">
        <div className="product-card">
          <div className="product-left">
            <img
              src="/images/default-product.jpg"
              alt={product.name}
              className="product-img"
            />
            <p className="img-note">
              Image shown is a representation only. Exact specifications should
              be obtained from the product data sheet.
            </p>
          </div>

          <div className="product-right">
            <h1 className="product-name">{product.name}</h1>

            <div className="product-info-grid">
              <div><strong>DigiKey Part Number:</strong></div>
              <div>{product.sku}</div>

              <div><strong>Manufacturer:</strong></div>
              <div style={{ color: "#0066cc", fontWeight: "500" }}>{product.brand || "N/A"}</div>

              <div><strong>Manufacturer Product Number:</strong></div>
              <div>{product.sku}</div>

              <div><strong>Description:</strong></div>
              <div>{product.description || "N/A"}</div>

              <div><strong>Category:</strong></div>
              <div>{product.category?.name || "N/A"}</div>

              <div><strong>Unit:</strong></div>
              <div>{product.unit}</div>
            </div>
          </div>

          <div className="product-stock-panel">
            <p className="stock-count">In-Stock: {product.stock}</p>
            <p className="free-shipping"><b>FREE SHIPPING </b>for this product</p>

            <div className="quantity-box">
              <label>Quantity</label>
              <input type="number" min="1" defaultValue={1} />
            </div>

            <button className="add-to-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>

        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="product-attributes">
            <h2>Product Attributes</h2>
            <table className="attribute-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Description</th>
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
