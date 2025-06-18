// src/components/admin/dashboard/SalesChart.jsx
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const SalesChart = () => {
  const [chartType, setChartType] = useState("area");
  const [timeRange, setTimeRange] = useState("7days");

  // Sample data - replace with actual API data
  const salesData = {
    "7days": [
      { name: "Mon", sales: 12400, orders: 45 },
      { name: "Tue", sales: 13600, orders: 52 },
      { name: "Wed", sales: 11800, orders: 41 },
      { name: "Thu", sales: 15200, orders: 58 },
      { name: "Fri", sales: 18900, orders: 72 },
      { name: "Sat", sales: 22100, orders: 84 },
      { name: "Sun", sales: 16700, orders: 63 },
    ],
    "30days": [
      { name: "Week 1", sales: 85400, orders: 324 },
      { name: "Week 2", sales: 92600, orders: 356 },
      { name: "Week 3", sales: 78800, orders: 298 },
      { name: "Week 4", sales: 105200, orders: 401 },
    ],
    "6months": [
      { name: "Jan", sales: 285400, orders: 1024 },
      { name: "Feb", sales: 312600, orders: 1156 },
      { name: "Mar", sales: 298800, orders: 1098 },
      { name: "Apr", sales: 335200, orders: 1241 },
      { name: "May", sales: 378900, orders: 1402 },
      { name: "Jun", sales: 412100, orders: 1523 },
    ],
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-blue-600">● Sales: </span>
              <span className="font-medium">
                {formatCurrency(payload[0].value)}
              </span>
            </p>
            <p className="text-sm">
              <span className="text-green-600">● Orders: </span>
              <span className="font-medium">{payload[1]?.value || 0}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Sales Analytics
          </h3>
          <p className="text-sm text-gray-600">Revenue and order trends</p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Chart Type Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setChartType("area")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                chartType === "area"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setChartType("line")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                chartType === "line"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Line
            </button>
          </div>

          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="6months">Last 6 Months</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "area" ? (
            <AreaChart
              data={salesData[timeRange]}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#salesGradient)"
              />
            </AreaChart>
          ) : (
            <LineChart
              data={salesData[timeRange]}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
                yAxisId="right"
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(
              salesData[timeRange].reduce((sum, item) => sum + item.sales, 0)
            )}
          </p>
          <p className="text-sm text-gray-600">Total Sales</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">
            {salesData[timeRange].reduce((sum, item) => sum + item.orders, 0)}
          </p>
          <p className="text-sm text-gray-600">Total Orders</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">
            {formatCurrency(
              salesData[timeRange].reduce((sum, item) => sum + item.sales, 0) /
                salesData[timeRange].reduce((sum, item) => sum + item.orders, 0)
            )}
          </p>
          <p className="text-sm text-gray-600">Avg Order Value</p>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
