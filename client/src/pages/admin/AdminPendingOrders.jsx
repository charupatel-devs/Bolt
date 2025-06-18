// src/pages/admin/PendingOrders.jsx
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Eye,
  MapPin,
  MoreHorizontal,
  Package,
  RefreshCw,
  Search,
  User,
} from "lucide-react";
import { useState } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";

const AdminPendingOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [ageFilter, setAgeFilter] = useState("all");

  // Sample pending orders data
  const pendingOrders = [
    {
      id: "#ORD-2024-001",
      customer: {
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "+1 (555) 123-4567",
      },
      items: 3,
      total: 299.97,
      paymentStatus: "paid",
      paymentMethod: "Credit Card",
      date: "2024-06-18T10:30:00",
      urgency: "high",
      estimatedProcessing: "2-4 hours",
      shippingAddress: "123 Main St, New York, NY 10001",
      shippingMethod: "Standard Shipping",
      notes: "Customer requested expedited processing",
      products: [
        { name: "Arduino Uno R3", quantity: 1, price: 25.99 },
        { name: "Breadboard Kit", quantity: 2, price: 12.99 },
        { name: "Jumper Wires Set", quantity: 1, price: 8.99 },
      ],
    },
    {
      id: "#ORD-2024-007",
      customer: {
        name: "Sarah Mitchell",
        email: "sarah.m@email.com",
        phone: "+1 (555) 234-5678",
      },
      items: 1,
      total: 89.99,
      paymentStatus: "paid",
      paymentMethod: "PayPal",
      date: "2024-06-18T09:15:00",
      urgency: "medium",
      estimatedProcessing: "1-2 hours",
      shippingAddress: "456 Oak Avenue, Los Angeles, CA 90210",
      shippingMethod: "Express Shipping",
      notes: "",
      products: [{ name: "Raspberry Pi 4 8GB", quantity: 1, price: 89.99 }],
    },
    {
      id: "#ORD-2024-008",
      customer: {
        name: "David Chen",
        email: "d.chen@company.com",
        phone: "+1 (555) 345-6789",
      },
      items: 5,
      total: 456.75,
      paymentStatus: "pending",
      paymentMethod: "Bank Transfer",
      date: "2024-06-18T08:45:00",
      urgency: "low",
      estimatedProcessing: "4-6 hours",
      shippingAddress: "789 Tech Park Dr, San Francisco, CA 94105",
      shippingMethod: "Standard Shipping",
      notes: "Bulk order for development team",
      products: [
        { name: "ESP32 Development Board", quantity: 3, price: 45.99 },
        { name: "Sensor Kit Pro", quantity: 1, price: 125.99 },
        { name: "LCD Display 16x2", quantity: 2, price: 19.99 },
        { name: "Power Supply Module", quantity: 1, price: 24.99 },
      ],
    },
    {
      id: "#ORD-2024-009",
      customer: {
        name: "Lisa Johnson",
        email: "lisa.j@email.com",
        phone: "+1 (555) 456-7890",
      },
      items: 2,
      total: 156.5,
      paymentStatus: "paid",
      paymentMethod: "Credit Card",
      date: "2024-06-17T16:20:00",
      urgency: "high",
      estimatedProcessing: "1 hour",
      shippingAddress: "321 Pine Street, Seattle, WA 98101",
      shippingMethod: "Overnight Shipping",
      notes: "Express processing requested",
      products: [
        { name: "STM32 Nucleo Board", quantity: 1, price: 35.5 },
        { name: "Development Shield", quantity: 1, price: 67.99 },
        { name: "USB Cable Set", quantity: 1, price: 12.99 },
      ],
    },
    {
      id: "#ORD-2024-010",
      customer: {
        name: "Robert Williams",
        email: "r.williams@email.com",
        phone: "+1 (555) 567-8901",
      },
      items: 1,
      total: 25.99,
      paymentStatus: "paid",
      paymentMethod: "Apple Pay",
      date: "2024-06-17T14:30:00",
      urgency: "medium",
      estimatedProcessing: "2-3 hours",
      shippingAddress: "654 Desert Road, Phoenix, AZ 85001",
      shippingMethod: "Standard Shipping",
      notes: "",
      products: [
        { name: "Temperature Sensor DHT22", quantity: 1, price: 25.99 },
      ],
    },
  ];

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffHours < 1) {
      return "Just now";
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const getOrderAge = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    return diffHours;
  };

  const filteredOrders = pendingOrders.filter((order) => {
    const searchMatch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());

    const priorityMatch =
      priorityFilter === "all" || order.urgency === priorityFilter;

    const ageMatch =
      ageFilter === "all" ||
      (ageFilter === "new" && getOrderAge(order.date) < 2) ||
      (ageFilter === "old" && getOrderAge(order.date) >= 24);

    return searchMatch && priorityMatch && ageMatch;
  });

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((order) => order.id));
    }
  };

  const handleProcessSelected = () => {
    // Process selected orders logic
    console.log("Processing orders:", selectedOrders);
    setSelectedOrders([]);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Clock className="w-8 h-8 mr-3 text-yellow-600" />
              Pending Orders
            </h1>
            <p className="text-gray-600 mt-1">
              {filteredOrders.length} orders waiting for processing
            </p>
          </div>

          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Package className="w-4 h-4 mr-2" />
              Process All
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Pending
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {pendingOrders.length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  High Priority
                </p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {pendingOrders.filter((o) => o.urgency === "high").length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Payment
                </p>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {
                    pendingOrders.filter((o) => o.paymentStatus === "pending")
                      .length
                  }
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {formatCurrency(
                    pendingOrders.reduce((sum, order) => sum + order.total, 0)
                  )}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Priority</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>

              <select
                value={ageFilter}
                onChange={(e) => setAgeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Orders</option>
                <option value="new">New ( 2 hours)</option>
                <option value="old">Old ( 24 hours)</option>
              </select>
            </div>

            {selectedOrders.length > 0 && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  {selectedOrders.length} selected
                </span>
                <button
                  onClick={handleProcessSelected}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Process Selected
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                      className="rounded"
                    />
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-blue-600">
                          {order.id}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getUrgencyColor(
                            order.urgency
                          )}`}
                        >
                          {order.urgency} priority
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(
                            order.paymentStatus
                          )}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Ordered {formatDate(order.date)} • Est. processing:{" "}
                        {order.estimatedProcessing}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-gray-900">
                      {formatCurrency(order.total)}
                    </span>
                    <div className="flex space-x-1">
                      <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-colors">
                        <Package className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Customer Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Customer Information
                    </h4>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-900">
                        {order.customer.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.customer.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.customer.phone}
                      </p>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Shipping Information
                    </h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-900">
                        {order.shippingMethod}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress}
                      </p>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Payment Information
                    </h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-900">
                        {order.paymentMethod}
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          order.paymentStatus === "paid"
                            ? "text-green-600"
                            : order.paymentStatus === "pending"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {order.paymentStatus === "paid"
                          ? "✓ Payment confirmed"
                          : order.paymentStatus === "pending"
                          ? "⏳ Payment pending"
                          : "✗ Payment failed"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Order Items ({order.items})
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2">
                      {order.products.map((product, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-600">
                              ×{product.quantity}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {product.name}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(product.price * product.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {order.notes && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </h4>
                    <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      {order.notes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Age: {getOrderAge(order.date)} hours • Priority:{" "}
                      {order.urgency}
                    </div>
                    <div className="flex space-x-3">
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        Contact Customer
                      </button>
                      <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                        Hold Order
                      </button>
                      <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Process Order
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Pending Orders
            </h3>
            <p className="text-gray-600">
              All orders have been processed or no orders match your filters.
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPendingOrders;
