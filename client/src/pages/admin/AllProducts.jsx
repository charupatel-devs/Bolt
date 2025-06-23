import {
  AlertTriangle,
  ArrowUpDown,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Download,
  Edit,
  Eye,
  Grid3X3,
  List,
  MoreHorizontal,
  Package,
  Search,
  SlidersHorizontal,
  Star,
  Trash2,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import { getAllProducts } from "../../services_hooks/admin/adminProductService";
import { SetProductFilters } from "../../store/admin/adminProductSlice";

const AllProducts = () => {
  const dispatch = useDispatch();

  // Redux state
  const { products, pagination, filters, isFetching, error, errMsg } =
    useSelector((state) => state.products);

  // Local UI states
  const [viewMode, setViewMode] = useState("table");
  const [showFilters, setShowFilters] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [selectedCategory, setSelectedCategory] = useState(
    filters.category || ""
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [sortBy, setSortBy] = useState(filters.sortBy || "createdAt");
  const [sortOrder, setSortOrder] = useState(filters.sortOrder || "desc");
  const [itemsPerPage, setItemsPerPage] = useState(pagination.limit || 5);

  // Local filter states (for client-side filtering)
  const [localFilters, setLocalFilters] = useState({
    stockStatus: filters.status ? filters.status.split(",") : [],
    priceRange: { min: filters.priceMin || "", max: filters.priceMax || "" },
    manufacturer: filters.manufacturer || [],
    inStock: filters.inStock || false,
    newProduct: filters.newProduct || false,
    onSale: filters.onSale || false,
  });

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      console.log("🔄 Fetching products...");
      await getAllProducts(dispatch, {
        page: pagination.currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        category: selectedCategory,
        status: localFilters.stockStatus.join(","),
        sortBy,
        sortOrder,
      });
      console.log("✅ Products fetch completed");
    } catch (err) {
      console.error("💥 Failed to fetch products:", err);
    }
  };

  // Sync Redux filters with local state changes
  useEffect(() => {
    dispatch(
      SetProductFilters({
        search: searchTerm,
        category: selectedCategory,
        status: localFilters.stockStatus.join(","),
        sortBy,
        sortOrder,
        priceMin: localFilters.priceRange.min,
        priceMax: localFilters.priceRange.max,
        manufacturer: localFilters.manufacturer,
        inStock: localFilters.inStock,
        newProduct: localFilters.newProduct,
        onSale: localFilters.onSale,
      })
    );
  }, [searchTerm, selectedCategory, localFilters, sortBy, sortOrder]);

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== filters.search) {
        dispatch(SetProductFilters({ search: searchTerm }));
        fetchProducts();
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Fetch products when pagination or items per page changes
  useEffect(() => {
    fetchProducts();
  }, [pagination.currentPage, itemsPerPage]);

  // Derive categories and manufacturers
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map((p) => p.category))].map(
      (name) => ({
        name,
        subcategories: [
          ...new Set(
            products
              .filter((p) => p.category === name)
              .map((p) => p.subcategory)
          ),
        ],
      })
    );
    return uniqueCategories;
  }, [products]);

  const manufacturers = useMemo(
    () => [...new Set(products.map((p) => p.manufacturer))],
    [products]
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "low":
        return "text-yellow-600 bg-yellow-100";
      case "out":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />;
      case "low":
        return <AlertTriangle className="w-4 h-4" />;
      case "out":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "In Stock";
      case "low":
        return "Low Stock";
      case "out":
        return "Out of Stock";
      default:
        return "Unknown";
    }
  };

  // Apply client-side filters
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const subcategoryMatch =
        !selectedSubcategory || product.subcategory === selectedSubcategory;
      const priceMatch =
        (!localFilters.priceRange.min ||
          product.price >= parseFloat(localFilters.priceRange.min)) &&
        (!localFilters.priceRange.max ||
          product.price <= parseFloat(localFilters.priceRange.max));
      const manufacturerMatch =
        localFilters.manufacturer.length === 0 ||
        localFilters.manufacturer.includes(product.manufacturer);
      const inStockMatch = !localFilters.inStock || product.stock > 0;
      const newProductMatch = !localFilters.newProduct || product.isNew;
      const onSaleMatch = !localFilters.onSale || product.isOnSale;

      return (
        subcategoryMatch &&
        priceMatch &&
        manufacturerMatch &&
        inStockMatch &&
        newProductMatch &&
        onSaleMatch
      );
    });
  }, [products, selectedSubcategory, localFilters]);

  const paginatedProducts = filteredProducts; // API handles pagination

  const totalPages = pagination.totalPages || 1;

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === paginatedProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(paginatedProducts.map((p) => p.id));
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  if (isFetching) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-red-600 text-center p-6">
          Error: {errMsg || "Failed to load products"}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Package className="w-8 h-8 mr-3 text-blue-600" />
              All Products
            </h1>
            <p className="text-gray-600 mt-1">
              Showing {filteredProducts.length} products
            </p>
          </div>

          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                showFilters
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>
        </div>

        {/* Search and View Controls */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubcategory("");
                }}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {selectedCategory && (
                <select
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Subcategories</option>
                  {categories
                    .find((cat) => cat.name === selectedCategory)
                    ?.subcategories.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                </select>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "table"
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

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Stock Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Status
                  </label>
                  <div className="space-y-2">
                    {["active", "low", "out"].map((status) => (
                      <label key={status} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={localFilters.stockStatus.includes(status)}
                          onChange={(e) => {
                            setLocalFilters((prev) => ({
                              ...prev,
                              stockStatus: e.target.checked
                                ? [...prev.stockStatus, status]
                                : prev.stockStatus.filter((s) => s !== status),
                            }));
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">{getStatusText(status)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={localFilters.priceRange.min}
                      onChange={(e) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          priceRange: {
                            ...prev.priceRange,
                            min: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={localFilters.priceRange.max}
                      onChange={(e) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          priceRange: {
                            ...prev.priceRange,
                            max: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                </div>

                {/* Manufacturer Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manufacturer
                  </label>
                  <div className="space-y-2 max-h-24 overflow-y-auto">
                    {manufacturers.map((manufacturer) => (
                      <label key={manufacturer} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={localFilters.manufacturer.includes(
                            manufacturer
                          )}
                          onChange={(e) => {
                            setLocalFilters((prev) => ({
                              ...prev,
                              manufacturer: e.target.checked
                                ? [...prev.manufacturer, manufacturer]
                                : prev.manufacturer.filter(
                                    (m) => m !== manufacturer
                                  ),
                            }));
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">{manufacturer}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Additional Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Options
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={localFilters.inStock}
                        onChange={(e) =>
                          setLocalFilters((prev) => ({
                            ...prev,
                            inStock: e.target.checked,
                          }))
                        }
                        className="mr-2"
                      />
                      <span className="text-sm">In Stock Only</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={localFilters.newProduct}
                        onChange={(e) =>
                          setLocalFilters((prev) => ({
                            ...prev,
                            newProduct: e.target.checked,
                          }))
                        }
                        className="mr-2"
                      />
                      <span className="text-sm">New Products</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={localFilters.onSale}
                        onChange={(e) =>
                          setLocalFilters((prev) => ({
                            ...prev,
                            onSale: e.target.checked,
                          }))
                        }
                        className="mr-2"
                      />
                      <span className="text-sm">On Sale</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {
                    setLocalFilters({
                      stockStatus: [],
                      priceRange: { min: "", max: "" },
                      manufacturer: [],
                      inStock: false,
                      newProduct: false,
                      onSale: false,
                    });
                    setSearchTerm("");
                    setSelectedCategory("");
                    setSelectedSubcategory("");
                    dispatch(
                      SetProductFilters({
                        search: "",
                        category: "",
                        status: "",
                        priceMin: "",
                        priceMax: "",
                        manufacturer: [],
                        inStock: false,
                        newProduct: false,
                        onSale: false,
                      })
                    );
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedProducts.length} product
                  {selectedProducts.length > 1 ? "s" : ""} selected
                </span>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                    Bulk Edit
                  </button>
                  <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">
                    Export Selected
                  </button>
                  <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">
                    Delete Selected
                  </button>
                </div>
              </div>
              <button
                onClick={() => setSelectedProducts([])}
                className="text-blue-600 hover:text-blue-800"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}

        {/* Products Display */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Results Info and Sorting */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Showing {(pagination.currentPage - 1) * itemsPerPage + 1} -{" "}
                  {Math.min(
                    pagination.currentPage * itemsPerPage,
                    filteredProducts.length
                  )}{" "}
                  of {filteredProducts.length} results
                </span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="px-3 py-1 border border-gray-200 rounded text-sm"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 border border-gray-200 rounded text-sm"
                >
                  <option value="name">Name</option>
                  <option value="sku">SKU</option>
                  <option value="price">Price</option>
                  <option value="stock">Stock</option>
                  <option value="createdAt">Date Added</option>
                  <option value="rating">Rating</option>
                </select>
                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="p-1 text-gray-600 hover:text-gray-800"
                >
                  {sortOrder === "asc" ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {viewMode === "table" ? (
            /* Table View */
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedProducts.length ===
                            paginatedProducts.length &&
                          paginatedProducts.length > 0
                        }
                        onChange={handleSelectAll}
                        className="rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort("name")}
                        className="flex items-center space-x-1 hover:text-gray-700"
                      >
                        <span>Product</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort("sku")}
                        className="flex items-center space-x-1 hover:text-gray-700"
                      >
                        <span>SKU</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort("price")}
                        className="flex items-center space-x-1 hover:text-gray-700"
                      >
                        <span>Price</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort("stock")}
                        className="flex items-center space-x-1 hover:text-gray-700"
                      >
                        <span>Stock</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover mr-4"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900 mb-1">
                              {product.name}
                              {product.isNew && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  New
                                </span>
                              )}
                              {product.isOnSale && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Sale
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.manufacturer}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {product.sku}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {product.category}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.subcategory}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        ${product.price}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-medium ${
                            product.stock === 0
                              ? "text-red-600"
                              : product.stock <= product.minStock
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {product.stock}
                        </span>
                        <div className="text-xs text-gray-500">
                          Min: {product.minStock}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            product.status
                          )}`}
                        >
                          {getStatusIcon(product.status)}
                          <span className="ml-1">
                            {getStatusText(product.status)}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          {renderStars(product.rating)}
                          <span className="text-sm text-gray-600 ml-2">
                            {product.rating} ({product.reviews})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Grid View */
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                          className="rounded"
                        />
                      </div>
                      <div className="absolute top-2 right-2 flex flex-col space-y-1">
                        {product.isNew && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            New
                          </span>
                        )}
                        {product.isOnSale && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Sale
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="mb-2">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500">{product.sku}</p>
                      </div>

                      <div className="mb-2">
                        <div className="flex items-center space-x-1 mb-1">
                          {renderStars(product.rating)}
                        </div>
                        <p className="text-xs text-gray-600">
                          {product.rating} ({product.reviews} reviews)
                        </p>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-lg font-bold text-gray-900">
                            ${product.price}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              product.status
                            )}`}
                          >
                            {getStatusText(product.status)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Stock:{" "}
                          <span
                            className={`font-medium ${
                              product.stock === 0
                                ? "text-red-600"
                                : product.stock <= product.minStock
                                ? "text-yellow-600"
                                : "text-green-600"
                            }`}
                          >
                            {product.stock}
                          </span>
                        </p>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {product.manufacturer}
                        </span>
                        <div className="flex space-x-1">
                          <button className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors">
                            <Eye className="w-3 h-3" />
                          </button>
                          <button className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors">
                            <Edit className="w-3 h-3" />
                          </button>
                          <button className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page {pagination.currentPage} of {totalPages}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      dispatch(
                        SetProductFilters({
                          currentPage: Math.max(1, pagination.currentPage - 1),
                        })
                      )
                    }
                    disabled={pagination.currentPage === 1}
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
                          onClick={() =>
                            dispatch(SetProductFilters({ currentPage: page }))
                          }
                          className={`w-8 h-8 text-sm rounded-lg ${
                            pagination.currentPage === page
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
                      dispatch(
                        SetProductFilters({
                          currentPage: Math.min(
                            totalPages,
                            pagination.currentPage + 1
                          ),
                        })
                      )
                    }
                    disabled={pagination.currentPage === totalPages}
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AllProducts;
