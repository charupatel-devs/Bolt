import toast from "react-hot-toast";
import {
  ProductActionFailure,
  ProductActionStart,
  ProductActionSuccess,
} from "../../store/admin/adminProductSlice";
import api from "../api";

// Toast options
const ErrorToastOptions = {
  duration: 4000,
  style: {
    background: "#f87171",
    color: "#fff",
  },
};

const SuccessToastOptions = {
  duration: 3000,
  style: {
    background: "#4ade80",
    color: "#000",
  },
};

// Parse error function
const parseError = (error) => {
  if (error.response) {
    return error.response.data.message || "Invalid credentials";
  } else if (error.request) {
    return "Network error. Please check your connection.";
  } else {
    return "Something went wrong. Please try again.";
  }
};
export const addProduct = async (productData, dispatch) => {
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

    dispatch(
      ProductActionSuccess({
        type: "ADD_PRODUCT",
        payload: data.product,
      })
    );
    // toast.custom((t) => <ViewProductToast t={t} />, {
    //   duration: 8000,
    //   position: "top-center",
    // });

    return data;
  } catch (error) {
    const errorMessage = parseError(error);
    dispatch(ProductActionFailure(errorMessage));
    toast.error(errorMessage, ErrorToastOptions);
    throw new Error("Error adding product: " + errorMessage);
  }
};

export const getAllProducts = async (dispatch, params = {}) => {
  try {
    const {
      page = "",
      limit = "5",
      search = "",
      category = "",
      status = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;

    dispatch(ProductActionStart());

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder,
    });

    if (search) queryParams.append("search", search);
    if (category) queryParams.append("category", category);
    if (status) queryParams.append("status", status);

    const queryString = queryParams.toString();
    const { data } = await api.get(`/admin/products?${queryString}`);

    if (data?.products) {
      dispatch(ProductActionSuccess({ type: "GET_PRODUCTS", payload: data }));
      toast.success("Products loaded!", SuccessToastOptions);
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    const errorMessage = parseError(error);
    dispatch(ProductActionFailure(errorMessage));
    toast.error(errorMessage, ErrorToastOptions);
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
    // Dispatch start action
    dispatch(ProductActionStart());

    const { data } = await api.delete(`/admin/products/delete/${productId}`);

    if (data.success) {
      dispatch(
        ProductActionSuccess({
          type: "DELETE_PRODUCT",
          payload: productId,
        })
      );
      toast.success("Product deleted!", SuccessToastOptions);

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
export const getProductById = async (dispatch, productId) => {
  try {
    console.log("🚀 Service: Fetching product by ID:", productId);

    // Dispatch start action
    dispatch(ProductActionStart());

    const { data } = await api.get(`/products/${productId}`);

    console.log("✅ Service: Product fetched successfully:", data);

    if (data.success && data.product) {
      // For single product fetch, you might want a different action
      dispatch(
        ProductActionSuccess({
          type: "GET_SINGLE_PRODUCT",
          payload: data,
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
// Returns a promise resolving to a list of products for the given categoryId
export const getProductNameByCategory = async (dispatch, categoryId) => {
  try {
    if (!categoryId) {
      dispatch(ProductActionFailure("No category selected"));
      toast.error("Please select a category first.", ErrorToastOptions);
      return [];
    }

    dispatch(ProductActionStart());

    const { data } = await api.get(`/products/names?category=${categoryId}`);

    if (data.products.length) {
      dispatch(
        ProductActionSuccess({
          type: "GET_PRODUCT_NAMES",
          payload: data,
        })
      );
      toast.success("Product names loaded!", SuccessToastOptions);
    } else {
      dispatch(ProductActionFailure("No products found for this category"));
      toast.error("No products found for this category.", ErrorToastOptions);
    }
    return products;
  } catch (error) {
    const errorMessage = parseError(error);
    dispatch(ProductActionFailure(errorMessage));
    toast.error(errorMessage, ErrorToastOptions);
    return [];
  }
};
