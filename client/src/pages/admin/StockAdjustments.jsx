// src/pages/admin/StockAdjustments.jsx
import { Calendar, Minus, Plus, Search, User } from "lucide-react";
import { useState } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";

const StockAdjustments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const adjustments = [
    {
      id: 1,
      product: "Arduino Uno R3",
      sku: "ARD-UNO-R3",
      type: "increase",
      quantity: 25,
      reason: "New stock received",
      user: "John Admin",
      date: "2024-06-18T10:30:00",
    },
    {
      id: 2,
      product: "Raspberry Pi 4",
      sku: "RPI-4-8GB",
      type: "decrease",
      quantity: 5,
      reason: "Damaged items",
      user: "Sarah Manager",
      date: "2024-06-17T14:20:00",
    },
    {
      id: 3,
      product: "ESP32 Board",
      sku: "ESP32-DEV",
      type: "increase",
      quantity: 30,
      reason: "Supplier delivery",
      user: "Mike Warehouse",
      date: "2024-06-16T09:15:00",
    },
  ];

  const [newAdjustment, setNewAdjustment] = useState({
    product: "",
    quantity: "",
    type: "increase",
    reason: "",
  });

  const filteredAdjustments = adjustments.filter((adj) => {
    const searchMatch =
      adj.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adj.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const typeMatch = typeFilter === "all" || adj.type === typeFilter;
    return searchMatch && typeMatch;
  });

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={newAdjustment.product}
              onChange={(e) =>
                setNewAdjustment((prev) => ({
                  ...prev,
                  product: e.target.value,
                }))
              }
              className="px-3 py-2 border border-gray-200 rounded-lg"
            >
              <option value="">Select Product</option>
              <option value="Arduino Uno R3">Arduino Uno R3</option>
              <option value="Raspberry Pi 4">Raspberry Pi 4</option>
              <option value="ESP32 Board">ESP32 Board</option>
            </select>

            <select
              value={newAdjustment.type}
              onChange={(e) =>
                setNewAdjustment((prev) => ({ ...prev, type: e.target.value }))
              }
              className="px-3 py-2 border border-gray-200 rounded-lg"
            >
              <option value="increase">Increase</option>
              <option value="decrease">Decrease</option>
            </select>

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
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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
                    Quantity
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
                {filteredAdjustments.map((adjustment) => (
                  <tr key={adjustment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {adjustment.product}
                        </div>
                        <div className="text-sm text-gray-500">
                          {adjustment.sku}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          adjustment.type === "increase"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {adjustment.type === "increase" ? (
                          <Plus className="w-3 h-3 mr-1" />
                        ) : (
                          <Minus className="w-3 h-3 mr-1" />
                        )}
                        {adjustment.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {adjustment.quantity}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {adjustment.reason}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          {adjustment.user}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          {formatDate(adjustment.date)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default StockAdjustments;
