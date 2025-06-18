// src/components/admin/dashboard/LowStockProducts.jsx
import { AlertTriangle, Plus } from "lucide-react";

const LowStockProducts = () => {
  // Sample data - replace with actual API data
  const lowStockProducts = [
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      sku: "IPH15PM-256-BLU",
      currentStock: 3,
      minStock: 10,
      price: 1199.99,
      image:
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=80&h=80&fit=crop&crop=center",
      status: "critical",
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra",
      sku: "SGS24U-512-BLK",
      currentStock: 7,
      minStock: 15,
      price: 1299.99,
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=80&h=80&fit=crop&crop=center",
      status: "low",
    },
    {
      id: 3,
      name: 'MacBook Pro 16" M3',
      sku: "MBP16-M3-1TB-SLV",
      currentStock: 2,
      minStock: 8,
      price: 2599.99,
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=80&h=80&fit=crop&crop=center",
      status: "critical",
    },
    {
      id: 4,
      name: "Sony WH-1000XM5",
      sku: "SXWH1000XM5-BLK",
      currentStock: 5,
      minStock: 12,
      price: 399.99,
      image:
        "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=80&h=80&fit=crop&crop=center",
      status: "low",
    },
    {
      id: 5,
      name: 'iPad Pro 12.9" M2',
      sku: "IPD129-M2-256-SLV",
      currentStock: 1,
      minStock: 10,
      price: 1099.99,
      image:
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=80&h=80&fit=crop&crop=center",
      status: "critical",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "low":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStockPercentage = (current, min) => {
    return Math.min((current / min) * 100, 100);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const criticalCount = lowStockProducts.filter(
    (p) => p.status === "critical"
  ).length;
  const lowCount = lowStockProducts.filter((p) => p.status === "low").length;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Low Stock Alert
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            Products running low on inventory
          </p>
        </div>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View All
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-red-50 p-3 rounded-lg border border-red-100">
          <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
          <div className="text-sm text-red-600">Critical Stock</div>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
          <div className="text-2xl font-bold text-yellow-600">{lowCount}</div>
          <div className="text-sm text-yellow-600">Low Stock</div>
        </div>
      </div>

      {/* Product List */}
      <div className="space-y-4">
        {lowStockProducts.map((product) => (
          <div
            key={product.id}
            className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
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
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {product.name}
                </h4>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                    product.status
                  )}`}
                >
                  {product.status === "critical" ? "Critical" : "Low Stock"}
                </span>
              </div>

              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatCurrency(product.price)}
                </p>
              </div>

              {/* Stock Progress Bar */}
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>
                      Stock: {product.currentStock}/{product.minStock}
                    </span>
                    <span>
                      {Math.round(
                        getStockPercentage(
                          product.currentStock,
                          product.minStock
                        )
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        product.status === "critical"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                      style={{
                        width: `${getStockPercentage(
                          product.currentStock,
                          product.minStock
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Restock Button */}
                <button
                  className="flex items-center justify-center w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                  title="Restock Product"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State (if no products) */}
      {lowStockProducts.length === 0 && (
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No low stock products at the moment</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
        <button className="text-sm text-gray-600 hover:text-gray-800 font-medium">
          Export Report
        </button>

        <div className="flex space-x-2">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            Bulk Restock
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
            Create Purchase Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default LowStockProducts;
