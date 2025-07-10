import toast from "react-hot-toast";

import {
  createCategoryFailure,
  createCategoryStart,
  createCategorySuccess,
  deleteCategoryFailure,
  deleteCategoryStart,
  deleteCategorySuccess,
  fetchCategoriesFailure,
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  updateCategoryFailure,
  updateCategoryStart,
  updateCategorySuccess,
} from "../../store/admin/adminCategorySlice";
import api from "../api"; // Adjust path if needed

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

// Get all categories
export const fetchCategories = async (dispatch) => {
  dispatch(fetchCategoriesStart());
  try {
    const { data } = await api.get("/categories");
    if (data.success) {
      dispatch(fetchCategoriesSuccess(data.data));
      // toast.success("Categories loaded!", SuccessToastOptions);
    } else {
      dispatch(
        fetchCategoriesFailure(data.message || "Failed to fetch categories")
      );
      toast.error(
        data.message || "Failed to fetch categories",
        ErrorToastOptions
      );
    }
  } catch (error) {
    const errMsg = parseError(error);
    dispatch(fetchCategoriesFailure(errMsg));
    toast.error(errMsg, ErrorToastOptions);
  }
};

// Create new category
export const createCategory = async (categoryData, dispatch) => {
  dispatch(createCategoryStart());
  try {
    const { data } = await api.post("/categories/create", categoryData);
    if (data.success) {
      dispatch(createCategorySuccess(data.data));
      toast.success("Category created!", SuccessToastOptions);
    } else {
      dispatch(
        createCategoryFailure(data.message || "Failed to create category")
      );
      toast.error(
        data.message || "Failed to create category",
        ErrorToastOptions
      );
    }
  } catch (error) {
    const errMsg = parseError(error);
    dispatch(createCategoryFailure(errMsg));
    toast.error(errMsg, ErrorToastOptions);
  }
};

// Update category
export const updateCategory = async (categoryId, categoryData, dispatch) => {
  dispatch(updateCategoryStart());
  try {
    const { data } = await api.put(
      `/categories/update/${categoryId}`,
      categoryData
    );
    if (data.success) {
      dispatch(updateCategorySuccess(data.data));
      toast.success("Category updated!", SuccessToastOptions);
    } else {
      dispatch(
        updateCategoryFailure(data.message || "Failed to update category")
      );
      toast.error(
        data.message || "Failed to update category",
        ErrorToastOptions
      );
    }
  } catch (error) {
    const errMsg = parseError(error);
    dispatch(updateCategoryFailure(errMsg));
    toast.error(errMsg, ErrorToastOptions);
  }
};

// Delete category
export const deleteCategory = async (categoryId, dispatch) => {
  dispatch(deleteCategoryStart());
  try {
    const { data } = await api.delete(`/categories/delete/${categoryId}`);
    if (data.success) {
      dispatch(deleteCategorySuccess(categoryId));
      toast.success("Category deleted!", SuccessToastOptions);
    } else {
      dispatch(
        deleteCategoryFailure(data.message || "Failed to delete category")
      );
      toast.error(
        data.message || "Failed to delete category",
        ErrorToastOptions
      );
    }
  } catch (error) {
    const errMsg = parseError(error);
    dispatch(deleteCategoryFailure(errMsg));
    toast.error(errMsg, ErrorToastOptions);
  }
};

// Add attribute to category
export const addCategoryAttribute = async (
  categoryId,
  attributeData,
  dispatch
) => {
  dispatch(updateCategoryStart());
  try {
    const { data } = await api.post(
      `/admin/categories/${categoryId}/attributes`,
      attributeData
    );
    if (data.success) {
      dispatch(updateCategorySuccess(data.data));
      toast.success("Attribute added!", SuccessToastOptions);
    } else {
      dispatch(
        updateCategoryFailure(data.message || "Failed to add attribute")
      );
      toast.error(data.message || "Failed to add attribute", ErrorToastOptions);
    }
  } catch (error) {
    const errMsg = parseError(error);
    dispatch(updateCategoryFailure(errMsg));
    toast.error(errMsg, ErrorToastOptions);
  }
};

// Update category attribute
export const updateCategoryAttribute = async (
  categoryId,
  attributeId,
  attributeData,
  dispatch
) => {
  dispatch(updateCategoryStart());
  try {
    const { data } = await api.put(
      `/categories/${categoryId}/attributes/${attributeId}`,
      attributeData
    );
    if (data.success) {
      dispatch(updateCategorySuccess(data.data));
      toast.success("Attribute updated!", SuccessToastOptions);
    } else {
      dispatch(
        updateCategoryFailure(data.message || "Failed to update attribute")
      );
      toast.error(
        data.message || "Failed to update attribute",
        ErrorToastOptions
      );
    }
  } catch (error) {
    const errMsg = parseError(error);
    dispatch(updateCategoryFailure(errMsg));
    toast.error(errMsg, ErrorToastOptions);
  }
};

// Remove category attribute
export const removeCategoryAttribute = async (
  categoryId,
  attributeId,
  dispatch
) => {
  dispatch(updateCategoryStart());
  try {
    const { data } = await api.delete(
      `/categories/${categoryId}/attributes/${attributeId}`
    );
    if (data.success) {
      dispatch(updateCategorySuccess(data.data));
      toast.success("Attribute removed!", SuccessToastOptions);
    } else {
      dispatch(
        updateCategoryFailure(data.message || "Failed to remove attribute")
      );
      toast.error(
        data.message || "Failed to remove attribute",
        ErrorToastOptions
      );
    }
  } catch (error) {
    const errMsg = parseError(error);
    dispatch(updateCategoryFailure(errMsg));
    toast.error(errMsg, ErrorToastOptions);
  }
};
