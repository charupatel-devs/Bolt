// src/pages/admin/ProductPerformance.jsx
import {
  Eye,
  Package,
  Search,
  ShoppingCart,
  Star,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";

const ProductPerformance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("sales");

  const products = [
    {
      id: 1,
      name: "Arduino Uno R3",
      sku: "ARD-UNO-R3",
      sales: 156,
      revenue: 4680,
      views: 2340,
      rating: 4.5,
      reviews: 89,
      trend: "up",
      trendPercent: 15.2,
      category: "Microcontrollers",
    },
    {
      id: 2,
      name: "Raspberry Pi 4",
      sku: "RPI-4-8GB",
      sales: 89,
      revenue: 3560,
      views: 1890,
      rating: 4.7,
      reviews: 134,
      trend: "up",
      trendPercent: 8.5,
      category: "Single Board Computers",
    },
    {
      id: 3,
      name: "ESP32 Board",
      sku: "ESP32-DEV",
      sales: 67,
      revenue: 2010,
      views: 1450,
      rating: 4.3,
      reviews: 67,
      trend: "down",
      trendPercent: -3.2,
      category: "WiFi Modules",
    },
    {
      id: 4,
      name: "STM32 Nucleo",
      sku: "STM32-NUCLEO",
      sales: 45,
      revenue: 1800,
      views: 980,
      rating: 4.1,
      reviews: 23,
      trend: "up",
      trendPercent: 12.1,
      category: "Development Boards",
    },
  ];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "sales":
        return b.sales - a.sales;
      case "revenue":
        return b.revenue - a.revenue;
      case "views":
        return b.views - a.views;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const totalProducts = products.length;
  const totalSales = products.reduce((sum, p) => sum + p.sales, 0);
  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
  const averageRating = (
    products.reduce((sum, p) => sum + p.rating, 0) / products.length
  ).toFixed(1);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Package className="w-8 h-8 mr-3 text-blue-600" />
              Product Performance
            </h1>
            <p className="text-gray-600 mt-1">
              Track product sales and performance metrics
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {totalProducts}
                </p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {totalSales}
                </p>
              </div>
              <ShoppingCart className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${totalRevenue.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {averageRating}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
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
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="sales">Sort by Sales</option>
              <option value="revenue">Sort by Revenue</option>
              <option value="views">Sort by Views</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Sales
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Trend
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Category
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.sku}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.sales}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        ${product.revenue.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 flex items-center">
                        <Eye className="w-4 h-4 mr-1 text-gray-400" />
                        {product.views.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-900">
                          {product.rating}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                          ({product.reviews})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {product.trend === "up" ? (
                          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                        )}
                        <span
                          className={`text-sm ${
                            product.trend === "up"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {product.trend === "up" ? "+" : ""}
                          {product.trendPercent}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {product.category}
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

export default ProductPerformance;
