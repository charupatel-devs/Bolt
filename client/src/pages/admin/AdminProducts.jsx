// src/pages/admin/Products.jsx
import {
  AlertTriangle,
  ChevronRight,
  Download,
  Eye,
  Grid3X3,
  List,
  Package,
  Plus,
  Search,
  Upload,
} from "lucide-react";
import { useState } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";

const AdminProducts = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");

  // Sample categories data
  const categories = [
    {
      id: 1,
      name: "Electronics Components",
      icon: "⚡",
      subcategories: [
        { id: 11, name: "Resistors", count: 1245, lowStock: 23 },
        { id: 12, name: "Capacitors", count: 892, lowStock: 15 },
        { id: 13, name: "Integrated Circuits", count: 567, lowStock: 8 },
        { id: 14, name: "Transistors", count: 433, lowStock: 12 },
      ],
    },
    {
      id: 2,
      name: "Sensors & Detectors",
      icon: "🔍",
      subcategories: [
        { id: 21, name: "Temperature Sensors", count: 234, lowStock: 5 },
        { id: 22, name: "Pressure Sensors", count: 189, lowStock: 7 },
        { id: 23, name: "Proximity Sensors", count: 156, lowStock: 3 },
        { id: 24, name: "Flow Sensors", count: 98, lowStock: 2 },
      ],
    },
    {
      id: 3,
      name: "Power Management",
      icon: "🔋",
      subcategories: [
        { id: 31, name: "Voltage Regulators", count: 345, lowStock: 18 },
        { id: 32, name: "Power Supplies", count: 278, lowStock: 9 },
        { id: 33, name: "Battery Management", count: 167, lowStock: 6 },
        { id: 34, name: "DC-DC Converters", count: 134, lowStock: 4 },
      ],
    },
    {
      id: 4,
      name: "Connectors & Cables",
      icon: "🔌",
      subcategories: [
        { id: 41, name: "USB Connectors", count: 456, lowStock: 21 },
        { id: 42, name: "Audio Connectors", count: 234, lowStock: 11 },
        { id: 43, name: "Power Connectors", count: 189, lowStock: 8 },
        { id: 44, name: "Ribbon Cables", count: 123, lowStock: 3 },
      ],
    },
  ];

  const stats = [
    { label: "Total Products", value: "4,567", trend: "+12%", color: "blue" },
    { label: "Categories", value: "24", trend: "+2", color: "green" },
    { label: "Low Stock Items", value: "127", trend: "-8%", color: "red" },
    { label: "Out of Stock", value: "23", trend: "-15%", color: "orange" },
  ];

  const recentProducts = [
    {
      id: 1,
      name: "Arduino Uno R3",
      sku: "ARD-UNO-R3",
      stock: 45,
      price: 25.99,
      status: "active",
    },
    {
      id: 2,
      name: "Raspberry Pi 4",
      sku: "RPI-4-8GB",
      stock: 12,
      price: 89.99,
      status: "low",
    },
    {
      id: 3,
      name: "ESP32 Development Board",
      sku: "ESP32-DEV",
      stock: 0,
      price: 15.99,
      status: "out",
    },
    {
      id: 4,
      name: "STM32 Nucleo Board",
      sku: "STM32-NUCLEO",
      stock: 78,
      price: 35.5,
      status: "active",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "low":
        return "text-yellow-600 bg-yellow-100";
      case "out":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "In Stock";
      case "low":
        return "Low Stock";
      case "out":
        return "Out of Stock";
      default:
        return "Unknown";
    }
  };

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
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Upload className="w-4 h-4 mr-2" />
              Import CSV
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`text-sm font-medium ${
                    stat.trend.includes("+")
                      ? "text-green-600"
                      : stat.trend.includes("-")
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {stat.trend}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group">
              <Plus className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-blue-800 font-medium">Add New Product</span>
            </button>

            <button className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group">
              <Upload className="w-5 h-5 text-green-600 mr-3" />
              <span className="text-green-800 font-medium">Bulk Import</span>
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

        {/* Categories Grid */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Product Categories
            </h2>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-white shadow-sm"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{category.icon}</span>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {category.name}
                    </h3>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>

                <div className="space-y-3">
                  {category.subcategories.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">
                          {sub.name}
                        </span>
                        <span className="ml-2 text-xs text-gray-500">
                          ({sub.count} items)
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {sub.lowStock > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {sub.lowStock}
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Recently Added Products
            </h2>
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
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
                {recentProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">
                        {product.name}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{product.sku}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-medium ${
                          product.stock === 0
                            ? "text-red-600"
                            : product.stock < 20
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      ${product.price}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          product.status
                        )}`}
                      >
                        {getStatusText(product.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">
                        <Eye className="w-4 h-4" />
                      </button>
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

export default AdminProducts;
