// src/pages/admin/ShippedOrders.jsx
import {
  AlertTriangle,
  Download,
  ExternalLink,
  Eye,
  MapPin,
  Package,
  Search,
  Truck,
} from "lucide-react";
import { useState } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";

const ShippedOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [carrierFilter, setCarrierFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const shippedOrders = [
    {
      id: "#ORD-2024-020",
      customer: {
        name: "John Adams",
        email: "j.adams@email.com",
        phone: "+1 (555) 123-4567",
      },
      total: 234.99,
      shippedDate: "2024-06-17T14:30:00",
      estimatedDelivery: "2024-06-19T17:00:00",
      trackingNumber: "TRK789456123",
      carrier: "FedEx",
      shippingMethod: "Express",
      currentLocation: "Distribution Center - Chicago, IL",
      status: "in_transit",
      items: 3,
      destination: "New York, NY 10001",
    },
    {
      id: "#ORD-2024-021",
      customer: {
        name: "Maria Garcia",
        email: "m.garcia@email.com",
        phone: "+1 (555) 234-5678",
      },
      total: 89.5,
      shippedDate: "2024-06-17T10:15:00",
      estimatedDelivery: "2024-06-20T16:00:00",
      trackingNumber: "UPS567890123",
      carrier: "UPS",
      shippingMethod: "Standard",
      currentLocation: "Out for Delivery - Los Angeles, CA",
      status: "out_for_delivery",
      items: 1,
      destination: "Los Angeles, CA 90210",
    },
    {
      id: "#ORD-2024-022",
      customer: {
        name: "David Wilson",
        email: "d.wilson@company.com",
        phone: "+1 (555) 345-6789",
      },
      total: 456.78,
      shippedDate: "2024-06-16T16:45:00",
      estimatedDelivery: "2024-06-18T12:00:00",
      trackingNumber: "DHL345678901",
      carrier: "DHL",
      shippingMethod: "Overnight",
      currentLocation: "Local Facility - San Francisco, CA",
      status: "delayed",
      items: 5,
      destination: "San Francisco, CA 94105",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "in_transit":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "out_for_delivery":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delayed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Truck className="w-8 h-8 mr-3 text-purple-600" />
              Shipped Orders
            </h1>
            <p className="text-gray-600 mt-1">Track orders in transit</p>
          </div>

          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
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
              <option value="USPS">USPS</option>
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
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {shippedOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-600">
                        {order.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {order.customer.name} • {order.items} items
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status === "in_transit" && (
                        <Truck className="w-3 h-3 mr-1" />
                      )}
                      {order.status === "out_for_delivery" && (
                        <Package className="w-3 h-3 mr-1" />
                      )}
                      {order.status === "delayed" && (
                        <AlertTriangle className="w-3 h-3 mr-1" />
                      )}
                      {order.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">
                      {formatCurrency(order.total)}
                    </div>
                    <div className="text-sm text-gray-600">{order.carrier}</div>
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
                          {order.trackingNumber}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Shipped:</span>
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
                      Current Location
                    </h4>
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                      <span className="text-sm text-gray-900">
                        {order.currentLocation}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Destination
                    </h4>
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                      <span className="text-sm text-gray-900">
                        {order.destination}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    {order.shippingMethod} • {order.carrier}
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
      </div>
    </AdminLayout>
  );
};

export default ShippedOrders;
