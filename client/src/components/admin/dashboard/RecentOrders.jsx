// src/components/admin/dashboard/RecentOrders.jsx
// After
import { CheckCheck, Clock, Eye, Truck } from "lucide-react";

import { useState } from "react";

const RecentOrders = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Sample data - replace with actual API data
  const orders = [
    {
      id: "ORD-12345",
      customer: "John Doe",
      customerEmail: "john@example.com",
      products: ["iPhone 15 Pro", "Apple Watch Series 9"],
      total: 1299.99,
      status: "pending",
      date: "2024-01-15T10:30:00",
      avatar:
        "https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=ffffff",
    },
    {
      id: "ORD-12344",
      customer: "Sarah Wilson",
      customerEmail: "sarah@example.com",
      products: ["Samsung Galaxy S24", "Galaxy Buds Pro"],
      total: 899.99,
      status: "processing",
      date: "2024-01-15T09:15:00",
      avatar:
        "https://ui-avatars.com/api/?name=Sarah+Wilson&background=10b981&color=ffffff",
    },
    {
      id: "ORD-12343",
      customer: "Mike Johnson",
      customerEmail: "mike@example.com",
      products: ['MacBook Pro 16"', "Magic Mouse"],
      total: 2599.99,
      status: "shipped",
      date: "2024-01-15T08:45:00",
      avatar:
        "https://ui-avatars.com/api/?name=Mike+Johnson&background=f59e0b&color=ffffff",
    },
    {
      id: "ORD-12342",
      customer: "Emily Chen",
      customerEmail: "emily@example.com",
      products: ["iPad Air", "Apple Pencil", "Smart Keyboard"],
      total: 1199.99,
      status: "delivered",
      date: "2024-01-14T16:20:00",
      avatar:
        "https://ui-avatars.com/api/?name=Emily+Chen&background=8b5cf6&color=ffffff",
    },
    {
      id: "ORD-12341",
      customer: "David Brown",
      customerEmail: "david@example.com",
      products: ["Sony WH-1000XM5", "Charging Case"],
      total: 399.99,
      status: "pending",
      date: "2024-01-14T14:10:00",
      avatar:
        "https://ui-avatars.com/api/?name=David+Brown&background=ef4444&color=ffffff",
    },
    {
      id: "ORD-12340",
      customer: "Lisa Anderson",
      customerEmail: "lisa@example.com",
      products: ["Dell XPS 13", "Wireless Mouse"],
      total: 1499.99,
      status: "processing",
      date: "2024-01-14T11:30:00",
      avatar:
        "https://ui-avatars.com/api/?name=Lisa+Anderson&background=06b6d4&color=ffffff",
    },
  ];

  const statusConfig = {
    pending: {
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
      icon: Clock,
    },
    processing: {
      label: "Processing",
      color: "bg-blue-100 text-blue-800",
      icon: CheckCheck,
    },
    shipped: {
      label: "Shipped",
      color: "bg-purple-100 text-purple-800",
      icon: Truck,
    },
    delivered: {
      label: "Delivered",
      color: "bg-green-100 text-green-800",
      icon: CheckCheck,
    },
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredOrders =
    selectedFilter === "all"
      ? orders
      : orders.filter((order) => order.status === selectedFilter);

  const filterOptions = [
    { value: "all", label: "All Orders", count: orders.length },
    {
      value: "pending",
      label: "Pending",
      count: orders.filter((o) => o.status === "pending").length,
    },
    {
      value: "processing",
      label: "Processing",
      count: orders.filter((o) => o.status === "processing").length,
    },
    {
      value: "shipped",
      label: "Shipped",
      count: orders.filter((o) => o.status === "shipped").length,
    },
    {
      value: "delivered",
      label: "Delivered",
      count: orders.filter((o) => o.status === "delivered").length,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          <p className="text-sm text-gray-600">
            Latest customer orders and their status
          </p>
        </div>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View All Orders
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setSelectedFilter(option.value)}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              selectedFilter === option.value
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <span>{option.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                selectedFilter === option.value
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {option.count}
            </span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const StatusIcon = statusConfig[order.status].icon;

          return (
            <div
              key={order.id}
              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {/* Customer Avatar */}
              <img
                src={order.avatar}
                alt={order.customer}
                className="w-12 h-12 rounded-full"
              />

              {/* Order Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {order.customer}
                  </h4>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(order.total)}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-600 truncate">
                    {order.id} • {order.customerEmail}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(order.date)}
                  </p>
                </div>

                {/* Products */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600 truncate mr-2">
                    {order.products.length > 1
                      ? `${order.products[0]} +${
                          order.products.length - 1
                        } more`
                      : order.products[0]}
                  </p>

                  {/* Status Badge */}
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                        statusConfig[order.status].color
                      }`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      <span>{statusConfig[order.status].label}</span>
                    </span>

                    {/* View Details Button */}
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {filteredOrders.length > 0 && (
        <div className="mt-6 text-center">
          <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200">
            Load More Orders
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-8">
          {/* Empty State */}
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>

          <h4 className="text-sm font-medium text-gray-900 mb-1">
            No orders found
          </h4>
          <p className="text-xs text-gray-500">
            No orders match the selected filter.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentOrders;
