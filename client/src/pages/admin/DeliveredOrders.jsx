// src/pages/admin/DeliveredOrders.jsx
import {
  Award,
  CheckCircle,
  Clock,
  Eye,
  MessageSquare,
  RotateCcw,
  Search,
  Star,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useState } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";

const DeliveredOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const deliveredOrders = [
    {
      id: "#ORD-2024-016",
      customer: { name: "Jennifer Smith", email: "j.smith@email.com" },
      total: 156.99,
      deliveredDate: "2024-06-16T14:30:00",
      orderDate: "2024-06-14T10:15:00",
      items: 2,
      rating: 5,
      review:
        "Excellent products and fast delivery! Very satisfied with my purchase.",
      hasReview: true,
      deliveryTime: "3 days",
      carrier: "USPS",
    },
    {
      id: "#ORD-2024-017",
      customer: { name: "Michael Johnson", email: "m.johnson@email.com" },
      total: 89.5,
      deliveredDate: "2024-06-15T16:45:00",
      orderDate: "2024-06-13T09:30:00",
      items: 1,
      rating: 4,
      review: "Good quality product, packaging could be better.",
      hasReview: true,
      deliveryTime: "2 days",
      carrier: "UPS",
    },
    {
      id: "#ORD-2024-018",
      customer: { name: "Sarah Davis", email: "s.davis@email.com" },
      total: 299.99,
      deliveredDate: "2024-06-15T11:20:00",
      orderDate: "2024-06-12T14:45:00",
      items: 3,
      rating: null,
      review: null,
      hasReview: false,
      deliveryTime: "3 days",
      carrier: "DHL",
    },
  ];

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
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStars = (rating) => {
    if (!rating)
      return <span className="text-sm text-gray-500">No rating</span>;

    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating}/5)</span>
      </div>
    );
  };

  const filteredOrders = deliveredOrders.filter((order) => {
    const searchMatch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());

    const ratingMatch =
      ratingFilter === "all" ||
      (ratingFilter === "no_review" && !order.hasReview) ||
      (ratingFilter === "high" && order.rating >= 4) ||
      (ratingFilter === "low" && order.rating <= 3);

    return searchMatch && ratingMatch;
  });

  const averageRating =
    deliveredOrders
      .filter((order) => order.rating)
      .reduce((sum, order) => sum + order.rating, 0) /
    deliveredOrders.filter((order) => order.rating).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <CheckCircle className="w-8 h-8 mr-3 text-green-600" />
              Delivered Orders
            </h1>
            <p className="text-gray-600 mt-1">
              {filteredOrders.length} orders successfully delivered
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Delivered
                </p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {deliveredOrders.length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Average Rating
                </p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {averageRating ? averageRating.toFixed(1) : "N/A"}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  With Reviews
                </p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {deliveredOrders.filter((o) => o.hasReview).length}
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {formatCurrency(
                    deliveredOrders.reduce((sum, order) => sum + order.total, 0)
                  )}
                </p>
              </div>
              <Award className="w-8 h-8 text-purple-600" />
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
                placeholder="Search orders, customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Ratings</option>
              <option value="high">High Rating (4-5 stars)</option>
              <option value="low">Low Rating (1-3 stars)</option>
              <option value="no_review">No Review</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
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
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-blue-600">
                        {order.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Delivered to {order.customer.name} • {order.items} items
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">
                      {formatCurrency(order.total)}
                    </div>
                    <div className="text-sm text-gray-600">{order.carrier}</div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  {/* Delivery Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Delivery Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Ordered:</span>
                        <span className="text-sm text-gray-900">
                          {formatDate(order.orderDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Delivered:
                        </span>
                        <span className="text-sm text-gray-900">
                          {formatDate(order.deliveredDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Delivery Time:
                        </span>
                        <span className="text-sm font-medium text-green-600">
                          {order.deliveryTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Rating */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <Star className="w-4 h-4 mr-2" />
                      Customer Rating
                    </h4>
                    <div className="space-y-2">
                      {renderStars(order.rating)}
                      {!order.hasReview && (
                        <button className="text-sm text-blue-600 hover:text-blue-800">
                          Request Review
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Customer
                    </h4>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">
                        {order.customer.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.customer.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Customer Review */}
                {order.hasReview && order.review && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Customer Review
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {renderStars(order.rating)}
                          </div>
                          <p className="text-sm text-gray-700">
                            {order.review}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                            <ThumbsUp className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                            <ThumbsDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Delivered
                    </span>
                    {order.rating >= 4 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 mr-1" />
                        High Rating
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      Contact Customer
                    </button>
                    <button className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Process Return
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
        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Delivered Orders
            </h3>
            <p className="text-gray-600">
              No delivered orders match your current filters.
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default DeliveredOrders;
