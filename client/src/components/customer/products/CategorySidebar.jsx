import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import "../../../assets/css/customer/FilterSidebar.css";
import { fetchCategories } from "../../../store/customer/productSlice";

const CategorySidebar = ({ selectedCategory }) => {
  const dispatch = useDispatch();
  const { categories = [], loading, error } = useSelector((s) => s.product);
  const { categoryId } = useParams();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (loading) return <aside className="sidebar-container">Loading...</aside>;
  if (error)
    return <aside className="sidebar-container error">Error: {error}</aside>;

  const current = selectedCategory || categoryId;

  return (
    <aside className="sidebar-container">
      <div className="sidebar-box">
        <div className="sidebar-header">
          <h3 className="sidebar-heading">Category</h3>
          <Link to="/products" className="view-all-link">
            View All
          </Link>
        </div>
        <ul className="sidebar-list">
          {categories.map((cat) => (
            <li key={cat._id}>
              <Link
                to={`/products/${cat._id}`}
                className={`sidebar-item ${
                  cat._id === current ? "active" : ""
                }`}
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
