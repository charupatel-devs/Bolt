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
import { useMemo, useState } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";

const AllProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("table");
  const [showFilters, setShowFilters] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Filter states
  const [filters, setFilters] = useState({
    stockStatus: [],
    priceRange: { min: "", max: "" },
    manufacturer: [],
    inStock: false,
    newProduct: false,
    onSale: false,
  });

  // Sample products data
  const products = [
    {
      id: 1,
      name: "Arduino Uno R3 Microcontroller Board",
      sku: "ARD-UNO-R3-001",
      category: "Electronics Components",
      subcategory: "Microcontrollers",
      manufacturer: "Arduino",
      model: "UNO-R3",
      price: 25.99,
      costPrice: 18.5,
      stock: 145,
      minStock: 20,
      status: "active",
      rating: 4.8,
      reviews: 1247,
      image:
        "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=100&h=100&fit=crop",
      dateAdded: "2024-01-15",
      isNew: false,
      isOnSale: true,
    },
    {
      id: 2,
      name: "Raspberry Pi 4 Model B 8GB RAM",
      sku: "RPI-4-8GB-002",
      category: "Electronics Components",
      subcategory: "Single Board Computers",
      manufacturer: "Raspberry Pi Foundation",
      model: "Pi-4-8GB",
      price: 89.99,
      costPrice: 65.0,
      stock: 12,
      minStock: 15,
      status: "low",
      rating: 4.9,
      reviews: 892,
      image:
        "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=100&h=100&fit=crop",
      dateAdded: "2024-02-20",
      isNew: true,
      isOnSale: false,
    },
    {
      id: 3,
      name: "ESP32 Development Board WiFi Bluetooth",
      sku: "ESP32-DEV-003",
      category: "Electronics Components",
      subcategory: "Microcontrollers",
      manufacturer: "Espressif",
      model: "ESP32-WROOM",
      price: 15.99,
      costPrice: 8.5,
      stock: 0,
      minStock: 10,
      status: "out",
      rating: 4.6,
      reviews: 567,
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop",
      dateAdded: "2024-01-08",
      isNew: false,
      isOnSale: true,
    },
    {
      id: 4,
      name: "STM32 Nucleo-64 Development Board",
      sku: "STM32-NUCLEO-004",
      category: "Electronics Components",
      subcategory: "Microcontrollers",
      manufacturer: "STMicroelectronics",
      model: "NUCLEO-F401RE",
      price: 35.5,
      costPrice: 22.0,
      stock: 78,
      minStock: 15,
      status: "active",
      rating: 4.7,
      reviews: 324,
      image:
        "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=100&h=100&fit=crop",
      dateAdded: "2024-02-10",
      isNew: true,
      isOnSale: false,
    },
    {
      id: 5,
      name: "DHT22 Temperature Humidity Sensor",
      sku: "DHT22-TEMP-005",
      category: "Sensors & Detectors",
      subcategory: "Temperature Sensors",
      manufacturer: "Aosong",
      model: "DHT22",
      price: 8.99,
      costPrice: 4.5,
      stock: 234,
      minStock: 50,
      status: "active",
      rating: 4.4,
      reviews: 1156,
      image:
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=100&h=100&fit=crop",
      dateAdded: "2024-01-25",
      isNew: false,
      isOnSale: false,
    },
  ];

  const categories = [
    {
      name: "Electronics Components",
      subcategories: [
        "Microcontrollers",
        "Single Board Computers",
        "Resistors",
        "Capacitors",
      ],
    },
    {
      name: "Sensors & Detectors",
      subcategories: [
        "Temperature Sensors",
        "Pressure Sensors",
        "Proximity Sensors",
      ],
    },
    {
      name: "Power Management",
      subcategories: [
        "Voltage Regulators",
        "Power Supplies",
        "Battery Management",
      ],
    },
  ];

  const manufacturers = [...new Set(products.map((p) => p.manufacturer))];

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

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      // Search filter
      const searchMatch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const categoryMatch =
        !selectedCategory || product.category === selectedCategory;
      const subcategoryMatch =
        !selectedSubcategory || product.subcategory === selectedSubcategory;

      // Stock status filter
      const stockStatusMatch =
        filters.stockStatus.length === 0 ||
        filters.stockStatus.includes(product.status);

      // Price range filter
      const priceMatch =
        (!filters.priceRange.min ||
          product.price >= parseFloat(filters.priceRange.min)) &&
        (!filters.priceRange.max ||
          product.price <= parseFloat(filters.priceRange.max));

      // Manufacturer filter
      const manufacturerMatch =
        filters.manufacturer.length === 0 ||
        filters.manufacturer.includes(product.manufacturer);

      // Additional filters
      const inStockMatch = !filters.inStock || product.stock > 0;
      const newProductMatch = !filters.newProduct || product.isNew;
      const onSaleMatch = !filters.onSale || product.isOnSale;

      return (
        searchMatch &&
        categoryMatch &&
        subcategoryMatch &&
        stockStatusMatch &&
        priceMatch &&
        manufacturerMatch &&
        inStockMatch &&
        newProductMatch &&
        onSaleMatch
      );
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedSubcategory,
    filters,
    sortBy,
    sortOrder,
  ]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

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
              Showing {filteredProducts.length} of {products.length} products
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
                          checked={filters.stockStatus.includes(status)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters((prev) => ({
                                ...prev,
                                stockStatus: [...prev.stockStatus, status],
                              }));
                            } else {
                              setFilters((prev) => ({
                                ...prev,
                                stockStatus: prev.stockStatus.filter(
                                  (s) => s !== status
                                ),
                              }));
                            }
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
                      value={filters.priceRange.min}
                      onChange={(e) =>
                        setFilters((prev) => ({
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
                      value={filters.priceRange.max}
                      onChange={(e) =>
                        setFilters((prev) => ({
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
                          checked={filters.manufacturer.includes(manufacturer)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters((prev) => ({
                                ...prev,
                                manufacturer: [
                                  ...prev.manufacturer,
                                  manufacturer,
                                ],
                              }));
                            } else {
                              setFilters((prev) => ({
                                ...prev,
                                manufacturer: prev.manufacturer.filter(
                                  (m) => m !== manufacturer
                                ),
                              }));
                            }
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
                        checked={filters.inStock}
                        onChange={(e) =>
                          setFilters((prev) => ({
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
                        checked={filters.newProduct}
                        onChange={(e) =>
                          setFilters((prev) => ({
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
                        checked={filters.onSale}
                        onChange={(e) =>
                          setFilters((prev) => ({
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
                    setFilters({
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
                  Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredProducts.length
                  )}{" "}
                  of {filteredProducts.length} results
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
                  <option value="dateAdded">Date Added</option>
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
      </div>
    </AdminLayout>
  );
};

export default AllProducts;
