// src/pages/admin/PurchaseOrders.jsx
import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Plus,
  Search,
  ShoppingCart,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";

const PurchaseOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const purchaseOrders = [
    {
      id: 1,
      orderNumber: "PO-2024-001",
      supplier: "TechParts Supply Co",
      date: "2024-06-18",
      items: 5,
      totalAmount: 2450.0,
      status: "pending",
      expectedDelivery: "2024-06-25",
    },
    {
      id: 2,
      orderNumber: "PO-2024-002",
      supplier: "Electronic Components Ltd",
      date: "2024-06-17",
      items: 3,
      totalAmount: 1200.0,
      status: "delivered",
      expectedDelivery: "2024-06-20",
    },
    {
      id: 3,
      orderNumber: "PO-2024-003",
      supplier: "Global Hardware Solutions",
      date: "2024-06-16",
      items: 8,
      totalAmount: 3800.0,
      status: "cancelled",
      expectedDelivery: "2024-06-22",
    },
    {
      id: 4,
      orderNumber: "PO-2024-004",
      supplier: "TechParts Supply Co",
      date: "2024-06-15",
      items: 2,
      totalAmount: 850.0,
      status: "shipped",
      expectedDelivery: "2024-06-19",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "shipped":
        return <ShoppingCart className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredOrders = purchaseOrders.filter((order) => {
    const searchMatch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === "all" || order.status === statusFilter;
    return searchMatch && statusMatch;
  });

  const totalOrders = purchaseOrders.length;
  const pendingOrders = purchaseOrders.filter(
    (o) => o.status === "pending"
  ).length;
  const totalValue = purchaseOrders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <ShoppingCart className="w-8 h-8 mr-3 text-blue-600" />
              Purchase Orders
            </h1>
            <p className="text-gray-600 mt-1">
              Manage purchase orders and deliveries
            </p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            New Order
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {totalOrders}
                </p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {pendingOrders}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  ${totalValue.toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {
                    purchaseOrders.filter((o) => o.date.includes("2024-06"))
                      .length
                  }
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
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
                placeholder="Search orders..."
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
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Order Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Supplier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Expected Delivery
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {order.supplier}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{order.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{order.items}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {order.expectedDelivery}
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

export default PurchaseOrders;
