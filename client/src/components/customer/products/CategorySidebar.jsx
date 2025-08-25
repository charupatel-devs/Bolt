// src/components/customer/products/CategorySidebar.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchCategories } from "../../../store/customer/productSlice";
import "../../../assets/css/customer/FilterSidebar.css";

const CategorySidebar = ({ className = "" }) => {
  const dispatch = useDispatch();
  const { categories = [], loading, error } = useSelector(s => s.product);
  const { categoryId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <aside className={`sidebar-container ${className}`}>
        <div className="sidebar-box">
          <div className="sidebar-loading">
         <div className="skeleton-line"></div>
      <div className="skeleton-line short"></div>
      <div className="skeleton-line"></div>
            <p>Loading categories...</p>
          </div>
        </div>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className={`sidebar-container ${className}`}>
        <div className="sidebar-box">
          <div className="sidebar-error">
            <svg className="error-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <p>Error loading categories</p>
            <button onClick={() => dispatch(fetchCategories())} className="retry-btn">
              Retry
            </button>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className={`sidebar-container ${className}`}>
      <div className="sidebar-box">
        {/* Enhanced Header */}
        <div className="sidebar-header">
          <div className="header-content">
            <h3 className="sidebar-heading">Categories</h3>
          </div>
          <Link
            to="/products"
            className={`view-all-link ${!categoryId ? "active" : ""}`}
          >
            View All
          </Link>
        </div>

        {/* Search Bar */}
        <div className="sidebar-search">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Categories List */}
        <ul className="sidebar-list">
          {filteredCategories.map(cat => (
            <li key={cat._id} className="category-item-wrapper">
              <div className="category-item-header">
                <Link
                  to={`/products/category/${cat._id}`}
                  className={`sidebar-item ${cat._id === categoryId ? "active" : ""}`}
                >
                  <span className="category-name">{cat.name}</span>
                </Link>
                {cat.subcategories && cat.subcategories.length > 0 && (
                  <button
                    className={`expand-btn ${expandedCategories.has(cat._id) ? 'expanded' : ''}`}
                    onClick={() => toggleCategory(cat._id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {expandedCategories.has(cat._id) ? (
                        <path d="M18 15l-6-6-6 6"/>
                      ) : (
                        <path d="M6 9l6 6 6-6"/>
                      )}
                    </svg>
                  </button>
                )}
              </div>
              
              {/* Subcategories */}
              {cat.subcategories && cat.subcategories.length > 0 && expandedCategories.has(cat._id) && (
                <ul className="subcategory-list">
                  {cat.subcategories.map(subCat => (
                    <li key={subCat._id}>
                      <Link
                        to={`/products/category/${subCat._id}`}
                        className={`subcategory-item ${subCat._id === categoryId ? "active" : ""}`}
                      >
                        <span className="subcategory-icon">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="2"/>
                          </svg>
                        </span>
                        {subCat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* Quick Actions */}
        <div className="sidebar-actions">
          <h4 className="actions-title">Quick Actions</h4>
          <div className="action-buttons">
            <Link to="/products" className="action-btn">
              <svg className="action-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11H1m8 0v8m0-8l8-8"/>
              </svg>
              Browse All
            </Link>
            <Link to="/products/featured" className="action-btn">
              <svg className="action-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Featured
            </Link>
            <Link to="/products/new" className="action-btn">
              <svg className="action-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              New Arrivals
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default CategorySidebar;
