// src/pages/admin/Categories.jsx
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Edit,
  Eye,
  FolderOpen,
  Grid3X3,
  List,
  Package,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";

const AdminCategories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [viewMode, setViewMode] = useState("tree");

  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Electronics Components",
      slug: "electronics-components",
      description: "Basic electronic components and parts",
      icon: "⚡",
      status: "active",
      productCount: 2137,
      lowStockCount: 58,
      subcategories: [
        {
          id: 11,
          name: "Resistors",
          slug: "resistors",
          productCount: 1245,
          lowStockCount: 23,
          status: "active",
        },
        {
          id: 12,
          name: "Capacitors",
          slug: "capacitors",
          productCount: 892,
          lowStockCount: 15,
          status: "active",
        },
        {
          id: 13,
          name: "Integrated Circuits",
          slug: "integrated-circuits",
          productCount: 567,
          lowStockCount: 8,
          status: "active",
        },
        {
          id: 14,
          name: "Transistors",
          slug: "transistors",
          productCount: 433,
          lowStockCount: 12,
          status: "active",
        },
      ],
    },
    {
      id: 2,
      name: "Sensors & Detectors",
      slug: "sensors-detectors",
      description: "Various sensors and detection devices",
      icon: "🔍",
      status: "active",
      productCount: 677,
      lowStockCount: 17,
      subcategories: [
        {
          id: 21,
          name: "Temperature Sensors",
          slug: "temperature-sensors",
          productCount: 234,
          lowStockCount: 5,
          status: "active",
        },
        {
          id: 22,
          name: "Pressure Sensors",
          slug: "pressure-sensors",
          productCount: 189,
          lowStockCount: 7,
          status: "active",
        },
        {
          id: 23,
          name: "Proximity Sensors",
          slug: "proximity-sensors",
          productCount: 156,
          lowStockCount: 3,
          status: "active",
        },
        {
          id: 24,
          name: "Flow Sensors",
          slug: "flow-sensors",
          productCount: 98,
          lowStockCount: 2,
          status: "active",
        },
      ],
    },
    {
      id: 3,
      name: "Power Management",
      slug: "power-management",
      description: "Power supplies, regulators, and management ICs",
      icon: "🔋",
      status: "active",
      productCount: 924,
      lowStockCount: 37,
      subcategories: [
        {
          id: 31,
          name: "Voltage Regulators",
          slug: "voltage-regulators",
          productCount: 345,
          lowStockCount: 18,
          status: "active",
        },
        {
          id: 32,
          name: "Power Supplies",
          slug: "power-supplies",
          productCount: 278,
          lowStockCount: 9,
          status: "active",
        },
        {
          id: 33,
          name: "Battery Management",
          slug: "battery-management",
          productCount: 167,
          lowStockCount: 6,
          status: "active",
        },
        {
          id: 34,
          name: "DC-DC Converters",
          slug: "dc-dc-converters",
          productCount: 134,
          lowStockCount: 4,
          status: "active",
        },
      ],
    },
    {
      id: 4,
      name: "Connectors & Cables",
      slug: "connectors-cables",
      description: "Various connectors, cables, and interconnects",
      icon: "🔌",
      status: "active",
      productCount: 1002,
      lowStockCount: 43,
      subcategories: [
        {
          id: 41,
          name: "USB Connectors",
          slug: "usb-connectors",
          productCount: 456,
          lowStockCount: 21,
          status: "active",
        },
        {
          id: 42,
          name: "Audio Connectors",
          slug: "audio-connectors",
          productCount: 234,
          lowStockCount: 11,
          status: "active",
        },
        {
          id: 43,
          name: "Power Connectors",
          slug: "power-connectors",
          productCount: 189,
          lowStockCount: 8,
          status: "active",
        },
        {
          id: 44,
          name: "Ribbon Cables",
          slug: "ribbon-cables",
          productCount: 123,
          lowStockCount: 3,
          status: "active",
        },
      ],
    },
  ]);

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    icon: "",
    parentId: null,
  });

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleAddCategory = () => {
    // Add category logic here
    setShowAddModal(false);
    setNewCategory({ name: "", description: "", icon: "", parentId: null });
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      description: category.description,
      icon: category.icon,
      parentId: category.parentId || null,
    });
    setShowAddModal(true);
  };

  const handleDeleteCategory = (categoryId) => {
    if (
      window.confirm(
        'Are you sure you want to delete this category? This will also delete all subcategories and move products to "Uncategorized".'
      )
    ) {
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
    }
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.subcategories.some((sub) =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const totalProducts = categories.reduce(
    (sum, cat) => sum + cat.productCount,
    0
  );
  const totalLowStock = categories.reduce(
    (sum, cat) => sum + cat.lowStockCount,
    0
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FolderOpen className="w-8 h-8 mr-3 text-blue-600" />
              Categories Management
            </h1>
            <p className="text-gray-600 mt-1">
              Organize your products into categories and subcategories
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Categories
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {categories.length}
                </p>
              </div>
              <FolderOpen className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {totalProducts.toLocaleString()}
                </p>
              </div>
              <Package className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Low Stock Items
                </p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {totalLowStock}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("tree")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "tree"
                      ? "bg-white shadow-sm"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {viewMode === "tree" ? (
            /* Tree View */
            <div className="space-y-2">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="border border-gray-200 rounded-lg"
                >
                  {/* Main Category */}
                  <div
                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <button className="flex items-center justify-center w-6 h-6">
                        {expandedCategories.includes(category.id) ? (
                          <ChevronDown className="w-4 h-4 text-gray-600" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {category.productCount} products
                        </div>
                        {category.lowStockCount > 0 && (
                          <div className="text-xs text-red-600 flex items-center">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {category.lowStockCount} low stock
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditCategory(category);
                          }}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(category.id);
                          }}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Subcategories */}
                  {expandedCategories.includes(category.id) && (
                    <div className="bg-white">
                      {category.subcategories.map((subcategory, index) => (
                        <div
                          key={subcategory.id}
                          className={`flex items-center justify-between p-4 pl-16 hover:bg-gray-50 transition-colors ${
                            index < category.subcategories.length - 1
                              ? "border-b border-gray-100"
                              : ""
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {subcategory.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                /{subcategory.slug}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-900">
                                {subcategory.productCount} products
                              </div>
                              {subcategory.lowStockCount > 0 && (
                                <div className="text-xs text-red-600 flex items-center">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  {subcategory.lowStockCount} low stock
                                </div>
                              )}
                            </div>

                            <div className="flex space-x-2">
                              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{category.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Total Products:</span>
                      <span className="font-medium text-gray-900">
                        {category.productCount}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Subcategories:</span>
                      <span className="font-medium text-gray-900">
                        {category.subcategories.length}
                      </span>
                    </div>

                    {category.lowStockCount > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-red-600">Low Stock:</span>
                        <span className="font-medium text-red-600 flex items-center">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {category.lowStockCount}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="w-full text-left text-sm text-blue-600 hover:text-blue-800 font-medium">
                      View subcategories →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Category Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter category name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newCategory.description}
                    onChange={(e) =>
                      setNewCategory((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Category description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon (Emoji)
                  </label>
                  <input
                    type="text"
                    value={newCategory.icon}
                    onChange={(e) =>
                      setNewCategory((prev) => ({
                        ...prev,
                        icon: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="🔧"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Category (Optional)
                  </label>
                  <select
                    value={newCategory.parentId || ""}
                    onChange={(e) =>
                      setNewCategory((prev) => ({
                        ...prev,
                        parentId: e.target.value || null,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">None (Main Category)</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCategory(null);
                    setNewCategory({
                      name: "",
                      description: "",
                      icon: "",
                      parentId: null,
                    });
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingCategory ? "Update" : "Add"} Category
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;
