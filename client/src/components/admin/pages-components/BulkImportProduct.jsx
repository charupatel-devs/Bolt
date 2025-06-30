import { Download, Upload } from "lucide-react";

const BulkImportProduct = ({
  formData,
  handleInputChange,
  isFetching,
  categories,
  dragActive,
  setDragActive,
  handleDrag,
  handleDrop,
  handleCsvPreview,
  setCsvFile,
  csvFile,
  csvPreview,
  loading,
  handleBulkImport,
  downloadCsvTemplate,
}) => {
  return (
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
  );
};

export default BulkImportProduct;
