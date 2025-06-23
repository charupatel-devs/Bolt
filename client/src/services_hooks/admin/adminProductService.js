import {
  ProductActionFailure,
  ProductActionStart,
  ProductActionSuccess,
} from "../../store/admin/adminProductSlice";
import api from "../api";

export const addProduct = async (productData) => {
  try {
    dispatch(ProductActionStart());
    const formDataToSend = new FormData();

    Object.keys(productData).forEach((key) => {
      if (key === "images") {
        if (productData.images && productData.images.length > 0) {
          productData.images.forEach((imageObj) => {
            if (imageObj.file) {
              formDataToSend.append("images", imageObj.file);
            }
          });
        }
      } else if (key === "specifications") {
        // ✅ Send full specifications object as JSON
        formDataToSend.append(
          "specifications",
          JSON.stringify(productData.specifications)
        );
      } else if (key === "dimensions") {
        if (productData.dimensions) {
          formDataToSend.append(
            "dimensions",
            JSON.stringify(productData.dimensions)
          );
        }
      } else if (key === "tags") {
        if (Array.isArray(productData.tags)) {
          formDataToSend.append(key, JSON.stringify(productData.tags));
        }
      } else if (productData[key] !== undefined && productData[key] !== "") {
        formDataToSend.append(key, String(productData[key]));
      }
    });

    console.log("📦 Service: FormData contents:");
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`${key}:`, value);
    }

    const { data } = await api.post("/admin/products/create", formDataToSend, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (data.success && data.product) {
      dispatch(
        ProductActionSuccess({
          type: "ADD_PRODUCT",
          payload: data.product,
        })
      );
      return data;
    } else {
      dispatch(ProductActionFailure("Failed to add product"));
      throw new Error("Failed to add product");
    }
  } catch (error) {
    console.error("💥 Service: Axios error in addProduct:", error);

    const errorMessage =
      error.response?.data?.message ||
      error.response?.statusText ||
      error.message ||
      "Unknown error adding product";

    dispatch(ProductActionFailure(errorMessage));
    throw new Error("Error adding product: " + errorMessage);
  }
};

