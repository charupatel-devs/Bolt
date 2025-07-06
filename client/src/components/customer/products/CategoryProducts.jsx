// client/src/pages/customer/CategoryProducts.jsx
import { useParams } from "react-router-dom";
import Layout from "../../../components/customer/layout/Layout";
import CategorySidebar from "../products/CategorySidebar";
import Products from "../products/Products";

const CategoryProducts = () => {
  const { categoryId } = useParams();

  return (
    <Layout>
      <div className="flex gap-4">
        <CategorySidebar selectedCategory={categoryId} />
        <div className="flex-1">
          <Products initialCategory={categoryId} />
        </div>
      </div>
    </Layout>
  );
};

export default CategoryProducts;
