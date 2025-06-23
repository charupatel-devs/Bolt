import {
  Download,
  FileText,
  Image,
  Package,
  Plus,
  Save,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import {
  addProduct,
  bulkImportProductsService,
} from "../../services_hooks/admin/adminProductService";
import {
  fetchCategoriesFailure,
  fetchCategoriesStart,
  fetchCategoriesSuccess,
} from "../../store/admin/adminCategorySlice";

const AdminAddProduct = () => {
  // Redux state
  const dispatch = useDispatch();
  const { categories = [], isFetching } = useSelector(
    (state) => state.categories || {}
  );

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    category: "",
    price: "",
    originalPrice: "",
    stock: "",
    minOrderQuantity: "",
    maxOrderQuantity: "",
    weight: "",
    dimensions: { length: "", width: "", height: "" },
    tags: [],
    images: [],
    specifications: {},
  });

  const [categoryAttributes, setCategoryAttributes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadMode, setUploadMode] = useState("single");
  const [csvFile, setCsvFile] = useState(null);
  const [csvPreview, setCsvPreview] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [loading, setLoading] = useState(false);

  // Memoize fetchCategories to prevent recreation on every render
  const fetchCategories = useCallback(async () => {
    try {
      dispatch(fetchCategoriesStart());
      const response = await fetch("/api/admin/categories");
      const data = await response.json();
      if (data.success) {
        dispatch(fetchCategoriesSuccess(data.data));
      } else {
        dispatch(
          fetchCategoriesFailure(data.message || "Failed to fetch categories")
        );
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      dispatch(fetchCategoriesFailure(error.message || "Network error"));
    }
  }, [dispatch]);

  // Get category attributes from the already loaded categories
  const getCategoryAttributes = useCallback(
    (categoryId) => {
      if (!categoryId || !categories.length) {
        console.log("❌ No category ID or categories not loaded");
        return;
      }

      console.log("🔍 Looking for category:", categoryId);
      console.log(
        "📋 Available categories:",
        categories.map((c) => ({
          id: c._id,
          name: c.name,
          attributes: c.attributes?.length || 0,
        }))
      );

      const category = categories.find((cat) => cat._id === categoryId);

      if (category) {
        const attributes = category.attributes || [];
        console.log("✅ Category found:", category.name);
        console.log("📋 Attributes found:", attributes);
        console.log("🔢 Number of attributes:", attributes.length);

        // Log each attribute for debugging
        attributes.forEach((attr, index) => {
          console.log(`📝 Attribute ${index + 1}:`, {
            name: attr.name,
            label: attr.label,
            type: attr.type,
            unit: attr.unit,
            required: attr.isRequired,
          });
        });

        setSelectedCategory(category);
        setCategoryAttributes(attributes);

        // Initialize specifications object with default values
        const initialSpecs = {};
        attributes.forEach((attr) => {
          console.log(
            `🎯 Initializing spec for ${attr.name} (type: ${attr.type})`
          );
          if (attr.type === "multiselect") {
            initialSpecs[attr.name] = [];
          } else if (attr.type === "boolean") {
            initialSpecs[attr.name] = false;
          } else if (attr.type === "range") {
            initialSpecs[attr.name] = { min: "", max: "" };
          } else {
            initialSpecs[attr.name] = "";
          }
        });

        console.log("🚀 Initial specifications:", initialSpecs);

        setFormData((prev) => ({
          ...prev,
          specifications: initialSpecs,
        }));
      } else {
        console.error("❌ Category not found:", categoryId);
        setSelectedCategory(null);
        setCategoryAttributes([]);
        setFormData((prev) => ({ ...prev, specifications: {} }));
      }
    },
    [categories]
  );

  // Improved useEffect with proper conditions
  useEffect(() => {
    console.log("Categories:", categories);
    // Only fetch if categories array is empty AND not currently fetching
    if (categories.length === 0 && !isFetching) {
      fetchCategories();
    }
  }, [categories.length, isFetching, fetchCategories]);

  // Separate useEffect for category attributes
  useEffect(() => {
    if (formData.category && categories.length > 0) {
      console.log("🎯 Category changed to:", formData.category);
      getCategoryAttributes(formData.category);
    } else {
      console.log("🔄 Clearing category attributes");
      setSelectedCategory(null);
      setCategoryAttributes([]);
      setFormData((prev) => ({ ...prev, specifications: {} }));
    }
  }, [formData.category, categories, getCategoryAttributes]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSpecificationChange = (attrName, value) => {
    console.log(`Updating specification ${attrName}:`, value);
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [attrName]: value,
      },
    }));
  };
  const handleBulkImport = async () => {
    if (!csvFile) {
      alert("Please select a CSV file first");
      return;
    }

    if (!formData.category) {
      alert("Please select a category first");
      return;
    }

    setLoading(true);
    try {
      console.log("🚀 Starting bulk import with file:", csvFile.name);

      const response = await bulkImportProductsService(dispatch, csvFile);

      if (response.success) {
        alert(`Successfully imported ${response.count} products!`);
        // Reset the form
        setCsvFile(null);
        setCsvPreview([]);
        setFormData((prev) => ({ ...prev, category: "" }));
      }
    } catch (error) {
      console.error("💥 Bulk import failed:", error);
      alert("Failed to import products: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  const renderSpecificationInput = (attribute) => {
    const { name, label, type, options, unit, isRequired, validationRules } =
      attribute;
    const value = formData.specifications[name] || "";

    const inputProps = {
      className:
        "w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
      required: isRequired,
    };

    switch (type) {
      case "text":
        return (
          <div key={name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {label} {unit && `(${unit})`}{" "}
              {isRequired && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleSpecificationChange(name, e.target.value)}
              placeholder={`Enter ${label.toLowerCase()}`}
              pattern={validationRules?.pattern}
              {...inputProps}
            />
          </div>
        );

      case "number":
        return (
          <div key={name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {label} {unit && `(${unit})`}{" "}
              {isRequired && <span className="text-red-500">*</span>}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) =>
                handleSpecificationChange(
                  name,
                  e.target.value ? parseFloat(e.target.value) : ""
                )
              }
              placeholder={`Enter ${label.toLowerCase()}`}
              min={validationRules?.min}
              max={validationRules?.max}
              step="0.01"
              {...inputProps}
            />
          </div>
        );

      case "select":
        return (
          <div key={name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {label} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <select
              value={value}
              onChange={(e) => handleSpecificationChange(name, e.target.value)}
              {...inputProps}
            >
              <option value="">Select {label}</option>
              {options?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );

      case "multiselect":
        return (
          <div key={name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {label} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {options?.map((option, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={(value || []).includes(option)}
                    onChange={(e) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      if (e.target.checked) {
                        handleSpecificationChange(name, [
                          ...currentValues,
                          option,
                        ]);
                      } else {
                        handleSpecificationChange(
                          name,
                          currentValues.filter((v) => v !== option)
                        );
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case "boolean":
        return (
          <div key={name} className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={value === true}
                onChange={(e) =>
                  handleSpecificationChange(name, e.target.checked)
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                {label} {isRequired && <span className="text-red-500">*</span>}
              </span>
            </label>
          </div>
        );

      case "range":
        return (
          <div key={name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {label} {unit && `(${unit})`}{" "}
              {isRequired && <span className="text-red-500">*</span>}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={value?.min || ""}
                onChange={(e) =>
                  handleSpecificationChange(name, {
                    ...(value || {}),
                    min: e.target.value ? parseFloat(e.target.value) : "",
                  })
                }
                placeholder="Min"
                min={validationRules?.min}
                max={validationRules?.max}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                value={value?.max || ""}
                onChange={(e) =>
                  handleSpecificationChange(name, {
                    ...(value || {}),
                    max: e.target.value ? parseFloat(e.target.value) : "",
                  })
                }
                placeholder="Max"
                min={validationRules?.min}
                max={validationRules?.max}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      default:
        return (
          <div key={name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {label} {unit && `(${unit})`}{" "}
              {isRequired && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleSpecificationChange(name, e.target.value)}
              placeholder={`Enter ${label.toLowerCase()}`}
              {...inputProps}
            />
          </div>
        );
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = [...e.dataTransfer.files];
    if (uploadMode === "bulk" && files[0]?.type === "text/csv") {
      setCsvFile(files[0]);
      handleCsvPreview(files[0]);
    } else {
      handleImageUpload(files);
    }
  };

  const handleImageUpload = (files) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    setFormData((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        ...imageFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          name: file.name,
        })),
      ],
    }));
  };

  const handleCsvPreview = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split("\n").slice(0, 6);
      const preview = lines.map((line) => line.split(","));
      setCsvPreview(preview);
    };
    reader.readAsText(file);
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log(
        "🚀 Component: Submitting product with specifications:",
        formData.specifications
      );

      // Validate required fields
      if (
        !formData.name ||
        !formData.sku ||
        !formData.description ||
        !formData.category ||
        !formData.price
      ) {
        alert("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Prepare data for submission
      const submitData = {
        ...formData,
        specifications: formData.specifications,
      };

      console.log("📦 Component: Data being submitted:", submitData);

      // Import and use the addProduct service

      console.log("🔧 Component: Service imported, calling addProduct...");

      const response = await addProduct(submitData);

      console.log("✅ Component: Service response received:", response);

      if (response.success) {
        alert("Product created successfully!");
        // Reset form
        setFormData({
          name: "",
          sku: "",
          description: "",
          category: "",
          price: "",
          originalPrice: "",
          stock: "",
          minOrderQuantity: "",
          maxOrderQuantity: "",
          weight: "",
          dimensions: { length: "", width: "", height: "" },
          tags: [],
          images: [],
          specifications: {},
        });
        setCategoryAttributes([]);
        setSelectedCategory(null);
      } else {
        alert(
          "Error creating product: " + (response.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("💥 Component: Error:", error);
      alert("Error creating product: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadCsvTemplate = () => {
    let csvHeaders =
      "name,sku,description,category,price,originalPrice,stock,minOrderQuantity,tags";

    if (categoryAttributes.length > 0) {
      const specHeaders = categoryAttributes
        .map((attr) => `spec_${attr.name}`)
        .join(",");
      csvHeaders += "," + specHeaders;
    }

    const csvContent =
      csvHeaders +
      "\n" +
      "Sample Product,SKU-001,Product description," +
      formData.category +
      ',10.99,12.99,100,1,"tag1,tag2"' +
      (categoryAttributes.length > 0
        ? "," + categoryAttributes.map(() => "sample_value").join(",")
        : "");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "product_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Plus className="w-8 h-8 mr-3 text-blue-600" />
            Add Product
          </h1>
          <p className="text-gray-600 mt-1">
            Add single product or bulk import via CSV
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => setUploadMode("single")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              uploadMode === "single"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Single Product
          </button>
          <button
            onClick={() => setUploadMode("bulk")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              uploadMode === "bulk"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Bulk Import
          </button>
        </div>
      </div>

      {uploadMode === "bulk" ? (
        /* Bulk Import Section */
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Bulk Product Import
            </h2>
            <button
              onClick={downloadCsvTemplate}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              disabled={!formData.category}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </button>
          </div>

          {!formData.category && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">
                Please select a category first to generate the appropriate CSV
                template.
              </p>
            </div>
          )}

          {/* Category Selection for Bulk Import */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Category for Bulk Import *
            </label>
            {isFetching ? (
              <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
                Loading categories...
              </div>
            ) : (
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* CSV Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Drop your CSV file here, or click to browse
            </h3>
            <p className="text-gray-600 mb-4">Supports CSV files up to 10MB</p>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setCsvFile(file);
                  handleCsvPreview(file);
                }
              }}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
            >
              Choose File
            </label>
          </div>

          {/* CSV Preview */}
          {csvPreview.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                CSV Preview
              </h3>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {csvPreview[0]?.map((header, index) => (
                        <th
                          key={index}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {csvPreview.slice(1).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-4 py-3 text-sm text-gray-900"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end mt-4 space-x-3">
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Cancel
                </button>

                <button
                  onClick={handleBulkImport}
                  disabled={loading || !csvFile || !formData.category}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Importing..." : "Import Products"}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Single Product Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Package className="w-5 h-5 mr-2 text-blue-600" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU *
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Product SKU"
                  required
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Product description"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                {isFetching ? (
                  <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
                    Loading categories...
                  </div>
                ) : (
                  <select
                    name="category"
                    value={formData.category}
                    onChange={(e) => {
                      console.log("🎯 Category selected:", e.target.value);
                      const selectedCat = categories.find(
                        (cat) => cat._id === e.target.value
                      );
                      console.log("📋 Selected category object:", selectedCat);
                      handleInputChange(e);
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}{" "}
                        {cat.attributes &&
                          cat.attributes.length > 0 &&
                          `(${cat.attributes.length} specs)`}
                      </option>
                    ))}
                  </select>
                )}
                {/* Debug info for categories */}
                {categories.length > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    💡 {categories.length} categories loaded. Current selection:{" "}
                    {formData.category || "none"}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Price
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Category Specifications */}
          {formData.category && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-purple-600" />
                Product Specifications
                {selectedCategory && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({selectedCategory.name})
                  </span>
                )}
              </h2>

              {/* Loading state */}
              {!categoryAttributes && formData.category && (
                <div className="flex items-center justify-center py-8">
                  <div className="text-gray-500">Loading specifications...</div>
                </div>
              )}

              {/* No attributes message */}
              {categoryAttributes && categoryAttributes.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">
                    No specifications defined for this category yet.
                  </p>
                </div>
              )}

              {/* Specifications form */}
              {categoryAttributes && categoryAttributes.length > 0 && (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {categoryAttributes.map((attribute) =>
                      renderSpecificationInput(attribute)
                    )}
                  </div>

                  {/* Debug info - show in development */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <details>
                      <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                        Debug Info (Click to expand)
                      </summary>
                      <div className="mt-2 space-y-2">
                        <div>
                          <h4 className="text-xs font-medium text-gray-600">
                            Category Attributes:
                          </h4>
                          <pre className="text-xs text-gray-600 overflow-auto bg-white p-2 rounded border">
                            {JSON.stringify(categoryAttributes, null, 2)}
                          </pre>
                        </div>
                        <div>
                          <h4 className="text-xs font-medium text-gray-600">
                            Current Specifications:
                          </h4>
                          <pre className="text-xs text-gray-600 overflow-auto bg-white p-2 rounded border">
                            {JSON.stringify(formData.specifications, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </details>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Product Details */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-indigo-600" />
              Additional Details
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Order Quantity
                </label>
                <input
                  type="number"
                  name="minOrderQuantity"
                  value={formData.minOrderQuantity}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Order Quantity
                </label>
                <input
                  type="number"
                  name="maxOrderQuantity"
                  value={formData.maxOrderQuantity}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="No limit"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dimensions (L x W x H) cm
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    name="dimensions.length"
                    value={formData.dimensions.length}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="L"
                  />
                  <input
                    type="number"
                    name="dimensions.width"
                    value={formData.dimensions.width}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="W"
                  />
                  <input
                    type="number"
                    name="dimensions.height"
                    value={formData.dimensions.height}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="H"
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {formData.tags.map((tag) => (
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
            </div>
          </div>

          {/* Product Images */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Image className="w-5 h-5 mr-2 text-pink-600" />
              Product Images
            </h2>

            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Image className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">
                Drop images here or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supports JPG, PNG, WebP up to 5MB each
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload([...e.target.files])}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
              >
                Choose Images
              </label>
            </div>

            {/* Image Preview */}
            {formData.images.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Uploaded Images ({formData.images.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img.preview}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index),
                          }));
                        }}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                        {index === 0 ? "Main" : index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  name: "",
                  sku: "",
                  description: "",
                  category: "",
                  price: "",
                  originalPrice: "",
                  stock: "",
                  minOrderQuantity: "",
                  maxOrderQuantity: "",
                  weight: "",
                  dimensions: { length: "", width: "", height: "" },
                  tags: [],
                  images: [],
                  specifications: {},
                });
                setCategoryAttributes([]);
                setSelectedCategory(null);
              }}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reset Form
            </button>
            <button
              type="button"
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>

          {/* Form Summary */}
          {formData.category && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                Form Summary
              </h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p>
                  <strong>Category:</strong> {selectedCategory?.name}
                </p>
                <p>
                  <strong>Specifications:</strong>{" "}
                  {Object.keys(formData.specifications).length} fields
                </p>
                <p>
                  <strong>Images:</strong> {formData.images.length} uploaded
                </p>
                <p>
                  <strong>Tags:</strong> {formData.tags.length} added
                </p>
              </div>
            </div>
          )}
        </form>
      )}
    </AdminLayout>
  );
};

export default AdminAddProduct;
