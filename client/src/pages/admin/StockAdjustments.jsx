import { Calendar, Minus, Plus, Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import { fetchCategories } from "../../services_hooks/admin/adminCategory";
import { getProductNameByCategory } from "../../services_hooks/admin/adminProductService";
import {
  adjustStock,
  getRecentAdjustments,
} from "../../services_hooks/admin/adminStockService";

const StockAdjustments = () => {
  const dispatch = useDispatch();
  const {
    stockAdjustments = [],
    isFetching,
    pagination = {},
  } = useSelector((state) => state.stocks);
  const { categories = [] } = useSelector((state) => state.categories || {});
  const { products = [] } = useSelector((state) => state.products); // Use a separate productNames array in your slice
  // Filters and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // For new adjustment form
  const [newAdjustment, setNewAdjustment] = useState({
    product: "",
    quantity: "",
    type: "increase",
    reason: "",
  });

  // Fetch adjustments from backend
  useEffect(() => {
    getRecentAdjustments(dispatch, {
      page: pageNo,
      limit: itemsPerPage,
      search: searchTerm,
      type: typeFilter,
    });
  }, [dispatch, pageNo, itemsPerPage, searchTerm, typeFilter]);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories(dispatch);
  }, [dispatch]);

  // Fetch product names when category changes
  useEffect(() => {
    if (categoryFilter) {
      getProductNameByCategory(dispatch, categoryFilter);
      setNewAdjustment((prev) => ({ ...prev, product: "" })); // Reset product on category change
    }
  }, [dispatch, categoryFilter]);
  // Handle add adjustment
  const handleAddAdjustment = async () => {
    if (!newAdjustment.product || !newAdjustment.quantity) return;

    let apiType = "add";
    if (newAdjustment.type === "decrease") apiType = "subtract";
    else if (newAdjustment.type === "set") apiType = "set";

    await adjustStock(dispatch, newAdjustment.product, {
      type: apiType,
      quantity: Number(newAdjustment.quantity),
      reason: newAdjustment.reason,
    });

    // Refresh adjustments
    getRecentAdjustments(dispatch, {
      page: 1,
      limit: itemsPerPage,
    });

    // Reset form (default to "increase" or your preferred default)
    setNewAdjustment({
      product: "",
      quantity: "",
      type: "increase",
      reason: "",
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Stock Adjustments
            </h1>
            <p className="text-gray-600 mt-1">
              Track and manage inventory adjustments
            </p>
          </div>
        </div>

        {/* Add New Adjustment */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            New Stock Adjustment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Category Dropdown */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option value={cat._id} key={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {/* Product Dropdown */}
            <select
              value={newAdjustment.product}
              onChange={(e) =>
                setNewAdjustment((prev) => ({
                  ...prev,
                  product: e.target.value,
                }))
              }
              className="px-3 py-2 border border-gray-200 rounded-lg"
              disabled={!categoryFilter}
            >
              <option value="">Select Product</option>
              {products.map((prod) => (
                <option value={prod._id} key={prod._id}>
                  {prod.name} {prod.sku ? `(${prod.sku})` : ""}
                </option>
              ))}
            </select>
            {/* Type */}
            <select
              value={newAdjustment.type}
              onChange={(e) =>
                setNewAdjustment((prev) => ({ ...prev, type: e.target.value }))
              }
              className="px-3 py-2 border border-gray-200 rounded-lg"
            >
              <option value="increase">Increase</option>
              <option value="decrease">Decrease</option>
              <option value="set">Set</option>
            </select>
            {/* Quantity */}
            <input
              type="number"
              placeholder="Quantity"
              value={newAdjustment.quantity}
              onChange={(e) =>
                setNewAdjustment((prev) => ({
                  ...prev,
                  quantity: e.target.value,
                }))
              }
              className="px-3 py-2 border border-gray-200 rounded-lg"
            />
            {/* Reason */}
            <input
              type="text"
              placeholder="Reason"
              value={newAdjustment.reason}
              onChange={(e) =>
                setNewAdjustment((prev) => ({
                  ...prev,
                  reason: e.target.value,
                }))
              }
              className="px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={handleAddAdjustment}
            disabled={
              !categoryFilter ||
              !newAdjustment.product ||
              !newAdjustment.quantity
            }
          >
            Add Adjustment
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search adjustments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg"
            >
              <option value="all">All Types</option>
              <option value="increase">Increase</option>
              <option value="decrease">Decrease</option>
            </select>
          </div>
        </div>

        {/* Adjustments Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Changed Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Old Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    New Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isFetching ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : stockAdjustments && stockAdjustments.length > 0 ? (
                  stockAdjustments.map((adj) => (
                    <tr key={adj._id}>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {adj.product?.name || "-"}
                          </div>
                          <div className="text-sm text-gray-500">{adj.sku}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            adj.type === "increase"
                              ? "bg-green-100 text-green-800"
                              : adj.type === "decrease"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800" // For "set"
                          }`}
                        >
                          {adj.type === "increase" ? (
                            <Plus className="w-3 h-3 mr-1" />
                          ) : adj.type === "decrease" ? (
                            <Minus className="w-3 h-3 mr-1" />
                          ) : (
                            // For "set", you can use a different icon (e.g., a gear or edit icon)
                            <span className="w-3 h-3 mr-1 font-bold text-blue-700">
                              S
                            </span>
                            // Or use a Lucide icon, e.g. <Settings className="w-3 h-3 mr-1" />
                          )}
                          {adj.type}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {adj.quantity}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {adj.oldStock || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {adj.newStock || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {adj.reason}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">
                            {adj.user?.name || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">
                            {formatDate(adj.date)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-400">
                      No adjustments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default StockAdjustments;
