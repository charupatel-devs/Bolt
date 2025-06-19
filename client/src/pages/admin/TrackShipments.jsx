// src/pages/admin/TrackShipments.jsx
import {
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  MapPin,
  Package,
  Search,
  Truck,
  User,
} from "lucide-react";
import { useState } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";

const TrackShipments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const shipments = [
    {
      id: 1,
      trackingNumber: "1Z999AA1234567890",
      orderNumber: "ORD-2024-001",
      customer: "John Smith",
      destination: "New York, NY",
      carrier: "UPS",
      status: "delivered",
      shippedDate: "2024-06-15",
      estimatedDelivery: "2024-06-18",
      actualDelivery: "2024-06-18",
    },
    {
      id: 2,
      trackingNumber: "9405511206213175269584",
      orderNumber: "ORD-2024-002",
      customer: "Sarah Johnson",
      destination: "Los Angeles, CA",
      carrier: "USPS",
      status: "in_transit",
      shippedDate: "2024-06-16",
      estimatedDelivery: "2024-06-20",
      actualDelivery: null,
    },
    {
      id: 3,
      trackingNumber: "770570776439",
      orderNumber: "ORD-2024-003",
      customer: "Mike Davis",
      destination: "Chicago, IL",
      carrier: "FedEx",
      status: "pending",
      shippedDate: null,
      estimatedDelivery: "2024-06-22",
      actualDelivery: null,
    },
    {
      id: 4,
      trackingNumber: "1Z999AA1234567891",
      orderNumber: "ORD-2024-004",
      customer: "Emily Chen",
      destination: "San Francisco, CA",
      carrier: "UPS",
      status: "shipped",
      shippedDate: "2024-06-17",
      estimatedDelivery: "2024-06-19",
      actualDelivery: null,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "in_transit":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "shipped":
        return <Package className="w-4 h-4" />;
      case "in_transit":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredShipments = shipments.filter((shipment) => {
    const searchMatch =
      shipment.trackingNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      shipment.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch =
      statusFilter === "all" || shipment.status === statusFilter;
    return searchMatch && statusMatch;
  });

  const totalShipments = shipments.length;
  const inTransit = shipments.filter((s) => s.status === "in_transit").length;
  const delivered = shipments.filter((s) => s.status === "delivered").length;
  const pending = shipments.filter((s) => s.status === "pending").length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Package className="w-8 h-8 mr-3 text-blue-600" />
              Track Shipments
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor shipment status and delivery tracking
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Shipments
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {totalShipments}
                </p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {inTransit}
                </p>
              </div>
              <Truck className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {delivered}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {pending}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
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
                placeholder="Search by tracking number, order, or customer..."
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
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>

        {/* Shipments Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tracking Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Destination
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Carrier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Shipped Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Est. Delivery
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {shipment.trackingNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {shipment.orderNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        {shipment.customer}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        {shipment.destination}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {shipment.carrier}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          shipment.status
                        )}`}
                      >
                        {getStatusIcon(shipment.status)}
                        <span className="ml-1">
                          {shipment.status.replace("_", " ")}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {shipment.shippedDate || "Not shipped"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {shipment.estimatedDelivery}
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

export default TrackShipments;
