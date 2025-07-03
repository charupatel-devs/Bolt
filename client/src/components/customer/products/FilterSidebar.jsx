import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, setFilter } from "../../../store/customer/productSlice";
import "../../../assets/css/customer/FilterSidebar.css";

const FilterSidebar = () => {
  const dispatch = useDispatch();
  const { categories, filters, loading, error } = useSelector(state => state.product);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (loading) return <div className="sidebar">Loading categories...</div>;
  if (error) return <div className="sidebar error">Error loading categories: {error}</div>;

  return (
    <aside className="sidebar">
      <h3>Categories</h3>
      <ul className="category-list">
        <li
          className={filters.category ? "" : "selected"}
          onClick={() => dispatch(setFilter({ category: null, page: 1 }))}
        >
          All Categories
        </li>
        {categories.map(cat => (
          <li
            key={cat._id}
            className={filters.category === cat._id ? "selected" : ""}
            onClick={() => dispatch(setFilter({ category: cat._id, page: 1 }))}
          >
            {cat.name} ({cat.productCount || 0})
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default FilterSidebar;
