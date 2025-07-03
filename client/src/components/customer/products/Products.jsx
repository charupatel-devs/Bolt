import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, setFilter } from "../../../store/customer/productSlice";
import ProductCard from "./ProductCard";
import "../../../assets/css/customer/FilterSidebar.css";

const Products = ({ initialCategory }) => {
  const dispatch = useDispatch();
  const { items, loading, error, filters } = useSelector(s => s.product);

  useEffect(() => {
    if (initialCategory) {
      dispatch(setFilter({ category: initialCategory, page: 1 }));
    }
  }, [dispatch, initialCategory]);

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="product-grid">
      {items.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default Products;
