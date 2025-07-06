import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProducts, setFilter } from "../../../store/customer/productSlice";
import "../../../assets/css/customer/Products.css";

const Products = () => {
  const dispatch = useDispatch();
  const { items, loading, error, filters } = useSelector((state) => state.product);
  const { categoryId } = useParams();
  const [layout, setLayout] = useState("grid");

  // Fetch products on category change
  useEffect(() => {
    if (categoryId) {
      dispatch(setFilter({ category: categoryId }));
      dispatch(fetchProducts({ ...filters, category: categoryId }));
    }
  }, [dispatch, categoryId]);

  return (
    <div className="products-container">
      <div className="view-toggle">
        <button
          onClick={() => setLayout("grid")}
          className={layout === "grid" ? "active" : ""}
        >
          Grid View
        </button>
        <button
          onClick={() => setLayout("table")}
          className={layout === "table" ? "active" : ""}
        >
          Table View
        </button>
      </div>

      {loading && <p className="loading">Loading products...</p>}
      {error && <p className="error">Error: {error}</p>}

      {!loading && items.length === 0 && (
        <p className="no-products">No products found in this category.</p>
      )}

      {!loading && items.length > 0 && (
        <>
          {layout === "grid" ? (
            <div className="product-grid">
              {items.map((product) => (
                <div key={product._id} className="product-card">
                  <div className="product-image">
                    <img src={product?.primaryImage || "/placeholder.jpg"} alt={product.name} />
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="description">{product.description}</p>
                    <p className="price">₹{product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <table className="product-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {items.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>₹{product.price}</td>
                    <td>{product.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