export const getAllProducts = async (dispatch, params = {}) => {
  try {
    const {
      page = 1,
      limit = 5,
      search = "",
      category = "",
      status = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;

    // Dispatch start action
    dispatch(ProductActionStart());

    // Build query parameters
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: "5",
      sortBy,
      sortOrder,
    });

    // Add optional parameters only if they have values
    if (search) queryParams.append("search", search);
    if (category) queryParams.append("category", category);
    if (status) queryParams.append("status", status);

    const queryString = queryParams.toString();
    const { data } = await api.get(`/admin/products?${queryString}`);

    if (data) {
      dispatch(
        ProductActionSuccess({
          type: "GET_PRODUCTS",
          payload: data,
        })
      );
    } else {
      console.log("🔍 DEBUG: Invalid API response format:", data);
      dispatch(ProductActionFailure("Invalid response format"));
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("🔍 DEBUG: Error caught in getAllProducts:", error);

    const errorMessage =
      error.response?.data?.message ||
      error.response?.statusText ||
      error.message ||
      "Unknown error fetching products";

    console.log("🔍 DEBUG: Dispatching error:", errorMessage);
    dispatch(ProductActionFailure(errorMessage));
    throw new Error("Error fetching products: " + errorMessage);
  }
};
// Update product
export const updateProductService = async (
  dispatch,
  productId,
  productData
) => {
  try {
    console.log("🚀 Service: Starting product update with data:", productData);

    // Dispatch start action
    dispatch(ProductActionStart());

    const formDataToSend = new FormData();

    Object.keys(productData).forEach((key) => {
      if (key === "images") {
        if (productData.images && productData.images.length > 0) {
          productData.images.forEach((imageObj) => {
            if (imageObj.file) {
              formDataToSend.append("images", imageObj.file);
            }
          });
        }
      } else if (key === "specifications") {
        formDataToSend.append(
          "specifications",
          JSON.stringify(productData.specifications)
        );
      } else if (key === "dimensions") {
        if (productData.dimensions) {
          formDataToSend.append(
            "dimensions",
            JSON.stringify(productData.dimensions)
          );
        }
      } else if (key === "tags") {
        if (Array.isArray(productData.tags)) {
          formDataToSend.append(key, JSON.stringify(productData.tags));
        }
      } else if (productData[key] !== undefined && productData[key] !== "") {
        formDataToSend.append(key, String(productData[key]));
      }
    });

    const { data } = await api.put(
      `/admin/products/${productId}`,
      formDataToSend,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("✅ Service: Product updated successfully:", data);

    if (data.success && data.product) {
      dispatch(
        ProductActionSuccess({
          type: "UPDATE_PRODUCT",
          payload: data.product,
        })
      );
      return data;
    } else {
      dispatch(ProductActionFailure("Failed to update product"));
      throw new Error("Failed to update product");
    }
  } catch (error) {
    console.error("💥 Service: Error updating product:", error);

    const errorMessage =
      error.response?.data?.message ||
      error.response?.statusText ||
      error.message ||
      "Unknown error updating product";

    dispatch(ProductActionFailure(errorMessage));
    throw new Error("Error updating product: " + errorMessage);
  }
};

// Delete product
export const deleteProductService = async (dispatch, productId) => {
  try {
    console.log("🚀 Service: Starting product deletion for ID:", productId);

    // Dispatch start action
    dispatch(ProductActionStart());

    const { data } = await api.delete(`/admin/products/${productId}`);

    console.log("✅ Service: Product deleted successfully:", data);

    if (data.success) {
      dispatch(
        ProductActionSuccess({
          type: "DELETE_PRODUCT",
          payload: productId,
        })
      );
      return data;
    } else {
      dispatch(ProductActionFailure("Failed to delete product"));
      throw new Error("Failed to delete product");
    }
  } catch (error) {
    console.error("💥 Service: Error deleting product:", error);

    const errorMessage =
      error.response?.data?.message ||
      error.response?.statusText ||
      error.message ||
      "Unknown error deleting product";

    dispatch(ProductActionFailure(errorMessage));
    throw new Error("Error deleting product: " + errorMessage);
  }
};

// Get single product by ID
export const getProductByIdService = async (dispatch, productId) => {
  try {
    console.log("🚀 Service: Fetching product by ID:", productId);

    // Dispatch start action
    dispatch(ProductActionStart());

    const { data } = await api.get(`/admin/products/${productId}`);

    console.log("✅ Service: Product fetched successfully:", data);

    if (data.success && data.product) {
      // For single product fetch, you might want a different action
      dispatch(
        ProductActionSuccess({
          type: "GET_SINGLE_PRODUCT",
          payload: data.product,
        })
      );
      return data;
    } else {
      dispatch(ProductActionFailure("Product not found"));
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error("💥 Service: Error fetching product:", error);

    const errorMessage =
      error.response?.data?.message ||
      error.response?.statusText ||
      error.message ||
      "Unknown error fetching product";

    dispatch(ProductActionFailure(errorMessage));
    throw new Error("Error fetching product: " + errorMessage);
  }
};

export const bulkImportProductsService = async (dispatch, csvFile) => {
  try {
    console.log("🚀 Service: Starting bulk import");

    dispatch(ProductActionStart());

    const formData = new FormData();
    formData.append("csvFile", csvFile);

    // Use the correct backend route
    const { data } = await api.post("/admin/products/bulk-upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ Service: Bulk import completed:", data);

    if (data.success) {
      dispatch(
        ProductActionSuccess({
          type: "BULK_IMPORT",
          payload: data,
        })
      );
      return data;
    } else {
      dispatch(ProductActionFailure("Bulk import failed"));
      throw new Error("Bulk import failed");
    }
  } catch (error) {
    console.error("💥 Service: Error in bulk import:", error);

    const errorMessage =
      error.response?.data?.message ||
      error.response?.statusText ||
      error.message ||
      "Unknown error during bulk import";

    dispatch(ProductActionFailure(errorMessage));
    throw new Error("Error during bulk import: " + errorMessage);
  }
};

// Export products
export const exportProductsService = async (
  dispatch,
  format = "csv",
  filters = {}
) => {
  try {
    console.log("🚀 Service: Starting products export");

    // Dispatch start action
    dispatch(ProductActionStart());

    const queryParams = new URLSearchParams({
      format,
      ...filters,
    });

    const { data } = await api.get(
      `/admin/products/export?${queryParams.toString()}`,
      {
        responseType: "blob", // Important for file downloads
      }
    );

    console.log("✅ Service: Products exported successfully");

    dispatch(
      ProductActionSuccess({
        type: "EXPORT_PRODUCTS",
        payload: data,
      })
    );

    return data;
  } catch (error) {
    console.error("💥 Service: Error exporting products:", error);

    const errorMessage =
      error.response?.data?.message ||
      error.response?.statusText ||
      error.message ||
      "Unknown error exporting products";

    dispatch(ProductActionFailure(errorMessage));
    throw new Error("Error exporting products: " + errorMessage);
  }
};
