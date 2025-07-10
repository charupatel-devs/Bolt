// controllers/dashboardController.js
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
// const PageView = require("../models/PageView"); // Uncomment if you have this model

// Helper to calculate percentage change and trend
function getChange(current, previous) {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
}
const getDayLabel = (date) =>
  date.toLocaleDateString("en-US", { weekday: "short" }); // "Mon", "Tue", etc.

const getMonthLabel = (date) =>
  date.toLocaleDateString("en-US", { month: "short" }); // "Jan", "Feb", etc.
exports.getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // --- Revenue ---
    const currRevenueAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          status: { $in: ["processing", "shipped", "delivered"] },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const prevRevenueAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfPrevMonth, $lt: startOfMonth },
          status: { $in: ["processing", "shipped", "delivered"] },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const currRevenue = currRevenueAgg[0]?.total || 0;
    const prevRevenue = prevRevenueAgg[0]?.total || 0;

    // --- Orders ---
    const currOrders = await Order.countDocuments({
      createdAt: { $gte: startOfMonth },
    });
    const prevOrders = await Order.countDocuments({
      createdAt: { $gte: startOfPrevMonth, $lt: startOfMonth },
    });

    // --- Customers ---
    const currCustomers = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    });
    const prevCustomers = await User.countDocuments({
      createdAt: { $gte: startOfPrevMonth, $lt: startOfMonth },
    });

    // --- Products ---
    const currProducts = await Product.countDocuments();
    // For trend, you can compare with last month or just show all-time
    const prevProducts = currProducts; // Or adjust as needed

    // --- Page Views (mock if not implemented) ---
    // const currPageViews = await PageView.countDocuments({ createdAt: { $gte: startOfMonth } });
    // const prevPageViews = await PageView.countDocuments({ createdAt: { $gte: startOfPrevMonth, $lt: startOfMonth } });
    // For now, mock:
    const currPageViews = 89234;
    const prevPageViews = 77366;

    // --- Conversion Rate (orders/page views) ---
    const currConversion =
      currPageViews === 0 ? 0 : (currOrders / currPageViews) * 100;
    const prevConversion =
      prevPageViews === 0 ? 0 : (prevOrders / prevPageViews) * 100;

    res.json({
      totalRevenue: {
        value: currRevenue,
        change: Number(getChange(currRevenue, prevRevenue).toFixed(2)),
        trend: currRevenue >= prevRevenue ? "up" : "down",
      },
      totalOrders: {
        value: currOrders,
        change: Number(getChange(currOrders, prevOrders).toFixed(2)),
        trend: currOrders >= prevOrders ? "up" : "down",
      },
      totalCustomers: {
        value: currCustomers,
        change: Number(getChange(currCustomers, prevCustomers).toFixed(2)),
        trend: currCustomers >= prevCustomers ? "up" : "down",
      },
      totalProducts: {
        value: currProducts,
        change: 0, // Or calculate if you want to compare with previous month
        trend: "up",
      },
      pageViews: {
        value: currPageViews,
        change: Number(getChange(currPageViews, prevPageViews).toFixed(2)),
        trend: currPageViews >= prevPageViews ? "up" : "down",
      },
      conversionRate: {
        value: Number(currConversion.toFixed(2)),
        change: Number(getChange(currConversion, prevConversion).toFixed(2)),
        trend: currConversion >= prevConversion ? "up" : "down",
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};

// @desc    Get sales chart data (area graph)
// @route   GET /api/admin/sales-chart
// @access  Private/Admin
exports.getSalesChart = async (req, res) => {
  try {
    const range = req.query.range || "7days"; // "7days", "30days", "6months"
    let match = { status: { $in: ["delivered", "processing", "shipped"] } };
    let groupFormat;
    let periods = [];
    let labelFn;

    if (range === "7days") {
      // Last 7 days, group by day
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        periods.push(d);
      }
      groupFormat = {
        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
      };
      match.createdAt = {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      };
      labelFn = getDayLabel;
    } else if (range === "30days") {
      // Last 30 days, group by week
      const today = new Date();
      for (let i = 4; i >= 1; i--) {
        const start = new Date(today);
        start.setDate(today.getDate() - i * 7);
        periods.push(start);
      }
      groupFormat = { $isoWeek: "$createdAt" };
      match.createdAt = {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      };
      labelFn = (date, idx) => `Week ${idx + 1}`;
    } else if (range === "6months") {
      // Last 6 months, group by month
      const today = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        periods.push(d);
      }
      groupFormat = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
      match.createdAt = {
        $gte: new Date(today.getFullYear(), today.getMonth() - 5, 1),
      };
      labelFn = getMonthLabel;
    }

    // Aggregate orders
    let groupBy;
    if (range === "7days") {
      groupBy = {
        _id: groupFormat,
        sales: { $sum: "$totalAmount" },
        orders: { $sum: 1 },
        date: { $first: "$createdAt" },
      };
    } else if (range === "30days") {
      groupBy = {
        _id: { $isoWeek: "$createdAt" },
        sales: { $sum: "$totalAmount" },
        orders: { $sum: 1 },
        date: { $first: "$createdAt" },
      };
    } else if (range === "6months") {
      groupBy = {
        _id: groupFormat,
        sales: { $sum: "$totalAmount" },
        orders: { $sum: 1 },
        date: { $first: "$createdAt" },
      };
    }

    const agg = await Order.aggregate([
      { $match: match },
      { $group: groupBy },
      { $sort: { _id: 1 } },
    ]);

    // Map/merge results to fill missing periods
    let chartData = [];
    if (range === "7days") {
      for (let i = 0; i < periods.length; i++) {
        const d = periods[i];
        const dateStr = d.toISOString().slice(0, 10);
        const found = agg.find((item) => item._id === dateStr);
        chartData.push({
          name: labelFn(d),
          sales: found ? found.sales : 0,
          orders: found ? found.orders : 0,
        });
      }
    } else if (range === "30days") {
      // agg _id is week number; just map as Week 1, 2, ...
      for (let i = 0; i < periods.length; i++) {
        const found = agg[i];
        chartData.push({
          name: labelFn(periods[i], i),
          sales: found ? found.sales : 0,
          orders: found ? found.orders : 0,
        });
      }
    } else if (range === "6months") {
      for (let i = 0; i < periods.length; i++) {
        const d = periods[i];
        const dateStr = d.toISOString().slice(0, 7); // "YYYY-MM"
        const found = agg.find((item) => item._id === dateStr);
        chartData.push({
          name: labelFn(d),
          sales: found ? found.sales : 0,
          orders: found ? found.orders : 0,
        });
      }
    }

    res.json({ success: true, data: chartData });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch sales chart data" });
  }
};
