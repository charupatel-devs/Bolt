// src/components/admin/dashboard/RecentActivities.jsx
import {
  AlertTriangle,
  Box,
  CheckCircle,
  MessagesSquare,
  ShoppingCart,
  Star,
  Truck,
  UserPlus,
  XCircle,
} from "lucide-react";

const RecentActivities = () => {
  const activities = [
    {
      id: 1,
      type: "order",
      title: "New Order Received",
      description: "Order #ORD-2024-1547 placed by John Smith",
      amount: "$1,299.00",
      time: "2 minutes ago",
      icon: ShoppingCart,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
    },
    {
      id: 2,
      type: "customer",
      title: "New Customer Registration",
      description: "Sarah Johnson joined as a new customer",
      time: "5 minutes ago",
      icon: UserPlus,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      id: 3,
      type: "inventory",
      title: "Low Stock Alert",
      description: "iPhone 15 Pro Max - Only 3 units left",
      time: "12 minutes ago",
      icon: AlertTriangle,
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
    },
    {
      id: 4,
      type: "review",
      title: "New Product Review",
      description: "5-star review for Samsung Galaxy S24",
      time: "18 minutes ago",
      icon: Star,
      iconColor: "text-yellow-600",
      iconBg: "bg-yellow-100",
    },
    {
      id: 5,
      type: "product",
      title: "Product Added",
      description: "MacBook Air M3 added to inventory",
      time: "25 minutes ago",
      icon: Box,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
    },
    {
      id: 6,
      type: "order_status",
      title: "Order Shipped",
      description: "Order #ORD-2024-1543 has been shipped",
      time: "32 minutes ago",
      icon: Truck,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-100",
    },
    {
      id: 7,
      type: "payment",
      title: "Payment Received",
      description: "Payment of $2,450 confirmed",
      amount: "$2,450.00",
      time: "45 minutes ago",
      icon: CheckCircle,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
    },
    {
      id: 8,
      type: "support",
      title: "Support Ticket",
      description: "New support ticket #SUP-2024-0089",
      time: "1 hour ago",
      icon: MessagesSquare,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-100",
    },
    {
      id: 9,
      type: "order_cancel",
      title: "Order Cancelled",
      description: "Order #ORD-2024-1540 cancelled by customer",
      time: "1 hour 15 minutes ago",
      icon: XCircle,
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
    },
    {
      id: 10,
      type: "inventory",
      title: "Stock Restocked",
      description: "AirPods Pro 2nd Gen - 50 units added",
      time: "2 hours ago",
      icon: Box,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
    },
  ];

  const getActivityPriority = (type) => {
    const priorities = {
      inventory: "high",
      order_cancel: "high",
      order: "medium",
      payment: "medium",
      customer: "low",
      review: "low",
      product: "low",
      order_status: "low",
      support: "medium",
    };
    return priorities[type] || "low";
  };

  const getPriorityIndicator = (priority) => {
    switch (priority) {
      case "high":
        return "border-l-4 border-red-400";
      case "medium":
        return "border-l-4 border-yellow-400";
      default:
        return "border-l-4 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activities
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Latest activities in your store
            </p>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All
          </button>
        </div>
      </div>

      {/* Activities List */}
      <div className="p-6 pt-0">
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {activities.map((activity, index) => {
            const priority = getActivityPriority(activity.type);
            const priorityClass = getPriorityIndicator(priority);

            return (
              <div
                key={activity.id}
                className={`flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 ${priorityClass}`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${activity.iconBg}`}
                >
                  <activity.icon className={`w-5 h-5 ${activity.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {activity.description}
                      </p>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className="text-xs text-gray-500">
                          {activity.time}
                        </span>
                        {priority === "high" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            High Priority
                          </span>
                        )}
                        {priority === "medium" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Medium
                          </span>
                        )}
                      </div>
                    </div>
                    {activity.amount && (
                      <div className="text-right ml-4">
                        <span className="text-sm font-semibold text-gray-900">
                          {activity.amount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More Button */}
        <div className="mt-6 text-center">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Load More Activities
          </button>
        </div>
      </div>

      {/* Activity Summary Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="text-gray-600">2 High Priority</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-gray-600">3 Medium Priority</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <span className="text-gray-600">5 Normal</span>
            </div>
          </div>
          <span className="text-gray-500">Last updated: Just now</span>
        </div>
      </div>
    </div>
  );
};

export default RecentActivities;
