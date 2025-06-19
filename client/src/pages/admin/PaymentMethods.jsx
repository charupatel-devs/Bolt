// src/pages/admin/PaymentMethods.jsx
import {
  CreditCard,
  Edit,
  Percent,
  Plus,
  Search,
  Shield,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";

const PaymentMethods = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const paymentMethods = [
    {
      id: 1,
      name: "Credit/Debit Cards",
      provider: "Stripe",
      description: "Accept all major credit and debit cards",
      transactionFee: 2.9,
      fixedFee: 0.3,
      isActive: true,
      icon: "💳",
      acceptedCards: ["Visa", "Mastercard", "American Express"],
    },
    {
      id: 2,
      name: "PayPal",
      provider: "PayPal",
      description: "Accept payments through PayPal",
      transactionFee: 3.49,
      fixedFee: 0.49,
      isActive: true,
      icon: "💰",
      acceptedCards: ["PayPal Account", "PayPal Credit"],
    },
    {
      id: 3,
      name: "Apple Pay",
      provider: "Apple",
      description: "Accept payments through Apple Pay",
      transactionFee: 2.9,
      fixedFee: 0.3,
      isActive: true,
      icon: "🍎",
      acceptedCards: ["Apple Pay"],
    },
    {
      id: 4,
      name: "Google Pay",
      provider: "Google",
      description: "Accept payments through Google Pay",
      transactionFee: 2.9,
      fixedFee: 0.3,
      isActive: false,
      icon: "🏪",
      acceptedCards: ["Google Pay"],
    },
    {
      id: 5,
      name: "Bank Transfer",
      provider: "ACH",
      description: "Direct bank transfers",
      transactionFee: 0.8,
      fixedFee: 0.0,
      isActive: true,
      icon: "🏦",
      acceptedCards: ["Bank Account"],
    },
  ];

  const filteredMethods = paymentMethods.filter((method) =>
    method.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeMethods = paymentMethods.filter((m) => m.isActive).length;
  const averageFee = (
    paymentMethods.reduce((sum, m) => sum + m.transactionFee, 0) /
    paymentMethods.length
  ).toFixed(2);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <CreditCard className="w-8 h-8 mr-3 text-blue-600" />
              Payment Methods
            </h1>
            <p className="text-gray-600 mt-1">
              Configure payment options and processing fees
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
                  {paymentMethods.length}
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-600" />
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
              <Shield className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Fee Rate
                </p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {averageFee}%
                </p>
              </div>
              <Percent className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search payment methods..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Payment Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMethods.map((method) => (
            <div
              key={method.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{method.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {method.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      via {method.provider}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {method.isActive ? (
                    <ToggleRight className="w-6 h-6 text-green-500" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{method.description}</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Transaction Fee:
                  </span>
                  <div className="flex items-center">
                    <Percent className="w-4 h-4 text-blue-600 mr-1" />
                    <span className="text-sm font-semibold text-gray-900">
                      {method.transactionFee}% + ${method.fixedFee}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Accepted:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {method.acceptedCards.map((card, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {card}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      method.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {method.isActive ? "Active" : "Inactive"}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
                      <Trash2 className="w-4 h-4" />
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

export default PaymentMethods;
