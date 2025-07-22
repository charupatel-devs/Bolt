import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  currentProduct: null, // Use null for single object
  currentCategory: null,
  stockAdjustments: [],
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
};

const stockSlice = createSlice({
  name: "stocks",
  initialState,
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
        case "GET_STOCKS":
          state.products = payload.products;
          state.stats = payload.stats;
          state.pagination = payload.pagination;
          break;

        case "GET_STOCK_BY_ID":
          state.currentProduct = payload;
          break;

        case "ADJUST_STOCK":
          // Optionally update the product in products array and currentProduct
          if (
            state.currentProduct &&
            state.currentProduct._id === payload.productId
          ) {
            state.currentProduct.stock = payload.newStock;
          }
          {
            const idx = state.products.findIndex(
              (p) => p._id === payload.productId
            );
            if (idx !== -1) {
              state.products[idx].stock = payload.newStock;
            }
          }
          break;

        case "GET_STOCK_ADJUSTMENTS":
          state.stockAdjustments = payload.adjustments;
          state.pagination = {
            ...state.pagination,
            totalProducts: payload.total,
            totalPages: Math.ceil(payload.total / state.pagination.limit),
          };
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
    ResetProductsState: () => initialState,
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
} = stockSlice.actions;

export default stockSlice.reducer;
