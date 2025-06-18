// src/pages/admin/Orders.jsx
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Edit,
  Eye,
  Filter,
  MoreHorizontal,
  Package,
  Search,
  ShoppingCart,
  TrendingUp,
  Truck,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";

const AdminOrders = () => {
  const [timeFilter, setTimeFilter] = useState("today");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Sample orders data
  const recentOrders = [
    {
      id: "#ORD-2024-001",
      customer: "John Smith",
      email: "john.smith@email.com",
      items: 3,
      total: 299.97,
      status: "pending",
      date: "2024-06-18T10:30:00",
      paymentStatus: "paid",
      shippingAddress: "New York, NY",
    },
    {
      id: "#ORD-2024-002",
      customer: "Sarah Johnson",
      email: "sarah.j@email.com",
      items: 1,
      total: 89.99,
      status: "processing",
      date: "2024-06-18T09:15:00",
      paymentStatus: "paid",
      shippingAddress: "Los Angeles, CA",
    },
    {
      id: "#ORD-2024-003",
      customer: "Michael Brown",
      email: "m.brown@email.com",
      items: 5,
      total: 567.45,
      status: "shipped",
      date: "2024-06-17T16:45:00",
      paymentStatus: "paid",
      shippingAddress: "Chicago, IL",
    },
    {
      id: "#ORD-2024-004",
      customer: "Emily Davis",
      email: "emily.davis@email.com",
      items: 2,
      total: 156.5,
      status: "delivered",
      date: "2024-06-17T14:20:00",
      paymentStatus: "paid",
      shippingAddress: "Houston, TX",
    },
    {
      id: "#ORD-2024-005",
      customer: "Robert Wilson",
      email: "r.wilson@email.com",
      items: 1,
      total: 25.99,
      status: "cancelled",
      date: "2024-06-17T11:30:00",
      paymentStatus: "refunded",
      shippingAddress: "Phoenix, AZ",
    },
  ];

  // Order statistics
  const orderStats = {
    today: {
      total: 45,
      revenue: 12847.5,
      pending: 8,
      processing: 5,
      shipped: 15,
      delivered: 12,
      returns: 3,
      cancelled: 2,
    },
    week: {
      total: 312,
      revenue: 89234.75,
      pending: 23,
      processing: 18,
      shipped: 89,
      delivered: 156,
      returns: 15,
      cancelled: 11,
    },
    month: {
      total: 1247,
      revenue: 345678.9,
      pending: 45,
      processing: 67,
      shipped: 234,
      delivered: 823,
      returns: 56,
      cancelled: 22,
    },
  };

  const currentStats = orderStats[timeFilter];

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "returned":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "processing":
        return <Package className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      case "returned":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <ShoppingCart className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusCards = [
    {
      title: "Pending Orders",
      value: currentStats.pending,
      icon: Clock,
      color: "yellow",
      change: "+12%",
      trend: "up",
      path: "/admin/orders/pending",
    },
    {
      title: "Processing",
      value: currentStats.processing,
      icon: Package,
      color: "blue",
      change: "+8%",
      trend: "up",
      path: "/admin/orders/processing",
    },
    {
      title: "Shipped",
      value: currentStats.shipped,
      icon: Truck,
      color: "purple",
      change: "+15%",
      trend: "up",
      path: "/admin/orders/shipped",
    },
    {
      title: "Delivered",
      value: currentStats.delivered,
      icon: CheckCircle,
      color: "green",
      change: "+20%",
      trend: "up",
      path: "/admin/orders/delivered",
    },
    {
      title: "Returns",
      value: currentStats.returns,
      icon: AlertTriangle,
      color: "orange",
      change: "-5%",
      trend: "down",
      path: "/admin/orders/returns",
    },
    {
      title: "Cancelled",
      value: currentStats.cancelled,
      icon: XCircle,
      color: "red",
      change: "-3%",
      trend: "down",
      path: "/admin/orders/cancelled",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <ShoppingCart className="w-8 h-8 mr-3 text-blue-600" />
              Orders Management
            </h1>
            <p className="text-gray-600 mt-1">
              Track and manage customer orders
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Calendar className="w-4 h-4 mr-2" />
              Custom Range
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {currentStats.total}
                </p>
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +18% from last period
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(currentStats.revenue)}
                </p>
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +25% from last period
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Average Order
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(currentStats.revenue / currentStats.total)}
                </p>
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +5% from last period
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Customers
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {Math.floor(currentStats.total * 0.8)}
                </p>
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +12% from last period
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statusCards.map((card, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${card.color}-100`}>
                  <card.icon className={`w-6 h-6 text-${card.color}-600`} />
                </div>
                <span
                  className={`text-sm font-medium flex items-center ${
                    card.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {card.trend === "up" ? (
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 mr-1" />
                  )}
                  {card.change}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {card.title}
                </h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {card.value}
                </p>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2">
                  View All →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Orders
              </h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="flex items-center px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  View All Orders
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600">
                        {order.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.customer}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.items} items
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(order.total)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(order.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
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

export default AdminOrders;
