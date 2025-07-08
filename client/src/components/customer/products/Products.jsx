import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../../assets/css/customer/Products.css";

const Products = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 5 });

  // ✅ Dummy product data
  const dummyData = [
    { _id: "1", name: "Sample Product 8", description: "", price: 40.3, stock: 157, sku: "SKU-008", category: { name: "Axail" }, unit: "piece", specifications: { speed: "338 Mbps" } },
    { _id: "2", name: "Sample Product 9", description: "", price: 33.51, stock: 322, sku: "SKU-009", category: { name: "Axail" }, unit: "piece", specifications: { speed: "647 Mbps" } },
    { _id: "3", name: "Sample Product 10", description: "", price: 13.61, stock: 391, sku: "SKU-010", category: { name: "Axail" }, unit: "piece", specifications: { speed: "880 Mbps" } },
    { _id: "4", name: "Sample Product 11", description: "", price: 44.62, stock: 397, sku: "SKU-011", category: { name: "Axail" }, unit: "piece", specifications: { speed: "820 Mbps" } },
    { _id: "5", name: "Sample Product", description: "", price: 10.99, stock: 100, sku: "SKU-001", category: { name: "Axail" }, unit: "piece", specifications: { speed: "sample_value" } },
    { _id: "6", name: "Sample Product 2", description: "", price: 16.89, stock: 440, sku: "SKU-002", category: { name: "Axail" }, unit: "piece", specifications: { speed: "630 Mbps" } },
    { _id: "7", name: "charupatel", description: "acs", price: 121, stock: 0, sku: "CCA12", category: { name: "Axail" }, unit: "piece", specifications: {} },
    { _id: "8", name: "charupatel-devs", description: "acs", price: 121, stock: 0, sku: "CCA", category: { name: "Axail" }, unit: "piece", specifications: {} },
    { _id: "9", name: "charupatel-devs", description: "charu", price: 12, stock: 11, sku: "CHARU", category: { name: "Axail" }, unit: "piece", specifications: {} },
  ];

  // ✅ Fetch API and combine with dummy data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:5001/api/products/category/${categoryId}?page=${pagination.page}&limit=${pagination.limit}`
        );
        const data = await res.json();

        if (data.success) {
          setProducts([...data.products, ...dummyData]); // ✅ Combine API + dummy
        } else {
          setError("Failed to fetch products.");
          setProducts(dummyData); // fallback to dummy only
        }
      } catch (err) {
        setError("Error fetching data");
        setProducts(dummyData); // fallback to dummy only
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, pagination.page, pagination.limit]);

  return (
    <div className="w-full min-h-screen flex">
      <div className="flex-grow">
        <div className="products-container-v2">
          <div className="table-controls">
            <div className="left-controls">
              <span className="pagination-summary">
                Showing <strong>1 - {products.length}</strong> of {products.length}
              </span>
              <div className="dropdown-divider"></div>
              <div className="sort-by">
                <label htmlFor="sort"><b>Sort By:</b></label>
                <select id="sort" className="sort-dropdown">
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="stock">Stock</option>
                </select>
              </div>
            </div>
            <div className="right-controls">
              <button className="download-button">Download Table</button>
            </div>
          </div>

          {loading && <p>Loading products...</p>}
          {error && <p className="error">Error: {error}</p>}
          {!loading && products.length === 0 && <p>No products found.</p>}

          {!loading && products.length > 0 && (
            <div className="table-container-v2">
              <table className="product-table-v2">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>SKU</th>
                    <th>Speed</th>
                    <th>Unit</th>
                    <th>Price (₹)</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <div className="product-name-cell">
                        <img
                           src="/images/default-product.jpg" 
                           alt={p.name}
                           className="product-thumbnail"
                        />

                          <div>{p.name}</div>
                        </div>
                      </td>
                      <td>{p.sku}</td>
                      <td>{p.specifications?.speed || "N/A"}</td>
                      <td>{p.unit}</td>
                      <td>{p.price.toFixed(2)}</td>
                      <td>{p.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;

