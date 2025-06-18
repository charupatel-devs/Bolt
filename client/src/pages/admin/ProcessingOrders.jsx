// src/pages/admin/ProcessingOrders.jsx
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  MapPin,
  MoreHorizontal,
  Package,
  PauseCircle,
  PlayCircle,
  Search,
  Truck,
  User,
} from "lucide-react";
import { useState } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";

const ProcessingOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrders, setSelectedOrders] = useState([]);

  // Sample processing orders data
  const processingOrders = [
    {
      id: "#ORD-2024-011",
      customer: { name: "Alice Cooper", email: "alice.c@email.com" },
      items: 2,
      total: 178.5,
      startedProcessing: "2024-06-18T09:00:00",
      estimatedCompletion: "2024-06-18T14:00:00",
      currentStage: "picking",
      progress: 35,
      assignedTo: "Mark Johnson",
      priority: "high",
      shippingMethod: "Express",
      products: [
        {
          name: "Arduino Mega 2560",
          quantity: 1,
          status: "picked",
          location: "A-12",
        },
        {
          name: "Sensor Shield V5",
          quantity: 1,
          status: "picking",
          location: "B-45",
        },
      ],
      timeline: [
        { stage: "received", time: "2024-06-18T08:30:00", completed: true },
        { stage: "confirmed", time: "2024-06-18T08:45:00", completed: true },
        {
          stage: "picking",
          time: "2024-06-18T09:00:00",
          completed: false,
          current: true,
        },
        { stage: "packing", time: null, completed: false },
        { stage: "quality_check", time: null, completed: false },
        { stage: "ready_to_ship", time: null, completed: false },
      ],
    },
    {
      id: "#ORD-2024-012",
      customer: { name: "Bob Wilson", email: "bob.w@company.com" },
      items: 4,
      total: 334.99,
      startedProcessing: "2024-06-18T08:15:00",
      estimatedCompletion: "2024-06-18T16:00:00",
      currentStage: "packing",
      progress: 75,
      assignedTo: "Sarah Davis",
      priority: "medium",
      shippingMethod: "Standard",
      products: [
        {
          name: "Raspberry Pi 4 Kit",
          quantity: 1,
          status: "packed",
          location: "C-23",
        },
        {
          name: "MicroSD Card 64GB",
          quantity: 2,
          status: "packed",
          location: "D-12",
        },
        {
          name: "Power Adapter",
          quantity: 1,
          status: "packing",
          location: "E-34",
        },
      ],
      timeline: [
        { stage: "received", time: "2024-06-18T07:30:00", completed: true },
        { stage: "confirmed", time: "2024-06-18T07:45:00", completed: true },
        { stage: "picking", time: "2024-06-18T08:15:00", completed: true },
        {
          stage: "packing",
          time: "2024-06-18T10:30:00",
          completed: false,
          current: true,
        },
        { stage: "quality_check", time: null, completed: false },
        { stage: "ready_to_ship", time: null, completed: false },
      ],
    },
    {
      id: "#ORD-2024-013",
      customer: { name: "Carol Martinez", email: "carol.m@email.com" },
      items: 1,
      total: 89.99,
      startedProcessing: "2024-06-18T07:45:00",
      estimatedCompletion: "2024-06-18T12:00:00",
      currentStage: "quality_check",
      progress: 90,
      assignedTo: "Mike Brown",
      priority: "low",
      shippingMethod: "Standard",
      products: [
        {
          name: "ESP32 DevKit V1",
          quantity: 1,
          status: "quality_check",
          location: "QC-01",
        },
      ],
      timeline: [
        { stage: "received", time: "2024-06-18T07:00:00", completed: true },
        { stage: "confirmed", time: "2024-06-18T07:15:00", completed: true },
        { stage: "picking", time: "2024-06-18T07:45:00", completed: true },
        { stage: "packing", time: "2024-06-18T09:30:00", completed: true },
        {
          stage: "quality_check",
          time: "2024-06-18T11:00:00",
          completed: false,
          current: true,
        },
        { stage: "ready_to_ship", time: null, completed: false },
      ],
    },
    {
      id: "#ORD-2024-014",
      customer: { name: "David Kim", email: "d.kim@startup.com" },
      items: 6,
      total: 567.89,
      startedProcessing: "2024-06-17T16:30:00",
      estimatedCompletion: "2024-06-18T10:00:00",
      currentStage: "picking",
      progress: 25,
      assignedTo: "Lisa Chen",
      priority: "high",
      shippingMethod: "Overnight",
      products: [
        {
          name: "STM32 Development Board",
          quantity: 2,
          status: "picked",
          location: "F-67",
        },
        {
          name: "Breadboard Premium",
          quantity: 3,
          status: "picking",
          location: "G-12",
        },
        {
          name: "Component Kit Pro",
          quantity: 1,
          status: "pending",
          location: "H-89",
        },
      ],
      timeline: [
        { stage: "received", time: "2024-06-17T16:00:00", completed: true },
        { stage: "confirmed", time: "2024-06-17T16:15:00", completed: true },
        {
          stage: "picking",
          time: "2024-06-17T16:30:00",
          completed: false,
          current: true,
        },
        { stage: "packing", time: null, completed: false },
        { stage: "quality_check", time: null, completed: false },
        { stage: "ready_to_ship", time: null, completed: false },
      ],
    },
    {
      id: "#ORD-2024-015",
      customer: { name: "Emma Taylor", email: "emma.t@email.com" },
      items: 3,
      total: 245.67,
      startedProcessing: "2024-06-17T14:20:00",
      estimatedCompletion: "2024-06-18T11:00:00",
      currentStage: "ready_to_ship",
      progress: 100,
      assignedTo: "Tom Wilson",
      priority: "medium",
      shippingMethod: "Express",
      products: [
        {
          name: "LCD Display 20x4",
          quantity: 1,
          status: "ready",
          location: "SHIP-01",
        },
        {
          name: "I2C Module",
          quantity: 1,
          status: "ready",
          location: "SHIP-01",
        },
        {
          name: "Connecting Cables",
          quantity: 1,
          status: "ready",
          location: "SHIP-01",
        },
      ],
      timeline: [
        { stage: "received", time: "2024-06-17T14:00:00", completed: true },
        { stage: "confirmed", time: "2024-06-17T14:10:00", completed: true },
        { stage: "picking", time: "2024-06-17T14:20:00", completed: true },
        { stage: "packing", time: "2024-06-17T16:45:00", completed: true },
        {
          stage: "quality_check",
          time: "2024-06-18T08:30:00",
          completed: true,
        },
        {
          stage: "ready_to_ship",
          time: "2024-06-18T09:15:00",
          completed: true,
          current: true,
        },
      ],
    },
  ];

  const getStageColor = (stage, completed, current) => {
    if (completed) return "bg-green-100 text-green-800 border-green-200";
    if (current) return "bg-blue-100 text-blue-800 border-blue-200";
    return "bg-gray-100 text-gray-500 border-gray-200";
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
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

  const getProductStatusColor = (status) => {
    switch (status) {
      case "picked":
        return "text-green-600";
      case "packed":
        return "text-blue-600";
      case "quality_check":
        return "text-purple-600";
      case "ready":
        return "text-green-700";
      case "picking":
        return "text-yellow-600";
      case "packing":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatTime = (dateString) => {
    if (!dateString) return "Pending";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeRemaining = (estimatedCompletion) => {
    const now = new Date();
    const completion = new Date(estimatedCompletion);
    const diffHours = Math.ceil((completion - now) / (1000 * 60 * 60));

    if (diffHours < 0) return "Overdue";
    if (diffHours < 1) return "Due soon";
    return `${diffHours}h remaining`;
  };

  const filteredOrders = processingOrders.filter((order) => {
    const searchMatch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch =
      statusFilter === "all" || order.currentStage === statusFilter;

    return searchMatch && statusMatch;
  });

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const stageNames = {
    picking: "Picking Items",
    packing: "Packing",
    quality_check: "Quality Check",
    ready_to_ship: "Ready to Ship",
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Package className="w-8 h-8 mr-3 text-blue-600" />
              Processing Orders
            </h1>
            <p className="text-gray-600 mt-1">
              {filteredOrders.length} orders currently being processed
            </p>
          </div>

          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <BarChart3 className="w-4 h-4 mr-2" />
              Performance
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <PlayCircle className="w-4 h-4 mr-2" />
              Start Batch
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Processing
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {processingOrders.length}
                </p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  High Priority
                </p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {processingOrders.filter((o) => o.priority === "high").length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Ready to Ship
                </p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {
                    processingOrders.filter(
                      (o) => o.currentStage === "ready_to_ship"
                    ).length
                  }
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg. Progress
                </p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {Math.round(
                    processingOrders.reduce(
                      (sum, order) => sum + order.progress,
                      0
                    ) / processingOrders.length
                  )}
                  %
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600" />
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
                  placeholder="Search orders, customers, staff..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Stages</option>
                <option value="picking">Picking</option>
                <option value="packing">Packing</option>
                <option value="quality_check">Quality Check</option>
                <option value="ready_to_ship">Ready to Ship</option>
              </select>
            </div>

            {selectedOrders.length > 0 && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  {selectedOrders.length} selected
                </span>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Truck className="w-4 h-4 mr-2" />
                  Ship Selected
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className="p-6">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-6">
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
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(
                            order.priority
                          )}`}
                        >
                          {order.priority} priority
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStageColor(
                            order.currentStage,
                            false,
                            true
                          )}`}
                        >
                          {stageNames[order.currentStage]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Assigned to:{" "}
                        <span className="font-medium">{order.assignedTo}</span>{" "}
                        • Started: {formatTime(order.startedProcessing)} •
                        {getTimeRemaining(order.estimatedCompletion)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">
                        {formatCurrency(order.total)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {order.items} items
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Processing Progress
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {order.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${order.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Processing Timeline
                  </h4>
                  <div className="flex items-center space-x-4 overflow-x-auto pb-2">
                    {order.timeline.map((stage, index) => (
                      <div
                        key={stage.stage}
                        className="flex items-center space-x-2 min-w-0 flex-shrink-0"
                      >
                        <div
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getStageColor(
                            stage.stage,
                            stage.completed,
                            stage.current
                          )}`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              stage.completed
                                ? "bg-green-500"
                                : stage.current
                                ? "bg-blue-500"
                                : "bg-gray-300"
                            }`}
                          ></div>
                          <span className="text-xs font-medium capitalize">
                            {stage.stage.replace("_", " ")}
                          </span>
                          <span className="text-xs">
                            {formatTime(stage.time)}
                          </span>
                        </div>
                        {index < order.timeline.length - 1 && (
                          <ArrowRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Customer & Shipping */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Customer & Shipping
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Customer:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {order.customer.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className="text-sm text-gray-900">
                          {order.customer.email}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Shipping:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {order.shippingMethod}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Products */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <Package className="w-4 h-4 mr-2" />
                      Products ({order.items} items)
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      {order.products.map((product, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            <span className="text-sm text-gray-600">
                              ×{product.quantity}
                            </span>
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({product.location})
                            </span>
                          </div>
                          <span
                            className={`text-xs font-medium ${getProductStatusColor(
                              product.status
                            )} capitalize`}
                          >
                            {product.status.replace("_", " ")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Est. completion:{" "}
                          {formatTime(order.estimatedCompletion)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Current stage: {stageNames[order.currentStage]}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        <PauseCircle className="w-4 h-4 mr-2 inline" />
                        Hold
                      </button>
                      <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                        Update Status
                      </button>
                      {order.currentStage === "ready_to_ship" ? (
                        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          <Truck className="w-4 h-4 mr-2" />
                          Ship Now
                        </button>
                      ) : (
                        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Advance Stage
                        </button>
                      )}
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
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Processing Orders
            </h3>
            <p className="text-gray-600">
              No orders are currently being processed or match your filters.
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProcessingOrders;
