import {
  AlertTriangle,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Edit,
  FolderOpen,
  Hash,
  List,
  Package,
  Plus,
  Save,
  Search,
  Sliders,
  ToggleLeft,
  Trash2,
  Type,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from "../../services_hooks/admin/adminCategory";

const AdminCategories = () => {
  const dispatch = useDispatch();

  const {
    isFetching,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    errorMessage,
    successMessage,
    totalCategories,
    totalProducts,
    totalLowStock,
  } = useSelector((state) => state.categories);
  const { categories = [] } = useSelector((state) => state.categories || {});

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAttributeModal, setShowAttributeModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showAttributesSection, setShowAttributesSection] = useState(false);

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    tags: [],
    image: "",
    attributes: [],
  });

  const [currentTag, setCurrentTag] = useState("");
  const [currentAttribute, setCurrentAttribute] = useState({
    name: "",
    label: "",
    type: "text",
    unit: "",
    options: [],
    isRequired: false,
    isFilterable: true,
  });
  const [currentOption, setCurrentOption] = useState("");
  const [editingAttributeIndex, setEditingAttributeIndex] = useState(-1);

  const attributeTypes = [
    { value: "text", label: "Text", icon: Type },
    { value: "number", label: "Number", icon: Hash },
    { value: "select", label: "Select", icon: List },
    { value: "multiselect", label: "Multi-Select", icon: CheckSquare },
    { value: "boolean", label: "Yes/No", icon: ToggleLeft },
    { value: "range", label: "Range", icon: Sliders },
  ];

  // Fetch categories on component mount
  useEffect(() => {
    console.log("Fetching categories...");
    fetchCategories(dispatch);
  }, [dispatch]);

  const resetForm = () => {
    setNewCategory({
      name: "",
      description: "",
      tags: [],
      image: "",
      attributes: [],
      isFeatured: false,
    });
    setCurrentTag("");
    setCurrentAttribute({
      name: "",
      label: "",
      type: "text",
      unit: "",
      options: [],
      isRequired: false,
      isFilterable: true,
    });
    setCurrentOption("");
    setEditingCategory(null);
    setEditingAttributeIndex(-1);
    setShowAttributesSection(false);
  };

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      alert("Please enter a category name");
      return;
    }

    createCategory(newCategory, dispatch);
    setShowAddModal(false);
    resetForm();
  };

  const handleUpdateCategory = () => {
    if (!newCategory.name.trim()) {
      alert("Please enter a category name");
      return;
    }

    updateCategory(editingCategory._id, newCategory, dispatch);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      description: category.description,
      tags: category.tags || [],
      image: category.image || "",
      attributes: category.attributes || [],
    });
    setShowAddModal(true);
  };

  const handleDeleteCategory = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);

    if (category?.productCount > 0) {
      if (
        !window.confirm(
          `This category contains ${category.productCount} products. Are you sure?`
        )
      ) {
        return;
      }
    } else {
      if (!window.confirm("Are you sure you want to delete this category?")) {
        return;
      }
    }

    deleteCategory(categoryId, dispatch);
  };

  const addTag = () => {
    if (currentTag.trim() && !newCategory.tags.includes(currentTag.trim())) {
      setNewCategory((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setNewCategory((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addOption = () => {
    if (
      currentOption.trim() &&
      !currentAttribute.options.includes(currentOption.trim())
    ) {
      setCurrentAttribute((prev) => ({
        ...prev,
        options: [...prev.options, currentOption.trim()],
      }));
      setCurrentOption("");
    }
  };

  const removeOption = (optionToRemove) => {
    setCurrentAttribute((prev) => ({
      ...prev,
      options: prev.options.filter((option) => option !== optionToRemove),
    }));
  };

  const addAttribute = () => {
    if (!currentAttribute.name.trim() || !currentAttribute.label.trim()) {
      alert("Please enter attribute name and label");
      return;
    }

    const attributeToAdd = {
      ...currentAttribute,
      _id: Date.now().toString(),
      name: currentAttribute.name.toLowerCase().replace(/\s+/g, "_"),
    };

    if (editingAttributeIndex >= 0) {
      setNewCategory((prev) => ({
        ...prev,
        attributes: prev.attributes.map((attr, index) =>
          index === editingAttributeIndex ? attributeToAdd : attr
        ),
      }));
      setEditingAttributeIndex(-1);
    } else {
      setNewCategory((prev) => ({
        ...prev,
        attributes: [...prev.attributes, attributeToAdd],
      }));
    }

    setCurrentAttribute({
      name: "",
      label: "",
      type: "text",
      unit: "",
      options: [],
      isRequired: false,
      isFilterable: true,
    });
    setCurrentOption("");
  };

  const editAttribute = (index) => {
    const attr = newCategory.attributes[index];
    setCurrentAttribute(attr);
    setEditingAttributeIndex(index);
  };

  const removeAttribute = (index) => {
    setNewCategory((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index),
    }));
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );
  const [viewingAttributes, setViewingAttributes] = useState([]);

  const handleCategoryClick = (category) => {
    setViewingAttributes(category.attributes || []);
    setShowAttributesSection(true); // Ensure attributes section is expanded
    setShowAttributeModal(true);
  };

  return (
    <AdminLayout className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FolderOpen className="w-8 h-8 mr-3 text-blue-600" />
            Categories Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage product categories and their dynamic attributes
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          disabled={isCreating}
        >
          <Plus className="w-4 h-4 mr-2" />
          {isCreating ? "Creating..." : "Add Category"}
        </button>
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
                {totalCategories}
              </p>
            </div>
            <FolderOpen className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 ">
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

      {/* Categories Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              All Categories
            </h2>
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
        </div>

        <div className="overflow-x-auto">
          {isFetching ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading categories...</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attributes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.map((category) => (
                  <tr
                    key={category._id}
                    className="hover:bg-gray-50cursor-pointer"
                    onClick={() => handleCategoryClick(category)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {category.name}
                        </div>

                        {category.tags && category.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {category.tags.slice(0, 2).map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                            {category.tags.length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{category.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {category.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {category.attributes?.length || 0} attributes
                      </div>
                      {category.attributes &&
                        category.attributes.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {category.attributes
                              .slice(0, 2)
                              .map((attr) => attr.label)
                              .join(", ")}
                            {category.attributes.length > 2 && "..."}
                          </div>
                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {category.productCount || 0}
                      </div>
                      {(category.lowStockCount || 0) > 0 && (
                        <div className="text-xs text-red-600 flex items-center mt-1">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {category.lowStockCount} low stock
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          category.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="text-blue-600 hover:text-blue-900"
                          disabled={isUpdating}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category._id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {filteredCategories.length === 0 && !isFetching && (
          <div className="text-center py-8 text-gray-500">
            <FolderOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No categories found</p>
            <p className="text-sm">
              {searchTerm
                ? `No categories match "${searchTerm}"`
                : "Get started by adding your first category"}
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    Image URL (optional)
                  </label>
                  <input
                    type="url"
                    value={newCategory.image}
                    onChange={(e) =>
                      setNewCategory((prev) => ({
                        ...prev,
                        image: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
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

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {newCategory.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add tag"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Attributes Section */}
              <div className="border-t border-gray-200 pt-6">
                <button
                  type="button"
                  onClick={() =>
                    setShowAttributesSection(!showAttributesSection)
                  }
                  className="flex items-center justify-between w-full text-left mb-4"
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    Product Attributes ({newCategory.attributes.length})
                  </h3>
                  {showAttributesSection ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {showAttributesSection && (
                  <div className="space-y-6">
                    {/* Current Attributes */}
                    {newCategory.attributes.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-3">
                          Current Attributes:
                        </h4>
                        <div className="space-y-2">
                          {newCategory.attributes.map((attr, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div>
                                <span className="font-medium text-gray-900">
                                  {attr.label}
                                </span>
                                <span className="text-sm text-gray-500 ml-2">
                                  ({attr.type}
                                  {attr.unit ? `, ${attr.unit}` : ""})
                                </span>
                                {attr.isRequired && (
                                  <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded">
                                    Required
                                  </span>
                                )}
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  type="button"
                                  onClick={() => editAttribute(index)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeAttribute(index)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add/Edit Attribute Form */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-700 mb-4">
                        {editingAttributeIndex >= 0
                          ? "Edit Attribute"
                          : "Add New Attribute"}
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Attribute Name *
                          </label>
                          <input
                            type="text"
                            value={currentAttribute.name}
                            onChange={(e) =>
                              setCurrentAttribute((prev) => ({
                                ...prev,
                                name: e.target.value
                                  .toLowerCase()
                                  .replace(/[^a-z0-9_]/g, "_"),
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="voltage, speed, power"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Display Label *
                          </label>
                          <input
                            type="text"
                            value={currentAttribute.label}
                            onChange={(e) =>
                              setCurrentAttribute((prev) => ({
                                ...prev,
                                label: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Voltage, Speed, Power"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Data Type *
                          </label>
                          <select
                            value={currentAttribute.type}
                            onChange={(e) =>
                              setCurrentAttribute((prev) => ({
                                ...prev,
                                type: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {attributeTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Unit (optional)
                          </label>
                          <input
                            type="text"
                            value={currentAttribute.unit}
                            onChange={(e) =>
                              setCurrentAttribute((prev) => ({
                                ...prev,
                                unit: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="V, W, rpm, kg"
                          />
                        </div>
                      </div>

                      {/* Options for select/multiselect */}
                      {(currentAttribute.type === "select" ||
                        currentAttribute.type === "multiselect") && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Options
                          </label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {currentAttribute.options.map((option, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded text-sm bg-gray-100 text-gray-800"
                              >
                                {option}
                                <button
                                  type="button"
                                  onClick={() => removeOption(option)}
                                  className="ml-2 text-gray-600 hover:text-gray-800"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={currentOption}
                              onChange={(e) => setCurrentOption(e.target.value)}
                              onKeyPress={(e) =>
                                e.key === "Enter" &&
                                (e.preventDefault(), addOption())
                              }
                              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Add option..."
                            />
                            <button
                              type="button"
                              onClick={addOption}
                              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-6 mb-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={currentAttribute.isRequired}
                            onChange={(e) =>
                              setCurrentAttribute((prev) => ({
                                ...prev,
                                isRequired: e.target.checked,
                              }))
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Required Field
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={currentAttribute.isFilterable}
                            onChange={(e) =>
                              setCurrentAttribute((prev) => ({
                                ...prev,
                                isFilterable: e.target.checked,
                              }))
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Use in Filters
                          </span>
                        </label>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={addAttribute}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {editingAttributeIndex >= 0 ? "Update" : "Add"}{" "}
                          Attribute
                        </button>
                        {editingAttributeIndex >= 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingAttributeIndex(-1);
                              setCurrentAttribute({
                                name: "",
                                label: "",
                                type: "text",
                                unit: "",
                                options: [],
                                isRequired: false,
                                isFilterable: true,
                              });
                              setCurrentOption("");
                            }}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            Cancel Edit
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={isCreating || isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={
                  editingCategory ? handleUpdateCategory : handleAddCategory
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={isCreating || isUpdating}
              >
                {isCreating || isUpdating
                  ? "Processing..."
                  : editingCategory
                  ? "Update"
                  : "Create"}{" "}
                Category
              </button>
            </div>
          </div>
        </div>
      )}
      {showAttributeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                Category Attributes
              </h2>
            </div>

            {/* Attributes Display */}
            <div className="p-6 space-y-4">
              {viewingAttributes.length > 0 ? (
                viewingAttributes.map((attr, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{attr.label}</h3>
                        <p className="text-sm text-gray-600">
                          Type: {attr.type} | Required:{" "}
                          {attr.isRequired ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>

                    {attr.options && attr.options.length > 0 && (
                      <div className="mt-3">
                        <h4 className="font-medium text-gray-700">Options:</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {attr.options.map((option, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                            >
                              {option}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center py-4 text-gray-500">
                  No attributes defined for this category
                </p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowAttributeModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCategories;
