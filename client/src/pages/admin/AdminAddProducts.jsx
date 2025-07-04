import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import AddSingleProduct from "../../components/admin/pages-components/AddSingleProduct";
import BulkImportProduct from "../../components/admin/pages-components/BulkImportProduct";
import {
  addProduct,
  bulkImportProductsService,
} from "../../services_hooks/admin/adminProductService";
import {
  fetchCategoriesFailure,
  fetchCategoriesStart,
  fetchCategoriesSuccess,
} from "../../store/admin/adminCategorySlice";

const AdminAddProduct = ({ initialMode = "single" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { categories = [], isFetching } = useSelector(
    (state) => state.categories || {}
  );

  const toggleMode = (mode) => {
    setUploadMode(mode);

    if (mode === "bulk") {
      // Append /bulk to current path if not already there
      if (!location.pathname.endsWith("/bulk")) {
        navigate(`${location.pathname}/bulk`);
      }
    } else {
      // Remove /bulk from path if present
      const newPath = location.pathname.replace(/\/bulk$/, "");
      navigate(newPath);
    }
  };
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
  const [uploadMode, setUploadMode] = useState(initialMode);
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
        // Reset the form
        setCsvFile(null);
        setCsvPreview([]);
        setFormData((prev) => ({ ...prev, category: "" }));
      }
    } catch (error) {
      console.error("💥 Bulk import failed:", error);
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
      // Simple CSV parser (handles quoted fields with commas inside)
      const parseCsvLine = (line) => {
        const result = [];
        let current = "";
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === "," && !inQuotes) {
            result.push(current);
            current = "";
          } else {
            current += char;
          }
        }
        result.push(current);
        return result;
      };
      const preview = lines.map((line) => parseCsvLine(line));
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

    try {
      // Validate required fields
      if (
        !formData.name ||
        !formData.sku ||
        !formData.description ||
        !formData.category ||
        !formData.price
      ) {
        alert("Please fill in all required fields");
        return;
      }

      // Prepare data for submission
      const submitData = {
        ...formData,
        specifications: formData.specifications,
      };
      await addProduct(submitData, dispatch);
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
            onClick={() => toggleMode("single")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              uploadMode === "single"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Single Product
          </button>
          <button
            onClick={() => toggleMode("bulk")}
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
        <BulkImportProduct
          formData={formData}
          handleInputChange={handleInputChange}
          isFetching={isFetching}
          categories={categories}
          dragActive={dragActive}
          setDragActive={setDragActive}
          handleDrag={handleDrag}
          handleDrop={handleDrop}
          handleCsvPreview={handleCsvPreview}
          setCsvFile={setCsvFile}
          csvFile={csvFile}
          csvPreview={csvPreview}
          loading={loading}
          handleBulkImport={handleBulkImport}
          downloadCsvTemplate={downloadCsvTemplate}
        />
      ) : (
        <AddSingleProduct
          formData={formData}
          handleInputChange={handleInputChange}
          isFetching={isFetching}
          categories={categories}
          dragActive={dragActive}
          setDragActive={setDragActive}
          handleDrag={handleDrag}
          handleDrop={handleDrop}
          handleImageUpload={handleImageUpload}
          handleSubmit={handleSubmit}
          loading={loading}
          categoryAttributes={categoryAttributes}
          selectedCategory={selectedCategory}
          renderSpecificationInput={renderSpecificationInput}
          currentTag={currentTag}
          setCurrentTag={setCurrentTag}
          addTag={addTag}
          removeTag={removeTag}
        />
      )}
    </AdminLayout>
  );
};

export default AdminAddProduct;
