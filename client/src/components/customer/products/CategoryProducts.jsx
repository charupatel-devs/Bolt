// client/src/pages/customer/CategoryProducts.jsx
import { useParams } from "react-router-dom";
import CategorySidebar from "../products/CategorySidebar";
import Products from "../products/Products";

const CategoryProducts = () => {
  const { categoryId } = useParams();
  return (
    <Layout style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
      <CategorySidebar selectedCategory={categoryId} />
      <Products initialCategory={categoryId} />
      {/* <h2>hii</h2>  */}
    </Layout>
  );
};

export default CategoryProducts;
