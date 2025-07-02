// src/pages/admin/ShippedOrders.jsx
import {
  Download,
  ExternalLink,
  Eye,
  Grid,
  MapPin,
  Search,
  Table,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import { getOrdersByStatus } from "../../services_hooks/admin/adminOrderService";

const ShippedOrders = () => {
  const dispatch = useDispatch();
  const { orders, isFetching, error } = useSelector((state) => state.orders);
  const [searchTerm, setSearchTerm] = useState("");
  const [carrierFilter, setCarrierFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table"); // Default to table view

  const fetchOrders = async () => {
    try {
      await getOrdersByStatus("shipped", dispatch);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [dispatch]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter orders based on search term and filters
  const filteredOrders = orders.filter((order) => {
    const searchMatch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user?.name &&
        order.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.trackingNumber &&
        order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    return searchMatch;
  });

  // Get status display color
  const getStatusColor = (status) => {
    switch (status) {
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "delayed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Truck className="w-8 h-8 mr-3 text-purple-600" />
              Shipped Orders
            </h1>
            <p className="text-gray-600 mt-1">
              {filteredOrders.length} orders in transit
            </p>
          </div>

          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          {/* Filters */}
          <div className="flex items-center space-x-4 flex-grow">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by order ID, tracking number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={carrierFilter}
              onChange={(e) => setCarrierFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Carriers</option>
              <option value="FedEx">FedEx</option>
              <option value="UPS">UPS</option>
              <option value="DHL">DHL</option>
              <option value="India Post">India Post</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg ${
                viewMode === "table"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <Table className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`p-2 rounded-lg ${
                viewMode === "card"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Orders Display */}
        {isFetching ? (
          <div className="text-center py-12">
            <p>Loading shipped orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Truck className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Shipped Orders
            </h3>
            <p className="text-gray-600">No orders are currently in transit</p>
          </div>
        ) : viewMode === "table" ? (
          // Table View
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tracking #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shipped Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Est. Delivery
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600">
                          {order.orderNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.user?.name || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.user?.email || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.trackingNumber || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(order.shippedDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(order.estimatedDelivery)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.statusDisplay}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded-lg transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          // Card View
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-semibold text-blue-600">
                          {order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {order.user?.name || "N/A"} • {order.totalItems} items
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.statusDisplay}
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">
                        {formatCurrency(order.totalAmount)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {order.carrier || "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Tracking Information
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Tracking #:
                          </span>
                          <span className="text-sm font-mono text-blue-600">
                            {order.trackingNumber || "Not available"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Shipped:
                          </span>
                          <span className="text-sm text-gray-900">
                            {formatDate(order.shippedDate)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Est. Delivery:
                          </span>
                          <span className="text-sm text-gray-900">
                            {formatDate(order.estimatedDelivery)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Shipping Details
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Carrier:
                          </span>
                          <span className="text-sm text-gray-900">
                            {order.carrier || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Method:</span>
                          <span className="text-sm text-gray-900">
                            {order.shippingMethod || "Standard"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Destination
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                          <span className="text-sm text-gray-900">
                            {order.shippingAddress?.city},{" "}
                            {order.shippingAddress?.state}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.shippingAddress?.postalCode}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      {order.shippingMethod || "Standard"} •{" "}
                      {order.carrier || "N/A"}
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Track Package
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ShippedOrders;
