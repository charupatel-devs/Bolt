import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RecentOrders from "../../components/admin/dashboard/RecentOrders";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import { fetchOrderStats } from "../../services_hooks/admin/adminOrderService";

const AdminOrders = () => {
  const [timeFilter, setTimeFilter] = useState("today");
  const {
    recentOrders: orders,
    stats,
    isFetching,
    error,
  } = useSelector((state) => state.orders);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const fetchData = async () => {
    try {
      await fetchOrderStats(dispatch);
    } catch (error) {
      console.error("Error fetching order stats:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [dispatch]);

  const currentStats = stats[timeFilter] || {};

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const statusCards = [
    {
      title: "Pending Orders",
      value: currentStats.pending,
      icon: Clock,
      color: "yellow",

      path: "/admin/orders/pending",
    },
    {
      title: "Processing",
      value: currentStats.processing,
      icon: Package,
      color: "blue",
      path: "/admin/orders/processing",
    },
    {
      title: "Shipped",
      value: currentStats.shipped,
      icon: Truck,
      color: "purple",
      path: "/admin/orders/shipped",
    },
    {
      title: "Delivered",
      value: currentStats.delivered,
      icon: CheckCircle,
      color: "green",
      path: "/admin/orders/delivered",
    },
    {
      title: "Returns",
      value: currentStats.returns || currentStats.returned || 0,
      icon: AlertTriangle,
      color: "orange",
      path: "/admin/orders/returns",
    },
  ];

  if (isFetching) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <Clock className="w-12 h-12 mx-auto text-blue-500 animate-spin" />
            <p className="mt-4 text-lg font-medium text-gray-700">
              Loading orders...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

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
                {/* <p className="text-sm text-green-600 mt-1 flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +18% from last period
                </p> */}
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
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
                {/* <p className="text-sm text-green-600 mt-1 flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +25% from last period
                </p> */}
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
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
                  {currentStats.total
                    ? formatCurrency(currentStats.revenue / currentStats.total)
                    : "₹0"}
                </p>
                {/* <p className="text-sm text-green-600 mt-1 flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +5% from last period
                </p> */}
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
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
                {/* <p className="text-sm text-green-600 mt-1 flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +12% from last period
                </p> */}
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statusCards.map((card, index) => (
            <div
              onClick={() => navigate(card.path)}
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${card.color}-100`}>
                  <card.icon className={`w-6 h-6 text-${card.color}-600`} />
                </div>
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

        <RecentOrders orders={orders} />
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
