import axios from "axios";
import {
  AlertTriangle,
  Building2,
  Package,
  Search,
  TrendingDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import { fetchCategories } from "../../services_hooks/admin/adminCategory";
import { fetchStocks } from "../../services_hooks/admin/adminStockService";

const getStatusColor = (status) => {
  switch (status) {
    case "good":
      return "bg-green-100 text-green-800";
    case "low":
      return "bg-yellow-100 text-yellow-800";
    case "out":
      return "bg-red-100 text-red-800";
    case "overstocked":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const StockManagement = () => {
  const dispatch = useDispatch();
  const {
    products = [],
    pagination = {},
    stats = {},
    isFetching,
    error,
    errMsg,
  } = useSelector((state) => state.stocks);
  const { categories = [] } = useSelector((state) => state.categories || {});

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [adjusting, setAdjusting] = useState({});
  const [localError, setLocalError] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch stock data from API on mount and when filters change
  useEffect(() => {
    fetchStocks(dispatch, {
      page: pageNo,
      limit: itemsPerPage,
      search: searchTerm,
      status: statusFilter,
      category: categoryFilter !== "all" ? categoryFilter : undefined,
    });
  }, [
    dispatch,
    pageNo,
    itemsPerPage,
    searchTerm,
    statusFilter,
    categoryFilter,
  ]);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories(dispatch);
  }, [dispatch]);

  // Handle stock adjustment
  const handleAdjust = async (id, type) => {
    const quantity = 1;
    setAdjusting((prev) => ({ ...prev, [id]: true }));
    setLocalError("");
    try {
      await axios.patch(`/api/stock/adjust/${id}`, {
        type: type === "add" ? "add" : "subtract",
        quantity,
        reason: type === "add" ? "Manual add" : "Manual subtract",
      });
      // Refresh stock after adjustment
      fetchStocks(dispatch, {
        page: pageNo,
        limit: itemsPerPage,
        search: searchTerm,
        status: statusFilter,
        category: categoryFilter !== "all" ? categoryFilter : undefined,
      });
    } catch (err) {
      setLocalError("Stock adjustment failed");
    }
    setAdjusting((prev) => ({ ...prev, [id]: false }));
  };

  // Handle search button click
  const handleSearch = () => {
    setSearchTerm(searchInput);
    setPageNo(1); // Reset to first page on new search
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Building2 className="w-8 h-8 mr-3 text-blue-600" />
              Stock Management
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor and manage inventory levels
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.totalProducts}
                </p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {stats.lowStockItems}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Out of Stock
                </p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {stats.outOfStock}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </button>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPageNo(1); // Reset to first page on filter
              }}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="good">Good Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPageNo(1); // Reset to first page on filter
              }}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option value={cat._id} key={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className=" border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-gray-600">
                Showing {(pagination.currentPage - 1) * itemsPerPage + 1} -{" "}
                {Math.min(
                  pagination.currentPage * itemsPerPage,
                  stats.totalProducts
                )}{" "}
                of {stats.totalProducts} results
              </span>

              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setPageNo(1); // Reset to first page
                }}
                className="px-3 py-1 border border-gray-200 rounded text-sm"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
              </select>
            </div>
            {/* Stock Table */}
            <div>
              {isFetching ? (
                <div className="p-8 text-center text-gray-500">Loading...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          SKU
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Current Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Min Order Qty
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Max Order Qty
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-10 text-center text-gray-400 text-lg"
                          >
                            No products found for the selected filters.
                          </td>
                        </tr>
                      ) : (
                        products.map((p) => (
                          <tr key={p._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">
                                {p.name}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-600">
                                {p.sku}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-600">
                                {p.category.name || "Uncategorized"}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">
                                {p.stock}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-600">
                                {p.minOrderQuantity}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-600">
                                {p.maxOrderQuantity}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                  p.status ||
                                    (p.stock === 0
                                      ? "out"
                                      : p.stock < (p.minOrderQuantity ?? 1)
                                      ? "low"
                                      : "good")
                                )}`}
                              >
                                {p.status ||
                                  (p.stock === 0
                                    ? "out"
                                    : p.stock < (p.minOrderQuantity ?? 1)
                                    ? "low"
                                    : "good")}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setPageNo(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    <div className="flex space-x-1">
                      {Array.from(
                        { length: Math.min(5, pagination.totalPages) },
                        (_, i) => {
                          const page = i + 1;
                          return (
                            <button
                              key={page}
                              onClick={() => setPageNo(page)}
                              className={`w-8 h-8 text-sm rounded-lg ${
                                pagination.currentPage === page
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        }
                      )}
                    </div>

                    <button
                      onClick={() => setPageNo(pagination.currentPage + 1)}
                      disabled={
                        pagination.currentPage === pagination.totalPages
                      }
                      className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default StockManagement;
