import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
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
    // Generic Start Action
    ProductActionStart: (state, action) => {
      state.isFetching = true;
      state.error = false;
      state.errMsg = "";
    },

    // Generic Failure Action
    ProductActionFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.errMsg = action.payload;
    },

    // Success Actions with specific logic
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
          break;

        case "DELETE_PRODUCT":
          state.products = state.products.filter(
            (product) => product.id !== payload
          );
          state.stats.totalProducts = Math.max(
            0,
            state.stats.totalProducts - 1
          );
          break;

        case "BULK_IMPORT":
        case "EXPORT_PRODUCTS":
          // These actions just need to stop loading
          break;

        default:
          break;
      }
    },

    // Filter Actions
    SetProductFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    ClearProductFilters: (state, action) => {
      state.filters = {
        search: "",
        category: "",
        status: "",
        sortBy: "createdAt",
        sortOrder: "desc",
      };
    },

    // Clear Error
    ClearProductError: (state, action) => {
      state.error = false;
      state.errMsg = "";
      state.isFetching = false;
    },

    // Reset Products State
    ResetProductsState: (state, action) => {
      return {
        ...productSlice.getInitialState(),
      };
    },
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
