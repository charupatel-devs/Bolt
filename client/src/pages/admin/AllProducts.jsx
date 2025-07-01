import {
  AlertTriangle,
  ArrowUpDown,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Download,
  Grid3X3,
  List,
  Package,
  Search,
  SlidersHorizontal,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import {
  deleteProductService,
  getAllProducts,
} from "../../services_hooks/admin/adminProductService";
import { SetProductFilters } from "../../store/admin/adminProductSlice";

const AllProducts = () => {
  const dispatch = useDispatch();
  const { products, pagination, stats, filters, isFetching, error, errMsg } =
    useSelector((state) => state.products);

  // Local UI states
  const [viewMode, setViewMode] = useState("table");
  const [showFilters, setShowFilters] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [selectedCategory, setSelectedCategory] = useState(
    filters.category || ""
  );
  const [sortBy, setSortBy] = useState(filters.sortBy || "createdAt");
  const [sortOrder, setSortOrder] = useState(filters.sortOrder || "desc");
  const [itemsPerPage, setItemsPerPage] = useState(pagination.limit || 5);
  const [pageNo, setPageNo] = useState(pagination.currentPage || 1);
  // Local filter states
  const [localFilters, setLocalFilters] = useState({
    stockStatus: filters.status ? filters.status.split(",") : [],
    priceRange: { min: filters.priceMin || "", max: filters.priceMax || "" },
    inStock: filters.inStock || false,
    newProduct: filters.newProduct || false,
    onSale: filters.onSale || false,
  });

  // Fetch products
  const fetchProducts = async () => {
    try {
      console.log("Fetching products with filters:");
      await getAllProducts(dispatch, {
        page: pageNo,
        limit: itemsPerPage,
        // search: searchTerm,
        category: selectedCategory,
        status: localFilters.stockStatus.join(","),
        sortBy: sortBy,
        sortOrder,
      });
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [pageNo, itemsPerPage, selectedCategory, localFilters, sortBy, sortOrder]);

  // Derive categories
  const categories = useMemo(() => {
    return [...new Set(products.map((p) => p.category?.name))].filter(Boolean);
  }, [products]);

  // Status helpers
  const getStockStatus = (stock) => {
    if (stock === 0) return "out";
    return stock <= 10 ? "low" : "active";
  };

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
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProductService(dispatch, productId);
        console.log("✅ Product deleted successfully");
      } catch (err) {
        console.error("💥 Failed to delete product:", err);
      }
    }
  };

  // Apply filters
  const filteredProducts = useMemo(() => {
    // Filter by search term (case-insensitive)
    const searchFiltered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Apply other filters as before
    return searchFiltered.filter((product) => {
      const priceMatch =
        (!localFilters.priceRange.min ||
          product.price >= parseFloat(localFilters.priceRange.min)) &&
        (!localFilters.priceRange.max ||
          product.price <= parseFloat(localFilters.priceRange.max));
      const inStockMatch = !localFilters.inStock || product.stock > 0;
      const newProductMatch = !localFilters.newProduct || product.isNewArrival;
      const onSaleMatch = !localFilters.onSale || product.isOnSale;
      return priceMatch && inStockMatch && newProductMatch && onSaleMatch;
    });
  }, [products, searchTerm, localFilters]);

  const paginatedProducts = filteredProducts;

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
              Showing {filteredProducts.length} of {stats.totalProducts}{" "}
              products
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

        {/* Search and Filters */}
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
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
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
                      <span className="text-sm">New Arrivals</span>
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
                      inStock: false,
                      newProduct: false,
                      onSale: false,
                    });
                    setSearchTerm("");
                    setSelectedCategory("");
                    dispatch(
                      SetProductFilters({
                        search: "",
                        category: "",
                        status: "",
                        priceMin: "",
                        priceMax: "",
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
        {!isFetching ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Results Info and Sorting */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Showing {(pagination.currentPage - 1) * itemsPerPage + 1} -{" "}
                    {Math.min(
                      pagination.currentPage * itemsPerPage,
                      stats.totalProducts
                    )}{" "}
                    of {stats.totalProducts} results
                  </span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      const newLimit = Number(e.target.value);
                      setItemsPerPage(newLimit);
                      // Reset to first page when changing page size
                      // dispatch(
                      //   SetProductFilters({
                      //     limit: newLimit,
                      //     currentPage: 1, // Reset to first page
                      //   })
                      // );
                    }}
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
                          onChange={() => {
                            if (
                              selectedProducts.length ===
                              paginatedProducts.length
                            ) {
                              setSelectedProducts([]);
                            } else {
                              setSelectedProducts(
                                paginatedProducts.map((p) => p.id)
                              );
                            }
                          }}
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
                      {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th> */}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedProducts.map((product) => {
                      const status = getStockStatus(product.stock);
                      return (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(product.id)}
                              onChange={() => {
                                setSelectedProducts((prev) =>
                                  prev.includes(product.id)
                                    ? prev.filter((id) => id !== product.id)
                                    : [...prev, product.id]
                                );
                              }}
                              className="rounded"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              {product.primaryImage ? (
                                <img
                                  src={product.primaryImage}
                                  alt={product.name}
                                  className="w-12 h-12 rounded-lg object-cover mr-4"
                                />
                              ) : (
                                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 mr-4" />
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900 mb-1">
                                  {product.name}
                                  {product.isNewArrival && (
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
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {product.sku}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {product.category?.name}
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
                                  : product.stock <= 10
                                  ? "text-yellow-600"
                                  : "text-green-600"
                              }`}
                            >
                              {product.stock}
                            </span>
                            {/* <div className="text-xs text-gray-500">
                            Min: {product.minOrderQuantity}
                          </div> */}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                status
                              )}`}
                            >
                              {getStatusIcon(status)}
                              <span className="ml-1">
                                {getStatusText(status)}
                              </span>
                            </span>
                          </td>
                          {/* <td className="px-6 py-4">
                          <div className="flex items-center space-x-1">
                            {renderStars(product.averageRating || 0)}
                            <span className="text-sm text-gray-600 ml-2">
                              {product.averageRating?.toFixed(1) || 0} (
                              {product.numReviews || 0})
                            </span>
                          </div>
                        </td> */}
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <NavLink
                                to={`/admin/products/edit/${product.id}`}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3"
                              >
                                Edit
                              </NavLink>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Grid View */
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedProducts.map((product) => {
                    const status = getStockStatus(product.stock);
                    return (
                      <div
                        key={product.id}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="relative">
                          {product.primaryImage ? (
                            <img
                              src={product.primaryImage}
                              alt={product.name}
                              className="w-full h-48 object-cover"
                            />
                          ) : (
                            <div className="bg-gray-200 border-2 border-dashed w-full h-48" />
                          )}
                          <div className="absolute top-2 left-2">
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(product.id)}
                              onChange={() => {
                                setSelectedProducts((prev) =>
                                  prev.includes(product.id)
                                    ? prev.filter((id) => id !== product.id)
                                    : [...prev, product.id]
                                );
                              }}
                              className="rounded"
                            />
                          </div>
                          <div className="absolute top-2 right-2 flex flex-col space-y-1">
                            {product.isNewArrival && (
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
                            <p className="text-xs text-gray-500">
                              {product.sku}
                            </p>
                          </div>
                          {/* <div className="mb-2">
                          <div className="flex items-center space-x-1 mb-1">
                            {renderStars(product.averageRating || 0)}
                          </div>
                          <p className="text-xs text-gray-600">
                            {product.averageRating?.toFixed(1) || 0} (
                            {product.numReviews || 0} reviews)
                          </p>
                        </div> */}
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-lg font-bold text-gray-900">
                                ${product.price}
                              </span>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                  status
                                )}`}
                              >
                                {getStatusText(status)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">
                              Stock:{" "}
                              <span
                                className={`font-medium ${
                                  product.stock === 0
                                    ? "text-red-600"
                                    : product.stock <= 10
                                    ? "text-yellow-600"
                                    : "text-green-600"
                                }`}
                              >
                                {product.stock}
                              </span>
                            </p>
                          </div>
                          <div className="flex justify-between items-center">
                            <NavLink
                              to={`/admin/products/edit/${product.id}`}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3"
                            >
                              Edit
                            </NavLink>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Delete
                            </button>
                            {/* <span className="text-xs text-gray-500">
                            {product.category?.name}
                          </span>
                          <div className="flex space-x-1">
                            <button className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors">
                              <Eye className="w-3 h-3" />
                            </button>

                            <NavLink
                              to={`/admin/products/edit/${product?.id}`}
                              className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors"
                            >
                              <Edit className="w-3 h-3" />
                            </NavLink>

                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div> */}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setPageNo(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    <div className="flex space-x-1">
                      {Array.from(
                        { length: Math.min(5, pagination.totalPages) },
                        (_, i) => {
                          const page = i + 1;
                          return (
                            <button
                              key={page}
                              onClick={() => setPageNo(page)}
                              className={`w-8 h-8 text-sm rounded-lg ${
                                pagination.currentPage === page
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        }
                      )}
                    </div>

                    <button
                      onClick={() => setPageNo(pagination.currentPage + 1)}
                      disabled={
                        pagination.currentPage === pagination.totalPages
                      }
                      className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AllProducts;
