// src/pages/admin/ShippingMethods.jsx
import {
  Clock,
  DollarSign,
  Edit,
  MapPin,
  Plus,
  Search,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Truck,
} from "lucide-react";
import { useState } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";

const ShippingMethods = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const shippingMethods = [
    {
      id: 1,
      name: "Standard Shipping",
      description: "Regular delivery within 5-7 business days",
      cost: 9.99,
      estimatedDays: "5-7",
      isActive: true,
      provider: "USPS",
    },
    {
      id: 2,
      name: "Express Shipping",
      description: "Fast delivery within 2-3 business days",
      cost: 19.99,
      estimatedDays: "2-3",
      isActive: true,
      provider: "FedEx",
    },
    {
      id: 3,
      name: "Overnight Shipping",
      description: "Next day delivery",
      cost: 34.99,
      estimatedDays: "1",
      isActive: true,
      provider: "UPS",
    },
    {
      id: 4,
      name: "Free Shipping",
      description: "Free delivery for orders over $50",
      cost: 0.0,
      estimatedDays: "7-10",
      isActive: false,
      provider: "USPS",
    },
  ];

  const filteredMethods = shippingMethods.filter((method) =>
    method.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeMethods = shippingMethods.filter((m) => m.isActive).length;
  const averageCost = (
    shippingMethods.reduce((sum, m) => sum + m.cost, 0) / shippingMethods.length
  ).toFixed(2);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Truck className="w-8 h-8 mr-3 text-blue-600" />
              Shipping Methods
            </h1>
            <p className="text-gray-600 mt-1">
              Configure shipping options and rates
            </p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Method
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Methods
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {shippingMethods.length}
                </p>
              </div>
              <Truck className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Methods
                </p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {activeMethods}
                </p>
              </div>
              <MapPin className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Average Cost
                </p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  ${averageCost}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search shipping methods..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Methods Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Provider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Delivery Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMethods.map((method) => (
                  <tr key={method.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {method.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {method.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {method.provider}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        ${method.cost.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-gray-400" />
                        {method.estimatedDays} days
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {method.isActive ? (
                          <ToggleRight className="w-6 h-6 text-green-500" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-gray-400" />
                        )}
                        <span
                          className={`ml-2 text-sm ${
                            method.isActive ? "text-green-600" : "text-gray-500"
                          }`}
                        >
                          {method.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
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

export default ShippingMethods;
