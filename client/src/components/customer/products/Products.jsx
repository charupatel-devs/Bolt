import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../../assets/css/customer/Products.css";

const Products = () => {
  const { categoryId } = useParams();
  const [allProducts, setAllProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 4 });
  const [totalPages, setTotalPages] = useState(1);
  const [sortOption, setSortOption] = useState("name");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:5001/api/products/category/${categoryId}`
        );
        const data = await res.json();

        if (data.success) {
          setAllProducts(data.products);
          setTotalPages(Math.ceil(data.products.length / pagination.limit));
        } else {
          setError("Failed to fetch products.");
        }
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  useEffect(() => {
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;

    let sorted = [...allProducts];

    if (sortOption === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "price") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === "stock") {
      sorted.sort((a, b) => b.stock - a.stock); // DESCENDING
    }

    setVisibleProducts(sorted.slice(start, end));
  }, [allProducts, pagination.page, pagination.limit, sortOption]);

  const goToNextPage = () => {
    if (pagination.page < totalPages) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const goToPrevPage = () => {
    if (pagination.page > 1) {
      setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const handleDownload = () => {
    const headers = ["Name", "SKU", "Speed", "Unit", "Price (₹)", "Stock"];
    const rows = visibleProducts.map((p) => [
      p.name,
      p.sku,
      p.specifications?.speed || "N/A",
      p.unit,
      p.price.toFixed(2),
      p.stock,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "bollent-products.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full min-h-screen flex">
      <div className="flex-grow">
        <div className="products-container-v2">
          <div className="table-controls">
            <div className="left-controls">
              <span className="pagination-summary">
                Page <strong>{pagination.page}</strong> of{" "}
                <strong>{totalPages}</strong>
              </span>
              <div className="dropdown-divider"></div>
              <div className="sort-by">
                <label htmlFor="sort">
                  <b>Sort By:</b>
                </label>
                <select
                  id="sort"
                  className="sort-dropdown"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="stock">Stock</option>
                </select>
              </div>
            </div>
            <div className="right-controls">
              <button className="download-button" onClick={handleDownload}>
                Download Table
              </button>
            </div>
          </div>

          {loading && <p>Loading products...</p>}
          {error && <p className="error">Error: {error}</p>}
          {!loading && visibleProducts.length === 0 && <p>No products found.</p>}

          {!loading && visibleProducts.length > 0 && (
            <>
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
                    {visibleProducts.map((p) => (
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

              <div className="pagination-controls">
                <button
                  disabled={pagination.page === 1}
                  onClick={goToPrevPage}
                  className="pagination-button"
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {pagination.page} of {totalPages}
                </span>
                <button
                  disabled={pagination.page === totalPages}
                  onClick={goToNextPage}
                  className="pagination-button"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
