// src/pages/admin/Returns.jsx
import {
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Eye,
  FileText,
  MessageSquare,
  Package,
  RotateCcw,
  Search,
  User,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";

const Returns = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reasonFilter, setReasonFilter] = useState("all");
  const [selectedReturns, setSelectedReturns] = useState([]);

  const returns = [
    {
      id: "#RET-2024-001",
      orderId: "#ORD-2024-025",
      customer: {
        name: "Alice Johnson",
        email: "alice.j@email.com",
        phone: "+1 (555) 123-4567",
      },
      requestDate: "2024-06-17T10:30:00",
      reason: "defective",
      status: "pending_approval",
      refundAmount: 89.99,
      returnedItems: [
        {
          name: "Arduino Uno R3",
          quantity: 1,
          condition: "defective",
          refundAmount: 89.99,
        },
      ],
      description:
        "Product arrived with damaged USB connector. Cannot establish connection to computer.",
      images: ["defect1.jpg", "defect2.jpg"],
      customerNote:
        "The USB port seems to be physically damaged during shipping.",
      priority: "high",
    },
    {
      id: "#RET-2024-002",
      orderId: "#ORD-2024-026",
      customer: {
        name: "Bob Smith",
        email: "b.smith@email.com",
        phone: "+1 (555) 234-5678",
      },
      requestDate: "2024-06-16T14:20:00",
      reason: "wrong_item",
      status: "approved",
      refundAmount: 156.5,
      returnedItems: [
        {
          name: "Raspberry Pi 4 8GB",
          quantity: 1,
          condition: "unopened",
          refundAmount: 156.5,
        },
      ],
      description:
        "Customer ordered Raspberry Pi 4 4GB but received 8GB model.",
      images: [],
      customerNote: "I need the 4GB model specifically for my project budget.",
      priority: "medium",
    },
    {
      id: "#RET-2024-003",
      orderId: "#ORD-2024-027",
      customer: {
        name: "Carol Williams",
        email: "c.williams@email.com",
        phone: "+1 (555) 345-6789",
      },
      requestDate: "2024-06-15T16:45:00",
      reason: "not_as_described",
      status: "processing",
      refundAmount: 45.99,
      returnedItems: [
        {
          name: "LCD Display 16x2",
          quantity: 1,
          condition: "used",
          refundAmount: 35.99,
        },
        {
          name: "I2C Backpack",
          quantity: 1,
          condition: "unopened",
          refundAmount: 10.0,
        },
      ],
      description:
        "LCD display quality is much lower than described. Backlight is very dim.",
      images: ["lcd_issue.jpg"],
      customerNote: "The display is barely readable even at full brightness.",
      priority: "low",
    },
    {
      id: "#RET-2024-004",
      orderId: "#ORD-2024-028",
      customer: {
        name: "David Brown",
        email: "d.brown@email.com",
        phone: "+1 (555) 456-7890",
      },
      requestDate: "2024-06-14T11:15:00",
      reason: "changed_mind",
      status: "completed",
      refundAmount: 234.75,
      returnedItems: [
        {
          name: "STM32 Development Kit",
          quantity: 1,
          condition: "unopened",
          refundAmount: 234.75,
        },
      ],
      description:
        "Customer decided to go with a different development platform.",
      images: [],
      customerNote: "Decided to use Arduino instead for my project.",
      priority: "low",
    },
    {
      id: "#RET-2024-005",
      orderId: "#ORD-2024-029",
      customer: {
        name: "Emma Davis",
        email: "e.davis@email.com",
        phone: "+1 (555) 567-8901",
      },
      requestDate: "2024-06-13T09:30:00",
      reason: "defective",
      status: "rejected",
      refundAmount: 0,
      returnedItems: [
        {
          name: "Sensor Kit Pro",
          quantity: 1,
          condition: "damaged_by_user",
          refundAmount: 0,
        },
      ],
      description: "Multiple sensors in kit not working properly.",
      images: ["sensor_damage.jpg"],
      customerNote: "Several sensors stopped working after a few days of use.",
      priority: "medium",
      rejectionReason: "Evidence of user damage found on components",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "pending_approval":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "approved":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getReasonColor = (reason) => {
    switch (reason) {
      case "defective":
        return "bg-red-100 text-red-800";
      case "wrong_item":
        return "bg-orange-100 text-orange-800";
      case "not_as_described":
        return "bg-yellow-100 text-yellow-800";
      case "changed_mind":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending_approval":
        return <Clock className="w-4 h-4" />;
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "processing":
        return <Package className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <RotateCcw className="w-4 h-4" />;
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

  const getReasonText = (reason) => {
    switch (reason) {
      case "defective":
        return "Defective Item";
      case "wrong_item":
        return "Wrong Item";
      case "not_as_described":
        return "Not as Described";
      case "changed_mind":
        return "Changed Mind";
      default:
        return "Other";
    }
  };

  const filteredReturns = returns.filter((returnItem) => {
    const searchMatch =
      returnItem.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.customer.name.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch =
      statusFilter === "all" || returnItem.status === statusFilter;
    const reasonMatch =
      reasonFilter === "all" || returnItem.reason === reasonFilter;

    return searchMatch && statusMatch && reasonMatch;
  });

  const handleSelectReturn = (returnId) => {
    setSelectedReturns((prev) =>
      prev.includes(returnId)
        ? prev.filter((id) => id !== returnId)
        : [...prev, returnId]
    );
  };

  const pendingCount = returns.filter(
    (r) => r.status === "pending_approval"
  ).length;
  const totalRefunds = returns
    .filter((r) => r.status === "completed")
    .reduce((sum, r) => sum + r.refundAmount, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <RotateCcw className="w-8 h-8 mr-3 text-orange-600" />
              Returns Management
            </h1>
            <p className="text-gray-600 mt-1">
              {filteredReturns.length} return requests • {pendingCount} pending
              approval
            </p>
          </div>

          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <FileText className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Approval
                </p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {pendingCount}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {returns.filter((r) => r.status === "processing").length}
                </p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {returns.filter((r) => r.status === "completed").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Refunds
                </p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {formatCurrency(totalRefunds)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-red-600" />
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
                  placeholder="Search returns, orders, customers..."
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
                <option value="all">All Status</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={reasonFilter}
                onChange={(e) => setReasonFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Reasons</option>
                <option value="defective">Defective</option>
                <option value="wrong_item">Wrong Item</option>
                <option value="not_as_described">Not as Described</option>
                <option value="changed_mind">Changed Mind</option>
              </select>
            </div>

            {selectedReturns.length > 0 && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  {selectedReturns.length} selected
                </span>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Bulk Action
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Returns List */}
        <div className="space-y-4">
          {filteredReturns.map((returnItem) => (
            <div
              key={returnItem.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Return Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedReturns.includes(returnItem.id)}
                      onChange={() => handleSelectReturn(returnItem.id)}
                      className="rounded"
                    />
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-blue-600">
                          {returnItem.id}
                        </h3>
                        <span className="text-sm text-gray-600">
                          from {returnItem.orderId}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                            returnItem.status
                          )}`}
                        >
                          {getStatusIcon(returnItem.status)}
                          <span className="ml-1 capitalize">
                            {returnItem.status.replace("_", " ")}
                          </span>
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(
                            returnItem.priority
                          )}`}
                        >
                          {returnItem.priority} priority
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Requested {formatDate(returnItem.requestDate)} by{" "}
                        {returnItem.customer.name}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">
                      {formatCurrency(returnItem.refundAmount)}
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getReasonColor(
                        returnItem.reason
                      )}`}
                    >
                      {getReasonText(returnItem.reason)}
                    </span>
                  </div>
                </div>

                {/* Return Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  {/* Customer Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Customer Information
                    </h4>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-900">
                        {returnItem.customer.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {returnItem.customer.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        {returnItem.customer.phone}
                      </p>
                    </div>
                  </div>

                  {/* Return Reason */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Return Details
                    </h4>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-900">
                        {getReasonText(returnItem.reason)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {returnItem.description}
                      </p>
                      {returnItem.images.length > 0 && (
                        <p className="text-sm text-blue-600">
                          {returnItem.images.length} image(s) attached
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Refund Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Refund Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Refund Amount:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(returnItem.refundAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Items:</span>
                        <span className="text-sm text-gray-900">
                          {returnItem.returnedItems.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Returned Items */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Package className="w-4 h-4 mr-2" />
                    Returned Items
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      {returnItem.returnedItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-600">
                              ×{item.quantity}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {item.name}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                item.condition === "unopened"
                                  ? "bg-green-100 text-green-800"
                                  : item.condition === "used"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : item.condition === "defective"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {item.condition.replace("_", " ")}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(item.refundAmount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Customer Note */}
                {returnItem.customerNote && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Customer Note
                    </h4>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        {returnItem.customerNote}
                      </p>
                    </div>
                  </div>
                )}

                {/* Rejection Reason */}
                {returnItem.status === "rejected" &&
                  returnItem.rejectionReason && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Rejection Reason
                      </h4>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">
                          {returnItem.rejectionReason}
                        </p>
                      </div>
                    </div>
                  )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      Status: {returnItem.status.replace("_", " ")} • Reason:{" "}
                      {getReasonText(returnItem.reason)} • Priority:{" "}
                      {returnItem.priority}
                    </span>
                  </div>

                  <div className="flex space-x-3">
                    {returnItem.status === "pending_approval" && (
                      <>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                          Reject
                        </button>
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          Approve
                        </button>
                      </>
                    )}

                    {returnItem.status === "approved" && (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Start Processing
                      </button>
                    )}

                    {returnItem.status === "processing" && (
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Complete Return
                      </button>
                    )}

                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      Contact Customer
                    </button>

                    <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredReturns.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <RotateCcw className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Returns Found
            </h3>
            <p className="text-gray-600">
              No return requests match your current filters.
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Returns;
