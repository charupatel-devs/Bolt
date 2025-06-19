// src/pages/admin/Refunds.jsx
import {
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Eye,
  RefreshCw,
  Search,
  User,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";

const Refunds = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const refunds = [
    {
      id: 1,
      refundId: "REF-2024-001",
      orderNumber: "ORD-2024-001",
      customer: "John Smith",
      customerEmail: "john.smith@email.com",
      amount: 89.99,
      reason: "Product damaged",
      status: "completed",
      requestDate: "2024-06-15",
      processedDate: "2024-06-16",
      paymentMethod: "Credit Card",
    },
    {
      id: 2,
      refundId: "REF-2024-002",
      orderNumber: "ORD-2024-002",
      customer: "Sarah Johnson",
      customerEmail: "sarah.j@email.com",
      amount: 45.5,
      reason: "Wrong item received",
      status: "pending",
      requestDate: "2024-06-17",
      processedDate: null,
      paymentMethod: "PayPal",
    },
    {
      id: 3,
      refundId: "REF-2024-003",
      orderNumber: "ORD-2024-003",
      customer: "Mike Davis",
      customerEmail: "mike.davis@email.com",
      amount: 120.0,
      reason: "Not as described",
      status: "processing",
      requestDate: "2024-06-16",
      processedDate: null,
      paymentMethod: "Credit Card",
    },
    {
      id: 4,
      refundId: "REF-2024-004",
      orderNumber: "ORD-2024-004",
      customer: "Emily Chen",
      customerEmail: "emily.chen@email.com",
      amount: 67.25,
      reason: "Defective product",
      status: "rejected",
      requestDate: "2024-06-14",
      processedDate: "2024-06-15",
      paymentMethod: "Apple Pay",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "processing":
        return <RefreshCw className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredRefunds = refunds.filter((refund) => {
    const searchMatch =
      refund.refundId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch =
      statusFilter === "all" || refund.status === statusFilter;
    return searchMatch && statusMatch;
  });

  const totalRefunds = refunds.length;
  const pendingRefunds = refunds.filter((r) => r.status === "pending").length;
  const completedRefunds = refunds.filter(
    (r) => r.status === "completed"
  ).length;
  const totalRefundAmount = refunds
    .filter((r) => r.status === "completed")
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <RefreshCw className="w-8 h-8 mr-3 text-blue-600" />
              Refunds
            </h1>
            <p className="text-gray-600 mt-1">
              Manage customer refund requests and processing
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Refunds
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {totalRefunds}
                </p>
              </div>
              <RefreshCw className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {pendingRefunds}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {completedRefunds}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Amount
                </p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  ${totalRefundAmount.toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search refunds..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Refunds Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Refund ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Request Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRefunds.map((refund) => (
                  <tr key={refund.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {refund.refundId}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-400" />
                          {refund.customer}
                        </div>
                        <div className="text-sm text-gray-500">
                          {refund.customerEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {refund.orderNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        ${refund.amount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {refund.reason}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 flex items-center">
                        <CreditCard className="w-4 h-4 mr-1 text-gray-400" />
                        {refund.paymentMethod}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          refund.status
                        )}`}
                      >
                        {getStatusIcon(refund.status)}
                        <span className="ml-1">{refund.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {refund.requestDate}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Refunds;
