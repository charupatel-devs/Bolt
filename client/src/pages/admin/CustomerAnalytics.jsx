// src/pages/admin/CustomerAnalytics.jsx
import {
  Calendar,
  DollarSign,
  Mail,
  MapPin,
  Search,
  ShoppingBag,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";

const CustomerAnalytics = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [segmentFilter, setSegmentFilter] = useState("all");

  const customers = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@email.com",
      totalOrders: 12,
      totalSpent: 2450.0,
      lastOrderDate: "2024-06-18",
      joinDate: "2024-02-15",
      segment: "premium",
      location: "New York, NY",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      totalOrders: 8,
      totalSpent: 1200.0,
      lastOrderDate: "2024-06-16",
      joinDate: "2024-03-20",
      segment: "regular",
      location: "Los Angeles, CA",
    },
    {
      id: 3,
      name: "Mike Davis",
      email: "mike.davis@email.com",
      totalOrders: 3,
      totalSpent: 450.0,
      lastOrderDate: "2024-06-10",
      joinDate: "2024-05-05",
      segment: "new",
      location: "Chicago, IL",
    },
    {
      id: 4,
      name: "Emily Chen",
      email: "emily.chen@email.com",
      totalOrders: 25,
      totalSpent: 4200.0,
      lastOrderDate: "2024-06-17",
      joinDate: "2024-01-10",
      segment: "vip",
      location: "San Francisco, CA",
    },
  ];

  const getSegmentColor = (segment) => {
    switch (segment) {
      case "vip":
        return "bg-purple-100 text-purple-800";
      case "premium":
        return "bg-blue-100 text-blue-800";
      case "regular":
        return "bg-green-100 text-green-800";
      case "new":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const searchMatch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const segmentMatch =
      segmentFilter === "all" || customer.segment === segmentFilter;
    return searchMatch && segmentMatch;
  });

  const totalCustomers = customers.length;
  const newCustomers = customers.filter((c) => c.segment === "new").length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const averageOrderValue =
    totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0);

  const customerSegments = [
    {
      name: "VIP",
      count: customers.filter((c) => c.segment === "vip").length,
      color: "purple",
    },
    {
      name: "Premium",
      count: customers.filter((c) => c.segment === "premium").length,
      color: "blue",
    },
    {
      name: "Regular",
      count: customers.filter((c) => c.segment === "regular").length,
      color: "green",
    },
    {
      name: "New",
      count: customers.filter((c) => c.segment === "new").length,
      color: "yellow",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Users className="w-8 h-8 mr-3 text-blue-600" />
              Customer Analytics
            </h1>
            <p className="text-gray-600 mt-1">
              Analyze customer behavior and segments
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Customers
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {totalCustomers}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  New Customers
                </p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {newCustomers}
                </p>
              </div>
              <UserPlus className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  ${totalRevenue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Order Value
                </p>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  ${averageOrderValue.toFixed(0)}
                </p>
              </div>
              <ShoppingBag className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Customer Segments */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Customer Segments
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {customerSegments.map((segment, index) => (
              <div key={index} className="text-center">
                <div
                  className={`w-16 h-16 mx-auto mb-2 rounded-full bg-${segment.color}-100 flex items-center justify-center`}
                >
                  <span
                    className={`text-2xl font-bold text-${segment.color}-600`}
                  >
                    {segment.count}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {segment.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={segmentFilter}
              onChange={(e) => setSegmentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Segments</option>
              <option value="vip">VIP</option>
              <option value="premium">Premium</option>
              <option value="regular">Regular</option>
              <option value="new">New</option>
            </select>
          </div>
        </div>

        {/* Customer Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Last Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Segment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {customer.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {customer.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {customer.totalOrders}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        ${customer.totalSpent.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {customer.lastOrderDate}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {customer.joinDate}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSegmentColor(
                          customer.segment
                        )}`}
                      >
                        {customer.segment}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                        {customer.location}
                      </div>
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

export default CustomerAnalytics;
