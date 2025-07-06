import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchCategories } from "../../../store/customer/productSlice";
import "../../../assets/css/customer/FilterSidebar.css";
const CategorySidebar = ({ selectedCategory }) => {
  const dispatch = useDispatch();
  const { categories = [], loading, error } = useSelector((s) => s.product);
  const { categoryId } = useParams();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const current = selectedCategory || categoryId;

  if (loading) return <aside className="sidebar-container">Loading...</aside>;
  if (error) return <aside className="sidebar-container error">Error: {error}</aside>;

  return (
    <aside className="sidebar-container w-1/4 pr-4">
      <div className="sidebar-box">
        <div className="sidebar-header">
          <h3 className="sidebar-heading">Category</h3>
          <Link to="/customer/products" className="view-all-link">View All</Link>
        </div>
        <ul className="sidebar-list">
          {categories.map((cat) => (
            <li key={cat._id}>
              <Link
                to={`/customer/products/category/${cat._id}`}
                className={`sidebar-item ${cat._id === current ? "active" : ""}`}
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