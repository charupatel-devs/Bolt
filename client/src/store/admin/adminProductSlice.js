import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    currentProduct: [], // Added for single product storage
    currentCategory: [],
    stats: {
      totalProducts: 0,
      categories: 0,
      lowStockItems: 0,
      outOfStock: 0,
    },
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalProducts: 0,
      limit: 50,
      hasNextPage: false,
      hasPrevPage: false,
    },
    filters: {
      search: "",
      category: "",
      status: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    },
    isFetching: false,
    error: false,
    errMsg: "",
  },
  reducers: {
    ProductActionStart: (state) => {
      state.isFetching = true;
      state.error = false;
      state.errMsg = "";
    },
    ProductActionFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.errMsg = action.payload;
    },
    ProductActionSuccess: (state, action) => {
      const { type, payload } = action.payload;
      state.isFetching = false;
      state.error = false;
      state.errMsg = "";

      switch (type) {
        case "GET_PRODUCTS":
          state.products = payload.products;
          state.stats = payload.stats;
          state.pagination = payload.pagination;
          break;
        case "GET_SINGLE_PRODUCT": // New case
          state.currentCategory = payload.category;

          state.currentProduct = payload.product;

          break;
        case "ADD_PRODUCT":
          state.products.unshift(payload);
          state.stats.totalProducts += 1;
          break;
        case "UPDATE_PRODUCT":
          const updateIndex = state.products.findIndex(
            (product) => product.id === payload.id
          );
          if (updateIndex !== -1) {
            state.products[updateIndex] = payload;
          }
          // Also update currentProduct if it's the same product
          if (state.currentProduct && state.currentProduct.id === payload.id) {
            state.currentProduct = payload;
          }
          break;
        case "DELETE_PRODUCT":
          state.products = state.products.filter(
            (product) => product.id !== payload
          );
          state.stats.totalProducts = Math.max(
            0,
            state.stats.totalProducts - 1
          );
          // Clear current product if it's the deleted one
          if (state.currentProduct && state.currentProduct.id === payload) {
            state.currentProduct = null;
          }
          break;
        case "BULK_IMPORT":
        case "EXPORT_PRODUCTS":
          break;
        default:
          break;
      }
    },
    SetProductFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    ClearProductFilters: (state) => {
      state.filters = {
        search: "",
        category: "",
        status: "",
        sortBy: "createdAt",
        sortOrder: "desc",
      };
    },
    ClearProductError: (state) => {
      state.error = false;
      state.errMsg = "";
      state.isFetching = false;
    },
    ResetProductsState: () => productSlice.getInitialState(),
  },
});

export const {
  ProductActionStart,
  ProductActionSuccess,
  ProductActionFailure,
  SetProductFilters,
  ClearProductFilters,
  ClearProductError,
  ResetProductsState,
} = productSlice.actions;

export default productSlice.reducer;
