// src/pages/admin/SalesReports.jsx
import { BarChart3, Download, Filter } from "lucide-react";
import { useState } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";

const SalesReports = () => {
  const [dateRange, setDateRange] = useState("thisMonth");
  const [reportType, setReportType] = useState("overview");

  const salesData = {
    totalRevenue: 45800,
    totalOrders: 342,
    averageOrderValue: 134.5,
    newCustomers: 89,
    monthlyGrowth: 12.5,
    topProducts: [
      { name: "Arduino Uno R3", sales: 156, revenue: 4680 },
      { name: "Raspberry Pi 4", sales: 89, revenue: 3560 },
      { name: "ESP32 Board", sales: 67, revenue: 2010 },
      { name: "STM32 Nucleo", sales: 45, revenue: 1800 },
    ],
    dailySales: [
      { date: "Jun 14", orders: 23, revenue: 3100 },
      { date: "Jun 15", orders: 18, revenue: 2400 },
      { date: "Jun 16", orders: 31, revenue: 4200 },
      { date: "Jun 17", orders: 27, revenue: 3600 },
      { date: "Jun 18", orders: 35, revenue: 4700 },
    ],
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="w-8 h-8 mr-3 text-blue-600" />
              Sales Reports
            </h1>
            <p className="text-gray-600 mt-1">
              Analyze sales performance and trends
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="today">Today</option>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisYear">This Year</option>
            </select>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Report Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Report Filters
            </h3>
            <Filter className="w-5 h-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="overview">Overview</option>
              <option value="detailed">Detailed</option>
              <option value="comparative">Comparative</option>
            </select>
            <input
              type="date"
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="date"
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SalesReports;
