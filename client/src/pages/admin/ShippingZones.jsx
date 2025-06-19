// src/pages/admin/ShippingZones.jsx
import {
  DollarSign,
  Edit,
  Globe,
  Map,
  MapPin,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";

const ShippingZones = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const shippingZones = [
    {
      id: 1,
      name: "Domestic USA",
      description: "All 50 states within the United States",
      countries: ["United States"],
      regions: ["All States"],
      shippingCost: 9.99,
      freeShippingThreshold: 50.0,
      isActive: true,
    },
    {
      id: 2,
      name: "Canada",
      description: "All provinces in Canada",
      countries: ["Canada"],
      regions: ["All Provinces"],
      shippingCost: 19.99,
      freeShippingThreshold: 100.0,
      isActive: true,
    },
    {
      id: 3,
      name: "Europe Zone",
      description: "Major European countries",
      countries: ["United Kingdom", "Germany", "France", "Italy", "Spain"],
      regions: ["EU Countries"],
      shippingCost: 29.99,
      freeShippingThreshold: 150.0,
      isActive: true,
    },
    {
      id: 4,
      name: "Asia Pacific",
      description: "Selected Asian countries",
      countries: ["Japan", "Australia", "Singapore"],
      regions: ["APAC"],
      shippingCost: 39.99,
      freeShippingThreshold: 200.0,
      isActive: false,
    },
  ];

  const filteredZones = shippingZones.filter((zone) =>
    zone.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeZones = shippingZones.filter((z) => z.isActive).length;
  const totalCountries = [...new Set(shippingZones.flatMap((z) => z.countries))]
    .length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <MapPin className="w-8 h-8 mr-3 text-blue-600" />
              Shipping Zones
            </h1>
            <p className="text-gray-600 mt-1">
              Configure shipping zones and regional rates
            </p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Zone
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Zones</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {shippingZones.length}
                </p>
              </div>
              <Map className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Zones
                </p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {activeZones}
                </p>
              </div>
              <Globe className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Countries Covered
                </p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {totalCountries}
                </p>
              </div>
              <MapPin className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search shipping zones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Zones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredZones.map((zone) => (
            <div
              key={zone.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <MapPin className="w-6 h-6 text-blue-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {zone.name}
                    </h3>
                    <p className="text-sm text-gray-600">{zone.description}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    zone.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {zone.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Countries:
                  </p>
                  <p className="text-sm text-gray-600">
                    {zone.countries.join(", ")}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Shipping Cost:
                    </p>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm font-semibold text-gray-900">
                        ${zone.shippingCost.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Free Shipping:
                    </p>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-blue-600 mr-1" />
                      <span className="text-sm text-gray-900">
                        ${zone.freeShippingThreshold.toFixed(2)}+
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
                <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ShippingZones;
