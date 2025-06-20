import {
  DollarSign,
  Download,
  FileText,
  Image,
  Package,
  Plus,
  Save,
  Settings,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";
const AdminAddProduct = () => {
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

  const [categories, setCategories] = useState([]);
  const [categoryAttributes, setCategoryAttributes] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadMode, setUploadMode] = useState("single");
  const [csvFile, setCsvFile] = useState(null);
  const [csvPreview, setCsvPreview] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch category attributes when category changes
  useEffect(() => {
    if (formData.category) {
      fetchCategoryAttributes(formData.category);
    } else {
      setCategoryAttributes([]);
      setFormData((prev) => ({ ...prev, specifications: {} }));
    }
  }, [formData.category]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchCategoryAttributes = async (categoryId) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`);
      const data = await response.json();
      if (data.success) {
        setCategoryAttributes(data.data.attributes || []);
        // Reset specifications when category changes
        setFormData((prev) => ({ ...prev, specifications: {} }));
      }
    } catch (error) {
      console.error("Error fetching category attributes:", error);
    }
  };

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
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [attrName]: value,
      },
    }));
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
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label} {unit && `(${unit})`} {isRequired && "*"}
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
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label} {unit && `(${unit})`} {isRequired && "*"}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) =>
                handleSpecificationChange(
                  name,
                  parseFloat(e.target.value) || ""
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
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label} {isRequired && "*"}
            </label>
            <select
              value={value}
              onChange={(e) => handleSpecificationChange(name, e.target.value)}
              {...inputProps}
            >
              <option value="">Select {label}</option>
              {options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );

      case "multiselect":
        return (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label} {isRequired && "*"}
            </label>
            <div className="space-y-2">
              {options?.map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={(value || []).includes(option)}
                    onChange={(e) => {
                      const currentValues = value || [];
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
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        );

      case "boolean":
        return (
          <div key={name}>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={value === true}
                onChange={(e) =>
                  handleSpecificationChange(name, e.target.checked)
                }
                className="mr-2"
              />
              {label} {isRequired && "*"}
            </label>
          </div>
        );

      case "range":
        return (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label} {unit && `(${unit})`} {isRequired && "*"}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={value?.min || ""}
                onChange={(e) =>
                  handleSpecificationChange(name, {
                    ...value,
                    min: parseFloat(e.target.value) || "",
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
                    ...value,
                    max: parseFloat(e.target.value) || "",
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
        return null;
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
      const submitData = {
        ...formData,
        specifications: formData.specifications,
      };

      const data = await addProduct(submitData);
      if (data.success) {
        alert("Product created successfully!");
        // Reset form or redirect
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
      } else {
        alert("Error creating product: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating product");
    } finally {
      setLoading(false);
    }
  };

  const downloadCsvTemplate = () => {
    // Create dynamic CSV template based on selected category
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
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Import Products
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
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manufacturer
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Manufacturer name"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-600" />
              Pricing & Inventory
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selling Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
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
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Stock *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  required
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
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  step="0.001"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.000"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Specifications */}
          {categoryAttributes.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-purple-600" />
                  Product Specifications
                </h2>
                <span className="text-sm text-gray-500">
                  {categoryAttributes.length} attributes available
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {categoryAttributes
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((attribute) => renderSpecificationInput(attribute))}
              </div>
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
                  Dimensions (L x W x H) cm
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    name="dimensions.length"
                    value={formData.dimensions.length}
                    onChange={handleInputChange}
                    step="0.1"
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="L"
                  />
                  <input
                    type="number"
                    name="dimensions.width"
                    value={formData.dimensions.width}
                    onChange={handleInputChange}
                    step="0.1"
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="W"
                  />
                  <input
                    type="number"
                    name="dimensions.height"
                    value={formData.dimensions.height}
                    onChange={handleInputChange}
                    step="0.1"
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="H"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
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
                  Uploaded Images
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
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
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
        </form>
      )}
    </AdminLayout>
  );
};

export default AdminAddProduct;
