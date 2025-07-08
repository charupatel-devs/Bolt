// src/components/customer/products/CategorySidebar.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchCategories } from "../../../store/customer/productSlice";
import "../../../assets/css/customer/FilterSidebar.css";

const CategorySidebar = () => {
  const dispatch = useDispatch();
  const { categories = [], loading, error } = useSelector(s => s.product);
  const { categoryId } = useParams();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (loading) {
    return (
      <aside className="sidebar-container">
        <div className="sidebar-box">Loading...</div>
      </aside>
    );
  }
  if (error) {
    return (
      <aside className="sidebar-container">
        <div className="sidebar-box error">Error: {error}</div>
      </aside>
    );
  }

  return (
    <aside className="sidebar-container">
      <div className="sidebar-box">
        <div className="sidebar-header">
          <h3 className="sidebar-heading">CATEGORY</h3>
          <Link
            to="/products"
            className={`view-all-link ${!categoryId ? "active" : ""}`}
          >
            View All
          </Link>
        </div>
        <ul className="sidebar-list">
          {categories.map(cat => (
            <li key={cat._id}>
              <Link
                to={`/products/category/${cat._id}`}
                className={`sidebar-item ${cat._id === categoryId ? "active" : ""}`}
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default CategorySidebar;
