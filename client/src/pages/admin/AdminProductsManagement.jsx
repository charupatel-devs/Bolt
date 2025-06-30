// src/pages/admin/Products.jsx
import {
  AlertTriangle,
  Download,
  Loader2,
  Package,
  Plus,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import {
  deleteProductService,
  getAllProducts,
} from "../../services_hooks/admin/adminProductService";

const AdminProductsManagement = () => {
  const dispatch = useDispatch();

  // Redux state
  const { products, stats, pagination, filters, isFetching, error, errMsg } =
    useSelector((state) => state.products);

  // Local state for UI
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState(filters.search);

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log("🔄 Fetching products...");
      // Service function now handles all dispatch logic
      await getAllProducts(dispatch, {
        page: pagination.currentPage,
        limit: pagination.limit,
        category: filters.category,
        status: filters.status,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      console.log("✅ Products fetch completed");
    } catch (err) {
      console.error("💥 Failed to fetch products:", err);
      // Error is already handled in service function
    }
  };

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== filters.search) {
        dispatch(SetProductFilters({ search: searchTerm }));
        fetchProducts();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(stats);
  const statsData = [
    {
      label: "Total Products",
      value: stats.totalProducts,
    },
    {
      label: "Categories",
      value: stats.categories,
    },
    {
      label: "Low Stock Items",
      value: stats.lowStockItems,
    },
    {
      label: "Out of Stock",
      value: stats.outOfStock,
    },
  ];
  // Add these functions in your component
  const getProductStatus = (stock) => {
    if (stock === 0) return "out-of-stock";
    if (stock <= 5) return "low-stock";
    return "in-stock";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "out-of-stock":
        return "bg-red-100 text-red-800";
      case "low-stock":
        return "bg-yellow-100 text-yellow-800";
      case "in-stock":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "out-of-stock":
        return "Out of Stock";
      case "low-stock":
        return "Low Stock";
      case "in-stock":
        return "In Stock";
      default:
        return "Unknown";
    }
  };

  // Handle error clearing
  const handleClearError = () => {
    dispatch(ClearProductError());
  };

  // Handle product deletion
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProductService(dispatch, productId);
        console.log("✅ Product deleted successfully");
      } catch (err) {
        console.error("💥 Failed to delete product:", err);
      }
    }
  };

  // Handle bulk import
  const handleBulkImport = async (csvFile) => {
    try {
      await bulkImportProductsService(dispatch, csvFile);
      console.log("✅ Bulk import completed");
      // Refresh products list after import
      fetchProducts();
    } catch (err) {
      console.error("💥 Failed to import products:", err);
    }
  };

  // Handle export
  const handleExport = async (format = "csv") => {
    try {
      const blob = await exportProductsService(dispatch, format, filters);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `products_export.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log("✅ Export completed");
    } catch (err) {
      console.error("💥 Failed to export products:", err);
    }
  };

  if (isFetching) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading products...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Package className="w-8 h-8 mr-3 text-blue-600" />
              Products Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your product catalog and inventory
            </p>
          </div>

          <div className="flex space-x-3">
            <NavLink to="/admin/products/add/bulk">
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Upload className="w-4 h-4 mr-2" />
                Import CSV
              </button>
            </NavLink>
            <NavLink to="/admin/products/add">
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </button>
            </NavLink>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Products</h2>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={fetchProducts}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Product
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    SKU
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Stock
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Price
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const status = getProductStatus(product.stock);
                  return (
                    <tr
                      key={product.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <NavLink
                          to={`/admin/products/${product.id}`}
                          className="font-medium text-gray-900 hover:text-blue-600"
                        >
                          {product.name}
                        </NavLink>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{product.sku}</td>
                      <td className="py-3 px-4 text-gray-900">
                        {product.stock}
                      </td>
                      <td className="py-3 px-4 text-gray-900">
                        ${product.price}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            status
                          )}`}
                        >
                          {getStatusText(status)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <NavLink
                          to={`/admin/products/edit/${product.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3"
                        >
                          Edit
                        </NavLink>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchTerm
                  ? "No products found matching your search."
                  : "No products available."}
              </div>
            )}
          </div>
          {/* Show "View All" message if there are more products */}
          {products.length === 5 && (
            <div className="mt-4 text-center">
              <NavLink to="/admin/products/all">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Showing 5 most recent products • View all products →
                </button>
              </NavLink>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group">
              <NavLink to="/admin/products/add">
                <Plus className="w-5 h-5 text-blue-600 mr-3" />
                <span className="text-blue-800 font-medium">
                  Add New Product
                </span>{" "}
              </NavLink>
            </button>

            <button className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group">
              <NavLink to="/admin/products/add/bulk">
                <Upload className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-green-800 font-medium">Bulk Import</span>
              </NavLink>
            </button>

            <button className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors group">
              <AlertTriangle className="w-5 h-5 text-orange-600 mr-3" />
              <span className="text-orange-800 font-medium">
                Low Stock Alert
              </span>
            </button>

            <button className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group">
              <Download className="w-5 h-5 text-purple-600 mr-3" />
              <span className="text-purple-800 font-medium">Export Data</span>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProductsManagement;
