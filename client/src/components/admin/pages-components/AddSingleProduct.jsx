import { FileText, Image, Package, Save, X } from "lucide-react";

const AddSingleProduct = ({
  formData,
  handleInputChange,
  isFetching,
  categories,
  dragActive,
  setDragActive,
  handleDrag,
  handleDrop,
  handleImageUpload,
  handleSubmit,
  loading,
  categoryAttributes,
  selectedCategory,
  renderSpecificationInput,
  currentTag,
  setCurrentTag,
  addTag,
  removeTag,
}) => {
  return (
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
          <div className="lg:col-span-3">
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
  );
};

export default AddSingleProduct;
