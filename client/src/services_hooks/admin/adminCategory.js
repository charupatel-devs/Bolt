// src/services/categoryService.js
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

// Get all categories
export const fetchCategories = async (dispatch) => {
  dispatch(fetchCategoriesStart());
  try {
    const { data } = await api.get("/categories");
    if (data.success) {
      console.log("Fetched categories:", data.data);
      dispatch(fetchCategoriesSuccess(data.data));
    } else {
      dispatch(
        fetchCategoriesFailure(data.message || "Failed to fetch categories")
      );
    }
  } catch (error) {
    dispatch(
      fetchCategoriesFailure(error.response?.data?.message || error.message)
    );
  }
};

// Create new category
export const createCategory = async (categoryData, dispatch) => {
  dispatch(createCategoryStart());
  try {
    const { data } = await api.post("/categories/create", categoryData);
    if (data.success) {
      dispatch(createCategorySuccess(data.data));
    } else {
      dispatch(
        createCategoryFailure(data.message || "Failed to create category")
      );
    }
  } catch (error) {
    dispatch(
      createCategoryFailure(error.response?.data?.message || error.message)
    );
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
    } else {
      dispatch(
        updateCategoryFailure(data.message || "Failed to update category")
      );
    }
  } catch (error) {
    dispatch(
      updateCategoryFailure(error.response?.data?.message || error.message)
    );
  }
};

// Delete category
export const deleteCategory = async (categoryId, dispatch) => {
  dispatch(deleteCategoryStart());
  try {
    const { data } = await api.delete(`/categories/delete/${categoryId}`);
    if (data.success) {
      dispatch(deleteCategorySuccess(categoryId));
    } else {
      dispatch(
        deleteCategoryFailure(data.message || "Failed to delete category")
      );
    }
  } catch (error) {
    dispatch(
      deleteCategoryFailure(error.response?.data?.message || error.message)
    );
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
    } else {
      dispatch(
        updateCategoryFailure(data.message || "Failed to add attribute")
      );
    }
  } catch (error) {
    dispatch(
      updateCategoryFailure(error.response?.data?.message || error.message)
    );
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
    } else {
      dispatch(
        updateCategoryFailure(data.message || "Failed to update attribute")
      );
    }
  } catch (error) {
    dispatch(
      updateCategoryFailure(error.response?.data?.message || error.message)
    );
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
    } else {
      dispatch(
        updateCategoryFailure(data.message || "Failed to remove attribute")
      );
    }
  } catch (error) {
    dispatch(
      updateCategoryFailure(error.response?.data?.message || error.message)
    );
  }
};
