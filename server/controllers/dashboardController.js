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
          // status: { $in: ["processing", "shipped", "delivered"] },
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

exports.getSalesChart = async (req, res) => {
  try {
    const range = req.query.range || "7days"; // "7days", "30days", "6months"

    let match = {
      // status: { $in: ["delivered", "processing", "shipped"] },
    };
    let groupFormat;
    let periods = [];
    let labelFn;
    const today = new Date();

    // Set grouping and period setup based on range
    if (range === "7days") {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        periods.push(d);
      }
      groupFormat = {
        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
      };
      match.createdAt = {
        $gte: new Date(today.setHours(0, 0, 0, 0) - 6 * 24 * 60 * 60 * 1000),
        $lte: new Date(),
      };
      labelFn = getDayLabel;
    } else if (range === "30days") {
      for (let i = 4; i >= 1; i--) {
        const start = new Date(today);
        start.setDate(today.getDate() - i * 7);
        periods.push(start);
      }
      groupFormat = { $isoWeek: "$createdAt" };
      match.createdAt = {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        $lte: new Date(),
      };
      labelFn = (date, idx) => `Week ${idx + 1}`;
    } else if (range === "6months") {
      // Create a lookup map for fast access
      const aggMap = new Map(agg.map((item) => [item._id, item]));

      for (let i = 0; i < periods.length; i++) {
        const d = periods[i];
        const dateStr = d.toISOString().slice(0, 7); // 'YYYY-MM'
        const found = aggMap.get(dateStr);

        chartData.push({
          name: labelFn(d),
          sales: found ? found.sales : 0,
          orders: found ? found.orders : 0,
        });
      }
    }

    // Set grouping fields
    let groupBy = {
      _id: groupFormat,
      sales: { $sum: "$totalAmount" },
      orders: { $sum: 1 },
      date: { $first: "$createdAt" },
    };

    // Run aggregation
    const agg = await Order.aggregate([
      { $match: match },
      { $group: groupBy },
      { $sort: { _id: 1 } },
    ]);

    console.log("Aggregation Result:", agg); // Debug

    // Generate chart data with all periods
    const chartData = [];

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
      for (let i = 0; i < periods.length; i++) {
        const found = agg[i]; // Indexed, not date-mapped
        chartData.push({
          name: labelFn(periods[i], i),
          sales: found ? found.sales : 0,
          orders: found ? found.orders : 0,
        });
      }
    } else if (range === "6months") {
      for (let i = 0; i < periods.length; i++) {
        const d = periods[i];
        const dateStr = d.toISOString().slice(0, 7); // YYYY-MM
        const found = agg.find((item) => item._id === dateStr);
        chartData.push({
          name: labelFn(d),
          sales: found ? found.sales : 0,
          orders: found ? found.orders : 0,
        });
      }
    }

    return res.json({ success: true, data: chartData });
  } catch (error) {
    console.error("Sales Chart Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch sales chart data",
    });
  }
};
// Helper functions (place these outside your main function or where they are accessible)
const getDayLabel = (date) =>
  date.toLocaleDateString("en-US", { weekday: "short" }); // "Mon", "Tue", etc.

const getMonthLabel = (date) =>
  date.toLocaleDateString("en-US", { year: "numeric", month: "short" }); // "Jul 2025", etc.

// Your controller function
exports.getSalesChart = async (req, res) => {
  try {
    const range = req.query.range || "7days"; // "7days", "30days", "6months"

    let match = {
      // status: { $in: ["delivered", "processing", "shipped"] }, // Optional: uncomment to filter by status
    };
    let groupFormat;
    let periods = [];
    let labelFn;
    const today = new Date();

    // --- 1. SETUP PHASE ---
    // Correctly set up variables based on the requested range.
    if (range === "7days") {
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        periods.push(d);
      }
      groupFormat = {
        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
      };
      // Set the start date to the beginning of the day, 7 days ago
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
      match.createdAt = {
        $gte: startDate,
        $lte: new Date(), // Now
      };
      labelFn = getDayLabel;
    } else if (range === "30days") {
      // Logic for 30 days (simplified for clarity)
      // This logic groups by ISO week. A simple loop is better for labeling.
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        periods.push(d);
      }
      groupFormat = {
        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
      };
      const startDate = new Date();
      startDate.setDate(today.getDate() - 29);
      startDate.setHours(0, 0, 0, 0);
      match.createdAt = {
        $gte: startDate,
        $lte: new Date(),
      };
      // This is a placeholder; you might want a more sophisticated label for 30 days
      labelFn = (date) =>
        date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } else if (range === "6months") {
      // RESTORED: This block was missing in your updated code.
      for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        periods.push(d);
      }
      groupFormat = {
        $dateToString: { format: "%Y-%m", date: "$createdAt" },
      };
      const startDate = new Date(today.getFullYear(), today.getMonth() - 5, 1);
      match.createdAt = {
        $gte: startDate,
        $lte: new Date(),
      };
      labelFn = getMonthLabel;
    }

    // --- 2. AGGREGATION PHASE ---
    // This runs *after* the setup is complete.
    const agg = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: groupFormat,
          sales: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    console.log("Aggregation Result:", agg); // For debugging

    // --- 3. PROCESSING PHASE ---
    // Now we process the results, which are in the `agg` variable.
    const chartData = [];

    // Create a lookup map for efficient searching
    const aggMap = new Map(agg.map((item) => [item._id, item]));

    if (range === "7days" || range === "30days") {
      for (const d of periods) {
        const dateStr = d.toISOString().slice(0, 10); // YYYY-MM-DD
        const found = aggMap.get(dateStr);
        chartData.push({
          name: labelFn(d),
          sales: found ? found.sales : 0,
          orders: found ? found.orders : 0,
        });
      }
    } else if (range === "6months") {
      // Create a lookup map for fast access
      const aggMap = new Map(agg.map((item) => [item._id, item]));

      for (const d of periods) {
        // --- FIX IS HERE ---
        // Manually construct the 'YYYY-MM' string to avoid timezone issues.
        const year = d.getFullYear();
        // getMonth() is 0-indexed (0=Jan, 1=Feb), so we add 1.
        // padStart ensures the month is always two digits (e.g., '07' instead of '7').
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const dateStr = `${year}-${month}`; // Correctly produces "2025-07"

        const found = aggMap.get(dateStr);

        chartData.push({
          name: labelFn(d), // Assuming getMonthLabel works correctly
          sales: found ? found.sales : 0,
          orders: found ? found.orders : 0,
        });
      }
    }

    return res.json({ success: true, data: chartData });
  } catch (error) {
    console.error("Sales Chart Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch sales chart data",
      error: error.message, // Send back error message for easier debugging
    });
  }
};
