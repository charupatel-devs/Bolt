import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import { getProductById } from "../../services_hooks/admin/adminProductService";

const AdminProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { products, isFetching, error, errMsg } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        await getProductById(dispatch, id);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, dispatch]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <span>Loading product details...</span>
        </div>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout>
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold">Product not found</h2>
          <NavLink
            to="/admin/products"
            className="text-blue-600 mt-4 inline-block"
          >
            ← Back to products
          </NavLink>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <NavLink
          to="/admin/products"
          className="text-blue-600 mb-4 inline-block"
        >
          ← Back to products
        </NavLink>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600 mt-1">{product.sku}</p>
          </div>
          <NavLink
            to={`/admin/products/edit/${product.id}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Edit Product
          </NavLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-gray-900">{product.description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="text-gray-900">{product.category?.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-gray-900">${product.price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Original Price</p>
                  <p className="text-gray-900">${product.originalPrice}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Inventory
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Stock Quantity</p>
                <p className="text-gray-900">{product.stock}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Min Order</p>
                  <p className="text-gray-900">{product.minOrderQuantity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Max Order</p>
                  <p className="text-gray-900">{product.maxOrderQuantity}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {product.specifications &&
          Object.keys(product.specifications).length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Specifications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <p className="text-sm text-gray-500 capitalize">{key}</p>
                    <p className="text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </AdminLayout>
  );
};

export default AdminProductDetail;
