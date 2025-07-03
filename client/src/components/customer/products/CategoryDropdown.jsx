// client/src/components/customer/products/CategoryDropdown.jsx
import React, { useState, useEffect } from "react";
import { getCategories } from "../../../services_hooks/customer/productService";

const CategoryDropdown = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories()
      .then(res => setCategories(res.data))
      .catch(err => console.error("Failed to fetch categories", err));
  }, []);

  if (!Array.isArray(categories)) return null;

  return (
    <aside className="sidebar">
      <ul>
        {categories.map(cat => (
          <li key={cat._id || cat.id}>{cat.name}</li>
        ))}
      </ul>
    </aside>
  );
};

export default CategoryDropdown;
