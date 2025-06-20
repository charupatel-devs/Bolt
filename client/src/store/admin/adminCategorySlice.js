// src/store/slices/categoriesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
    selectedCategory: null,
    isFetching: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: false,
    errorMessage: "",
    successMessage: "",
    totalCategories: 0,
    totalProducts: 0,
    totalLowStock: 0,
  },
  reducers: {
    // Clear messages
    clearMessages: (state) => {
      state.error = false;
      state.errorMessage = "";
      state.successMessage = "";
    },

    // Fetch Categories Actions
    fetchCategoriesStart: (state) => {
      state.isFetching = true;
      state.error = false;
      state.errorMessage = "";
    },
    fetchCategoriesSuccess: (state, action) => {
      state.isFetching = false;
      state.categories = action.payload;
      state.totalCategories = action.payload.length;
      state.totalProducts = action.payload.reduce(
        (sum, cat) => sum + (cat.productCount || 0),
        0
      );
      state.totalLowStock = action.payload.reduce(
        (sum, cat) => sum + (cat.lowStockCount || 0),
        0
      );
      state.error = false;
    },
    fetchCategoriesFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.errorMessage = action.payload;
    },

    // Create Category Actions
    createCategoryStart: (state) => {
      state.isCreating = true;
      state.error = false;
      state.errorMessage = "";
      state.successMessage = "";
    },
    createCategorySuccess: (state, action) => {
      state.isCreating = false;
      state.categories.push(action.payload);
      state.totalCategories = state.categories.length;
      state.successMessage = "Category created successfully!";
      state.error = false;
    },
    createCategoryFailure: (state, action) => {
      state.isCreating = false;
      state.error = true;
      state.errorMessage = action.payload;
    },

    // Update Category Actions
    updateCategoryStart: (state) => {
      state.isUpdating = true;
      state.error = false;
      state.errorMessage = "";
      state.successMessage = "";
    },
    updateCategorySuccess: (state, action) => {
      state.isUpdating = false;
      const index = state.categories.findIndex(
        (cat) => cat._id === action.payload._id
      );
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
      state.successMessage = "Category updated successfully!";
      state.error = false;
    },
    updateCategoryFailure: (state, action) => {
      state.isUpdating = false;
      state.error = true;
      state.errorMessage = action.payload;
    },

    // Delete Category Actions
    deleteCategoryStart: (state) => {
      state.isDeleting = true;
      state.error = false;
      state.errorMessage = "";
      state.successMessage = "";
    },
    deleteCategorySuccess: (state, action) => {
      state.isDeleting = false;
      state.categories = state.categories.filter(
        (cat) => cat._id !== action.payload
      );
      state.totalCategories = state.categories.length;
      state.totalProducts = state.categories.reduce(
        (sum, cat) => sum + (cat.productCount || 0),
        0
      );
      state.totalLowStock = state.categories.reduce(
        (sum, cat) => sum + (cat.lowStockCount || 0),
        0
      );
      state.successMessage = "Category deleted successfully!";
      state.error = false;
    },
    deleteCategoryFailure: (state, action) => {
      state.isDeleting = false;
      state.error = true;
      state.errorMessage = action.payload;
    },

    // Set selected category
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },

    // Clear selected category
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },

    // Update single category (for real-time updates)
    updateSingleCategory: (state, action) => {
      const index = state.categories.findIndex(
        (cat) => cat._id === action.payload._id
      );
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
  },
});

export const {
  clearMessages,
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  createCategoryStart,
  createCategorySuccess,
  createCategoryFailure,
  updateCategoryStart,
  updateCategorySuccess,
  updateCategoryFailure,
  deleteCategoryStart,
  deleteCategorySuccess,
  deleteCategoryFailure,
  setSelectedCategory,
  clearSelectedCategory,
  updateSingleCategory,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
