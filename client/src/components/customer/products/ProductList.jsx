// client/src/components/customer/products/ProductList.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCustomerProducts,
  getSingleCustomerProduct,
} from "../../../services_hooks/customer/productService"; 
import { clearSelectedProduct } from "../../../store/customer/customerProductSlice"; // ✅ Correct import

import ProductCard from "../../../components/customer/products/ProductCard";
import ProductDetails from "../../../components/customer/products/ProductDetails";
import ProductSearch from "../../../components/customer/products/ProductSearch";
import "../../../assets/css/customer/ProductList.css";

export default function ProductList() {
  const dispatch = useDispatch();
  const { products, selectedProduct, loading, error, errMsg } = useSelector(
    (state) => state.customerProducts
  );

  const [search, setSearch] = useState("");

  // Load products (and clear detail) whenever search changes
  useEffect(() => {
    dispatch(clearSelectedProduct());
    getCustomerProducts(dispatch, { search });
  }, [dispatch, search]);

  const viewDetails = (slug) => {
    getSingleCustomerProduct(dispatch, slug);
  };

  return (
    <div className="product-page">
      <h1>Products</h1>

      <ProductSearch search={search} setSearch={setSearch} />

      {loading && <p className="loading">Loading products…</p>}

      {error && <p className="error">Error: {errMsg}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="empty">No products found.</p>
      )}

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onView={viewDetails}
          />
        ))}
      </div>

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => dispatch(clearSelectedProduct())}
        />
      )}
    </div>
  );
}
