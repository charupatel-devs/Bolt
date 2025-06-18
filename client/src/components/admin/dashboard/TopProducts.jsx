// src/components/admin/dashboard/TopProducts.jsx
import {
  ArrowDown,
  ArrowUp,
  Eye,
  ShoppingCart,
  Star,
  Trophy,
} from "lucide-react";

import { useState } from "react";

const TopProducts = () => {
  const [timeRange, setTimeRange] = useState("week");

  // Sample data - replace with actual API data
  const topProducts = [
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      sku: "IPH15PM-256-BLU",
      image:
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=80&h=80&fit=crop&crop=center",
      sales: 156,
      revenue: 186844,
      rating: 4.8,
      reviews: 1247,
      views: 15623,
      conversionRate: 12.5,
      stockLevel: 45,
      category: "Smartphones",
      changeInSales: 23.5,
      changeInRevenue: 18.2,
      trend: "up",
    },
    {
      id: 2,
      name: 'MacBook Pro 16" M3',
      sku: "MBP16-M3-1TB-SLV",
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=80&h=80&fit=crop&crop=center",
      sales: 87,
      revenue: 225963,
      rating: 4.9,
      reviews: 892,
      views: 8934,
      conversionRate: 9.7,
      stockLevel: 23,
      category: "Laptops",
      changeInSales: 15.8,
      changeInRevenue: 22.1,
      trend: "up",
    },
    {
      id: 3,
      name: "Samsung Galaxy S24 Ultra",
      sku: "SGS24U-512-BLK",
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=80&h=80&fit=crop&crop=center",
      sales: 134,
      revenue: 174266,
      rating: 4.7,
      reviews: 1056,
      views: 12456,
      conversionRate: 10.8,
      stockLevel: 67,
      category: "Smartphones",
      changeInSales: -5.2,
      changeInRevenue: -2.8,
      trend: "down",
    },
    {
      id: 4,
      name: "Sony WH-1000XM5",
      sku: "SXWH1000XM5-BLK",
      image:
        "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=80&h=80&fit=crop&crop=center",
      sales: 289,
      revenue: 115556,
      rating: 4.6,
      reviews: 2134,
      views: 18789,
      conversionRate: 15.4,
      stockLevel: 156,
      category: "Audio",
      changeInSales: 31.2,
      changeInRevenue: 28.7,
      trend: "up",
    },
    {
      id: 5,
      name: 'iPad Pro 12.9" M2',
      sku: "IPD129-M2-256-SLV",
      image:
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=80&h=80&fit=crop&crop=center",
      sales: 98,
      revenue: 107802,
      rating: 4.8,
      reviews: 743,
      views: 9876,
      conversionRate: 9.9,
      stockLevel: 34,
      category: "Tablets",
      changeInSales: 12.1,
      changeInRevenue: 14.5,
      trend: "up",
    },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-4 h-4 text-yellow-400" />
          <Star
            className="w-4 h-4 text-yellow-400 fill-yellow-400 absolute top-0 left-0"
            style={{ clipPath: "inset(0 50% 0 0)" }}
          />
        </div>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  const getRankBadge = (index) => {
    const badges = {
      0: "bg-yellow-100 text-yellow-800 border-yellow-200",
      1: "bg-gray-100 text-gray-800 border-gray-200",
      2: "bg-orange-100 text-orange-800 border-orange-200",
    };

    return badges[index] || "bg-blue-100 text-blue-800 border-blue-200";
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Top Performing Products
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            Best selling products by revenue
          </p>
        </div>

        {/* Time Range Filter */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {["week", "month", "quarter"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                timeRange === range
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Products List */}
      <div className="space-y-4">
        {topProducts.map((product, index) => (
          <div
            key={product.id}
            className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {/* Rank Badge */}
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold ${getRankBadge(
                index
              )}`}
            >
              {index + 1}
            </div>

            {/* Product Image */}
            <div className="flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 truncate mb-1">
                    {product.name}
                  </h4>

                  <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                    <span>SKU: {product.sku}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {product.category}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center space-x-1">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-xs text-gray-600">
                      {product.rating} ({formatNumber(product.reviews)} reviews)
                    </span>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-4 gap-4 text-xs">
                    <div>
                      <div className="flex items-center space-x-1 text-gray-600 mb-1">
                        <ShoppingCart className="w-3 h-3" />

                        <span>Sales</span>
                      </div>
                      <div className="font-medium text-gray-900">
                        {formatNumber(product.sales)}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center space-x-1 text-gray-600 mb-1">
                        <Eye className="w-3 h-3" />

                        <span>Views</span>
                      </div>
                      <div className="font-medium text-gray-900">
                        {formatNumber(product.views)}
                      </div>
                    </div>

                    <div>
                      <div className="text-gray-600 mb-1">Conv. Rate</div>
                      <div className="font-medium text-gray-900">
                        {product.conversionRate}%
                      </div>
                    </div>

                    <div>
                      <div className="text-gray-600 mb-1">Stock</div>
                      <div
                        className={`font-medium ${
                          product.stockLevel < 20
                            ? "text-red-600"
                            : "text-gray-900"
                        }`}
                      >
                        {product.stockLevel}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revenue and Change */}
                <div className="text-right ml-4">
                  <div className="text-lg font-bold text-gray-900 mb-1">
                    {formatCurrency(product.revenue)}
                  </div>

                  <div
                    className={`flex items-center justify-end space-x-1 text-xs font-medium ${
                      product.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.trend === "up" ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    )}
                    <span>{Math.abs(product.changeInRevenue)}%</span>
                  </div>

                  <div className="text-xs text-gray-500 mt-1">
                    {formatNumber(product.sales)} units sold
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {formatNumber(topProducts.reduce((sum, p) => sum + p.sales, 0))}
            </div>
            <div className="text-sm text-gray-600">Total Units Sold</div>
          </div>

          <div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(
                topProducts.reduce((sum, p) => sum + p.revenue, 0)
              )}
            </div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>

          <div>
            <div className="text-2xl font-bold text-gray-900">
              {(
                topProducts.reduce((sum, p) => sum + p.conversionRate, 0) /
                topProducts.length
              ).toFixed(1)}
              %
            </div>
            <div className="text-sm text-gray-600">Avg. Conversion</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-6">
        <button className="text-sm text-gray-600 hover:text-gray-800 font-medium">
          Export Report
        </button>

        <div className="flex space-x-2">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            View Analytics
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
            Manage Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopProducts;
