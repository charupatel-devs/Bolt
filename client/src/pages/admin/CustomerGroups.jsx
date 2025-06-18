// src/pages/admin/CustomerGroups.jsx
import {
  Crown,
  DollarSign,
  Edit,
  Eye,
  Gift,
  Mail,
  MoreHorizontal,
  Percent,
  Plus,
  Search,
  Star,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";

const CustomerGroups = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    type: "manual",
    color: "blue",
    criteria: {
      minOrders: "",
      minSpent: "",
      location: "",
      joinedBefore: "",
      joinedAfter: "",
    },
    benefits: {
      discount: "",
      freeShipping: false,
      prioritySupport: false,
      earlyAccess: false,
    },
  });

  // Sample customer groups data
  const customerGroups = [
    {
      id: 1,
      name: "VIP Customers",
      description: "High-value customers with premium benefits",
      type: "automatic",
      color: "purple",
      memberCount: 23,
      totalSpent: 45678.9,
      averageOrderValue: 234.56,
      criteria: {
        minSpent: 2000,
        minOrders: 10,
      },
      benefits: {
        discount: 15,
        freeShipping: true,
        prioritySupport: true,
        earlyAccess: true,
      },
      createdDate: "2023-01-15",
      lastUpdated: "2024-05-20",
    },
    {
      id: 2,
      name: "Business Accounts",
      description: "Corporate and business customers",
      type: "manual",
      color: "blue",
      memberCount: 45,
      totalSpent: 123456.78,
      averageOrderValue: 567.89,
      criteria: {
        accountType: "business",
      },
      benefits: {
        discount: 20,
        freeShipping: true,
        prioritySupport: true,
        earlyAccess: false,
      },
      createdDate: "2023-02-10",
      lastUpdated: "2024-06-01",
    },
    {
      id: 3,
      name: "Frequent Buyers",
      description: "Customers who order regularly",
      type: "automatic",
      color: "green",
      memberCount: 67,
      totalSpent: 34567.12,
      averageOrderValue: 89.45,
      criteria: {
        minOrders: 5,
        timeframe: "3 months",
      },
      benefits: {
        discount: 10,
        freeShipping: false,
        prioritySupport: false,
        earlyAccess: true,
      },
      createdDate: "2023-08-15",
      lastUpdated: "2024-05-30",
    },
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case "automatic":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "manual":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getGroupColor = (color) => {
    const colors = {
      blue: "bg-blue-100 text-blue-800 border-blue-200",
      green: "bg-green-100 text-green-800 border-green-200",
      purple: "bg-purple-100 text-purple-800 border-purple-200",
      red: "bg-red-100 text-red-800 border-red-200",
      yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
      orange: "bg-orange-100 text-orange-800 border-orange-200",
    };
    return colors[color] || colors.blue;
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
      year: "numeric",
    });
  };

  const filteredGroups = customerGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectGroup = (groupId) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleAddGroup = () => {
    // Add group logic here
    console.log("Adding group:", newGroup);
    setShowAddModal(false);
    setNewGroup({
      name: "",
      description: "",
      type: "manual",
      color: "blue",
      criteria: {
        minOrders: "",
        minSpent: "",
        location: "",
        joinedBefore: "",
        joinedAfter: "",
      },
      benefits: {
        discount: "",
        freeShipping: false,
        prioritySupport: false,
        earlyAccess: false,
      },
    });
  };

  const handleEditGroup = (group) => {
    setEditingGroup(group);
    setNewGroup({
      name: group.name,
      description: group.description,
      type: group.type,
      color: group.color,
      criteria: group.criteria,
      benefits: group.benefits,
    });
    setShowAddModal(true);
  };

  const totalMembers = customerGroups.reduce(
    (sum, group) => sum + group.memberCount,
    0
  );
  const totalRevenue = customerGroups.reduce(
    (sum, group) => sum + group.totalSpent,
    0
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Users className="w-8 h-8 mr-3 text-blue-600" />
              Customer Groups
            </h1>
            <p className="text-gray-600 mt-1">
              Organize customers into targeted groups for better marketing
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Groups
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {customerGroups.length}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Members
                </p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {totalMembers}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Group Revenue
                </p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Automatic Groups
                </p>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {customerGroups.filter((g) => g.type === "automatic").length}
                </p>
              </div>
              <Star className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {selectedGroups.length > 0 && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  {selectedGroups.length} selected
                </span>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Delete Selected
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Group Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedGroups.includes(group.id)}
                      onChange={() => handleSelectGroup(group.id)}
                      className="rounded"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${getGroupColor(
                        group.color
                      )
                        .replace("text-", "border-")
                        .replace("bg-", "bg-")}`}
                    ></div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {group.name}
                    </h3>
                  </div>

                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEditGroup(group)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Group Type */}
                <div className="mb-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(
                      group.type
                    )}`}
                  >
                    {group.type === "automatic" ? (
                      <Star className="w-3 h-3 mr-1" />
                    ) : (
                      <Users className="w-3 h-3 mr-1" />
                    )}
                    {group.type}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4">
                  {group.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Members</p>
                    <p className="text-xl font-bold text-gray-900">
                      {group.memberCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="text-xl font-bold text-green-600">
                      {formatCurrency(group.totalSpent)}
                    </p>
                  </div>
                </div>

                {/* Average Order Value */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">
                      Avg. Order Value
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(group.averageOrderValue)}
                    </span>
                  </div>
                </div>

                {/* Benefits */}
                {group.benefits && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Benefits
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {group.benefits.discount > 0 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          <Percent className="w-3 h-3 mr-1" />
                          {group.benefits.discount}% off
                        </span>
                      )}
                      {group.benefits.freeShipping && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          <Gift className="w-3 h-3 mr-1" />
                          Free shipping
                        </span>
                      )}
                      {group.benefits.prioritySupport && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                          <Crown className="w-3 h-3 mr-1" />
                          Priority support
                        </span>
                      )}
                      {group.benefits.earlyAccess && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                          <Star className="w-3 h-3 mr-1" />
                          Early access
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Updated: {formatDate(group.lastUpdated)}
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors">
                      <Eye className="w-3 h-3 mr-1 inline" />
                      View Members
                    </button>
                    <button className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors">
                      <Mail className="w-3 h-3 mr-1 inline" />
                      Send Email
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Group Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {editingGroup ? "Edit Group" : "Create New Group"}
              </h2>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Group Name *
                    </label>
                    <input
                      type="text"
                      value={newGroup.name}
                      onChange={(e) =>
                        setNewGroup((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter group name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Group Type
                    </label>
                    <select
                      value={newGroup.type}
                      onChange={(e) =>
                        setNewGroup((prev) => ({
                          ...prev,
                          type: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="manual">Manual</option>
                      <option value="automatic">Automatic</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newGroup.description}
                    onChange={(e) =>
                      setNewGroup((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Group description"
                  />
                </div>

                {/* Criteria (for automatic groups) */}
                {newGroup.type === "automatic" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Automatic Criteria
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Orders
                        </label>
                        <input
                          type="number"
                          value={newGroup.criteria.minOrders}
                          onChange={(e) =>
                            setNewGroup((prev) => ({
                              ...prev,
                              criteria: {
                                ...prev.criteria,
                                minOrders: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Spent ($)
                        </label>
                        <input
                          type="number"
                          value={newGroup.criteria.minSpent}
                          onChange={(e) =>
                            setNewGroup((prev) => ({
                              ...prev,
                              criteria: {
                                ...prev.criteria,
                                minSpent: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Benefits */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Group Benefits
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount Percentage
                      </label>
                      <input
                        type="number"
                        value={newGroup.benefits.discount}
                        onChange={(e) =>
                          setNewGroup((prev) => ({
                            ...prev,
                            benefits: {
                              ...prev.benefits,
                              discount: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                        max="100"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newGroup.benefits.freeShipping}
                          onChange={(e) =>
                            setNewGroup((prev) => ({
                              ...prev,
                              benefits: {
                                ...prev.benefits,
                                freeShipping: e.target.checked,
                              },
                            }))
                          }
                          className="mr-3"
                        />
                        <span className="text-sm text-gray-700">
                          Free Shipping
                        </span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newGroup.benefits.prioritySupport}
                          onChange={(e) =>
                            setNewGroup((prev) => ({
                              ...prev,
                              benefits: {
                                ...prev.benefits,
                                prioritySupport: e.target.checked,
                              },
                            }))
                          }
                          className="mr-3"
                        />
                        <span className="text-sm text-gray-700">
                          Priority Support
                        </span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newGroup.benefits.earlyAccess}
                          onChange={(e) =>
                            setNewGroup((prev) => ({
                              ...prev,
                              benefits: {
                                ...prev.benefits,
                                earlyAccess: e.target.checked,
                              },
                            }))
                          }
                          className="mr-3"
                        />
                        <span className="text-sm text-gray-700">
                          Early Access to New Products
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingGroup(null);
                    setNewGroup({
                      name: "",
                      description: "",
                      type: "manual",
                      color: "blue",
                      criteria: {
                        minOrders: "",
                        minSpent: "",
                        location: "",
                        joinedBefore: "",
                        joinedAfter: "",
                      },
                      benefits: {
                        discount: "",
                        freeShipping: false,
                        prioritySupport: false,
                        earlyAccess: false,
                      },
                    });
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddGroup}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingGroup ? "Update" : "Create"} Group
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CustomerGroups;
