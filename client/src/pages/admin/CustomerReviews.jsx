// src/pages/admin/CustomerReviews.jsx
import {
  Calendar,
  CheckCircle,
  Eye,
  Flag,
  MessageSquare,
  Reply,
  Search,
  Star,
  ThumbsUp,
} from "lucide-react";
import { useState } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";

const CustomerReviews = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("all");
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Sample reviews data
  const reviews = [
    {
      id: 1,
      customer: {
        name: "John Smith",
        email: "john.smith@email.com",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        verified: true,
      },
      product: {
        name: "Arduino Uno R3",
        image:
          "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=100&h=100&fit=crop",
        sku: "ARD-UNO-R3",
      },
      orderId: "#ORD-2024-001",
      rating: 5,
      title: "Excellent product and fast delivery!",
      comment:
        "This Arduino board works perfectly for my IoT projects. The quality is outstanding and it arrived quickly. Highly recommend for beginners and professionals alike.",
      date: "2024-06-15T14:30:00",
      status: "published",
      helpful: 12,
      reported: 0,
      adminReply: null,
      images: ["review1.jpg", "review2.jpg"],
    },
    {
      id: 2,
      customer: {
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=100&h=100&fit=crop&crop=face",
        verified: true,
      },
      product: {
        name: "Raspberry Pi 4 8GB",
        image:
          "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=100&h=100&fit=crop",
        sku: "RPI-4-8GB",
      },
      orderId: "#ORD-2024-002",
      rating: 4,
      title: "Good performance, minor packaging issues",
      comment:
        "The Raspberry Pi 4 performs excellently for my home automation setup. Only issue was the packaging could be better - the anti-static bag was slightly damaged.",
      date: "2024-06-14T09:15:00",
      status: "published",
      helpful: 8,
      reported: 1,
      adminReply: {
        message:
          "Thank you for your feedback! We are working with our packaging team to improve this.",
        date: "2024-06-14T16:20:00",
        author: "Support Team",
      },
      images: [],
    },
    {
      id: 3,
      customer: {
        name: "Michael Brown",
        email: "m.brown@company.com",
        avatar:
          "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
        verified: true,
      },
      product: {
        name: "ESP32 Development Board",
        image:
          "https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop",
        sku: "ESP32-DEV",
      },
      orderId: "#ORD-2024-003",
      rating: 2,
      title: "WiFi connectivity issues",
      comment:
        "Having trouble with WiFi connectivity. The board seems to disconnect frequently from my network. Tried multiple networks with same issue.",
      date: "2024-06-13T16:45:00",
      status: "pending",
      helpful: 3,
      reported: 2,
      adminReply: null,
      images: [],
    },
    {
      id: 4,
      customer: {
        name: "Emily Davis",
        email: "emily.davis@email.com",
        avatar:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
        verified: false,
      },
      product: {
        name: "STM32 Nucleo Board",
        image:
          "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=100&h=100&fit=crop",
        sku: "STM32-NUCLEO",
      },
      orderId: "#ORD-2024-004",
      rating: 5,
      title: "Perfect for advanced projects",
      comment:
        "This STM32 board is incredibly powerful and well-documented. Perfect for my embedded systems course. The IDE integration is seamless.",
      date: "2024-06-12T11:20:00",
      status: "published",
      helpful: 15,
      reported: 0,
      adminReply: null,
      images: [],
    },
    {
      id: 5,
      customer: {
        name: "Robert Wilson",
        email: "r.wilson@email.com",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        verified: true,
      },
      product: {
        name: "DHT22 Temperature Sensor",
        image:
          "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=100&h=100&fit=crop",
        sku: "DHT22-TEMP",
      },
      orderId: "#ORD-2024-005",
      rating: 1,
      title: "Defective sensor received",
      comment:
        "The sensor arrived completely non-functional. Tested with multiple boards and libraries but no response. Very disappointing.",
      date: "2024-06-11T13:30:00",
      status: "flagged",
      helpful: 1,
      reported: 0,
      adminReply: {
        message:
          "We sincerely apologize for this issue. A replacement has been shipped to you with expedited delivery.",
        date: "2024-06-11T15:45:00",
        author: "Customer Service",
      },
      images: ["defective_sensor.jpg"],
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "flagged":
        return "bg-red-100 text-red-800 border-red-200";
      case "hidden":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    return "text-red-600";
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
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const filteredReviews = reviews.filter((review) => {
    const searchMatch =
      review.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());

    const ratingMatch =
      ratingFilter === "all" ||
      (ratingFilter === "5" && review.rating === 5) ||
      (ratingFilter === "4" && review.rating === 4) ||
      (ratingFilter === "3" && review.rating === 3) ||
      (ratingFilter === "1-2" && review.rating <= 2);

    const statusMatch =
      statusFilter === "all" || review.status === statusFilter;
    const productMatch =
      productFilter === "all" || review.product.name === productFilter;

    return searchMatch && ratingMatch && statusMatch && productMatch;
  });

  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  const handleSelectReview = (reviewId) => {
    setSelectedReviews((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id) => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const handleSelectAll = () => {
    if (selectedReviews.length === paginatedReviews.length) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(paginatedReviews.map((review) => review.id));
    }
  };

  // Calculate stats
  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const totalReviews = reviews.length;
  const publishedReviews = reviews.filter(
    (r) => r.status === "published"
  ).length;
  const pendingReviews = reviews.filter((r) => r.status === "pending").length;
  const flaggedReviews = reviews.filter((r) => r.status === "flagged").length;

  const ratingDistribution = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  const uniqueProducts = [...new Set(reviews.map((r) => r.product.name))];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Star className="w-8 h-8 mr-3 text-yellow-600" />
              Customer Reviews
            </h1>
            <p className="text-gray-600 mt-1">
              Manage customer feedback and product reviews
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Reviews
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {totalReviews}
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Average Rating
                </p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {averageRating.toFixed(1)}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {publishedReviews}
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
                  {pendingReviews}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Flagged</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {flaggedReviews}
                </p>
              </div>
              <Flag className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Rating Distribution
          </h2>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingDistribution[rating];
              const percentage =
                totalReviews > 0 ? (count / totalReviews) * 100 : 0;

              return (
                <div key={rating} className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 w-20">
                    <span className="text-sm font-medium text-gray-700">
                      {rating}
                    </span>
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-sm text-gray-600">
                      {count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search reviews..."
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
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="1-2">1-2 Stars</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="pending">Pending</option>
                <option value="flagged">Flagged</option>
                <option value="hidden">Hidden</option>
              </select>

              <select
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Products</option>
                {uniqueProducts.map((product) => (
                  <option key={product} value={product}>
                    {product}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedReviews.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedReviews.length} review
                    {selectedReviews.length > 1 ? "s" : ""} selected
                  </span>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">
                      Approve
                    </button>
                    <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">
                      Hide
                    </button>
                    <button className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 transition-colors">
                      Flag
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedReviews([])}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Results Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
                  {Math.min(currentPage * itemsPerPage, filteredReviews.length)}{" "}
                  of {filteredReviews.length} results
                </span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1 border border-gray-200 rounded text-sm"
                >
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                  <option value={100}>100 per page</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedReviews.length === paginatedReviews.length &&
                        paginatedReviews.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Review
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedReviews.includes(review.id)}
                        onChange={() => handleSelectReview(review.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={review.customer.avatar}
                          alt={review.customer.name}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">
                              {review.customer.name}
                            </span>
                            {review.customer.verified && (
                              <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {review.customer.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={review.product.image}
                          alt={review.product.name}
                          className="w-10 h-10 rounded-lg mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {review.product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {review.product.sku}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                        <span
                          className={`text-sm font-medium ml-2 ${getRatingColor(
                            review.rating
                          )}`}
                        >
                          {review.rating}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {review.title}
                        </div>
                        <div className="text-sm text-gray-600 line-clamp-2">
                          {review.comment}
                        </div>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <ThumbsUp className="w-3 h-3 text-green-600" />
                            <span className="text-xs text-gray-500">
                              {review.helpful}
                            </span>
                          </div>
                          {review.reported > 0 && (
                            <div className="flex items-center space-x-1">
                              <Flag className="w-3 h-3 text-red-600" />
                              <span className="text-xs text-red-600">
                                {review.reported}
                              </span>
                            </div>
                          )}
                          {review.images.length > 0 && (
                            <span className="text-xs text-blue-600">
                              {review.images.length} image(s)
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                          review.status
                        )}`}
                      >
                        {review.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatDate(review.date)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {review.orderId}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-colors">
                          <Reply className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded-lg transition-colors">
                          <Flag className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <div className="flex space-x-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 text-sm rounded-lg ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Admin Replies Section */}
        <div className="space-y-4">
          {paginatedReviews
            .filter((review) => review.adminReply)
            .map((review) => (
              <div
                key={`reply-${review.id}`}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4"
              >
                <div className="flex items-start space-x-3">
                  <Reply className="w-5 h-5 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-900">
                        Admin Reply to {review.customer.name}'s review
                      </span>
                      <span className="text-sm text-blue-600">
                        {formatDate(review.adminReply.date)}
                      </span>
                    </div>
                    <p className="text-sm text-blue-800">
                      {review.adminReply.message}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      — {review.adminReply.author}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default CustomerReviews;
