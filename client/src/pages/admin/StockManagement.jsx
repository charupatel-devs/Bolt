import axios from "axios";
import {
  AlertTriangle,
  Building2,
  Minus,
  Package,
  Plus,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import { fetchStocks } from "../../services_hooks/admin/adminProductService";

const getStatus = (stock, min, max) => {
  if (stock === 0) return "out";
  if (stock < min) return "low";
  if (stock > max) return "overstocked";
  return "good";
};

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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adjusting, setAdjusting] = useState({});
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  // Fetch stock data from API
  useEffect(() => {
    fetchStocks(dispatch);
  }, []);

  // Filtered items
  const filteredItems = stockItems.filter((item) => {
    const searchMatch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === "all" || item.status === statusFilter;
    return searchMatch && statusMatch;
  });

  // Stats
  const totalItems = stockItems.length;
  const lowStockItems = stockItems.filter(
    (item) => item.status === "low"
  ).length;
  const outOfStockItems = stockItems.filter(
    (item) => item.status === "out"
  ).length;
  const goodStockItems = stockItems.filter(
    (item) => item.status === "good"
  ).length;

  // Handle stock adjustment
  const handleAdjust = async (id, type) => {
    const quantity = 1; // You can add a modal/input for custom quantity
    setAdjusting((prev) => ({ ...prev, [id]: true }));
    try {
      await axios.patch(`/api/stock/adjust/${id}`, {
        type: type === "add" ? "add" : "subtract",
        quantity,
        reason: type === "add" ? "Manual add" : "Manual subtract",
      });
      // Refresh stock after adjustment
      const res = await axios.get("/api/stock");
      const items = (res.data.products || []).map((p) => ({
        id: p._id,
        name: p.name,
        sku: p.sku,
        currentStock: p.stock,
        minStock: p.minOrderQuantity ?? 0,
        maxStock: p.maxOrderQuantity ?? 9999,
        location: p.location || "",
        status: getStatus(
          p.stock,
          p.minOrderQuantity ?? 0,
          p.maxOrderQuantity ?? 9999
        ),
        availability: p.availability,
      }));
      setStockItems(items);
    } catch (err) {
      setError("Stock adjustment failed");
    }
    setAdjusting((prev) => ({ ...prev, [id]: false }));
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
                  {totalItems}
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
                  {lowStockItems}
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
                  {outOfStockItems}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Good Stock</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {goodStockItems}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="good">Good Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
              <option value="overstocked">Overstocked</option>
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded mb-4">
            {error}
          </div>
        )}

        {/* Stock Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {loading ? (
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
                      Current Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Min/Max
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{item.sku}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.currentStock}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {item.minStock} / {item.maxStock}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            className="p-1 text-green-600 hover:bg-green-100 rounded"
                            disabled={adjusting[item.id]}
                            onClick={() => handleAdjust(item.id, "add")}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                            disabled={adjusting[item.id]}
                            onClick={() => handleAdjust(item.id, "subtract")}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default StockManagement;
