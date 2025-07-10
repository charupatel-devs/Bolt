// src/pages/admin/AdminDashboard.jsx
import {
  Box,
  DollarSign,
  Eye,
  LineChart,
  ShoppingCart,
  Users,
} from "lucide-react";

import { useEffect, useState } from "react";
import RecentOrders from "../../components/admin/dashboard/RecentOrders";
import SalesChart from "../../components/admin/dashboard/SalesChart";
import StatsCard from "../../components/admin/dashboard/StatsCard";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import { getDashboardStats } from "../../services_hooks/admin/adminDashboardService";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalRevenue: { value: 245680, change: 12.5, trend: "up" },
      totalOrders: { value: 1547, change: -2.3, trend: "down" },
      totalCustomers: { value: 12845, change: 8.7, trend: "up" },
      totalProducts: { value: 856, change: 5.2, trend: "up" },
      pageViews: { value: 89234, change: 15.3, trend: "up" },
      conversionRate: { value: 3.24, change: 0.8, trend: "up" },
    },
    loading: true,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setDashboardData((prev) => ({ ...prev, loading: true }));
        const apiRes = await getDashboardStats();

        // If your API returns { success, data: { overview, ... } }
        const overview = apiRes.data?.overview || {};

        // Optionally: calculate change/trend here if you want to show them
        setDashboardData({
          stats: {
            totalRevenue: {
              value: overview.totalRevenue || 0,
              change: 0,
              trend: "up",
            },
            totalOrders: {
              value: overview.totalOrders || 0,
              change: 0,
              trend: "up",
            },
            totalCustomers: {
              value: overview.totalUsers || 0,
              change: 0,
              trend: "up",
            },
            totalProducts: {
              value: overview.totalProducts || 0,
              change: 0,
              trend: "up",
            },
            pageViews: { value: 0, change: 0, trend: "up" }, // If not available, set to 0
            conversionRate: { value: 0, change: 0, trend: "up" }, // If not available, set to 0
          },
          loading: false,
        });
      } catch (error) {
        setDashboardData((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
  }, []);

  const statsCards = [
    {
      title: "Total Revenue",
      value: `$${
        dashboardData.stats.totalRevenue.value?.toLocaleString() || 0
      }`,
      change: dashboardData.stats.totalRevenue.change,
      trend: dashboardData.stats.totalRevenue.trend,
      icon: DollarSign,
      color: "blue",
      description: "Total revenue this month",
    },
    {
      title: "Total Orders",
      value: dashboardData.stats.totalOrders.value?.toLocaleString() || 0,
      change: dashboardData.stats.totalOrders.change,
      trend: dashboardData.stats.totalOrders.trend,
      icon: ShoppingCart,
      color: "green",
      description: "Orders received this month",
    },
    {
      title: "Total Customers",
      value: dashboardData.stats.totalCustomers.value?.toLocaleString() || 0,
      change: dashboardData.stats.totalCustomers.change,
      trend: dashboardData.stats.totalCustomers.trend,
      icon: Users,
      color: "purple",
      description: "Active customers",
    },
    {
      title: "Total Products",
      value: dashboardData.stats.totalProducts.value?.toLocaleString() || 0,
      change: dashboardData.stats.totalProducts.change,
      trend: dashboardData.stats.totalProducts.trend,
      icon: Box,
      color: "orange",
      description: "Products in inventory",
    },
    {
      title: "Page Views",
      value: dashboardData.stats.pageViews.value?.toLocaleString() || 0,
      change: dashboardData.stats.pageViews.change,
      trend: dashboardData.stats.pageViews.trend,
      icon: Eye,
      color: "indigo",
      description: "Total page views this month",
    },
    {
      title: "Conversion Rate",
      value: `${dashboardData.stats.conversionRate.value || 0}%`,
      change: dashboardData.stats.conversionRate.change,
      trend: dashboardData.stats.conversionRate.trend,
      icon: LineChart,
      color: "pink",
      description: "Visitor to customer conversion",
    },
  ];

  if (dashboardData.loading) {
    return (
      <AdminLayout>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with your electronics store.
          </p>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>
        <div className="xl:col-span-2">
          <SalesChart />
        </div>

        <div className="xl:col-span-2">
          <RecentOrders />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
