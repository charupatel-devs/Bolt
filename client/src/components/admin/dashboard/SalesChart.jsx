import { useEffect, useState } from "react";
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
import { getSalesChartData } from "../../../services_hooks/admin/adminDashboardService"; // Adjust path as needed

const SalesChart = () => {
  const [chartType, setChartType] = useState("area");
  const [timeRange, setTimeRange] = useState("7days");
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (range) => {
    setLoading(true);
    try {
      const data = await getSalesChartData(range);
      setSalesData(data);
    } catch (e) {
      setSalesData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(timeRange);
  }, [timeRange]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD", // Change to your currency if needed
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      {/* Header, toggles, etc. as before */}
      <div className="flex items-center justify-between mb-6">
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

      {/* Chart */}
      <div className="h-80">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            Loading...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "area" ? (
              <AreaChart
                data={salesData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#4f46e5"
                  fill="#c7d2fe"
                  strokeWidth={2}
                />
              </AreaChart>
            ) : (
              <LineChart
                data={salesData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#4f46e5"
                  strokeWidth={2}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(
              salesData.reduce((sum, item) => sum + item.sales, 0)
            )}
          </p>
          <p className="text-sm text-gray-600">Total Sales</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">
            {salesData.reduce((sum, item) => sum + item.orders, 0)}
          </p>
          <p className="text-sm text-gray-600">Total Orders</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">
            {salesData.length > 0
              ? formatCurrency(
                  salesData.reduce((sum, item) => sum + item.sales, 0) /
                    salesData.reduce((sum, item) => sum + item.orders, 0)
                )
              : formatCurrency(0)}
          </p>
          <p className="text-sm text-gray-600">Avg Order Value</p>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
