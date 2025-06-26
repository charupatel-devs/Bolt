// src/store/customer/customerProductSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

const customerProductSlice = createSlice({
  name: "customerProduct",
  initialState,
  reducers: {
    ProductActionStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    ProductActionSuccess: (state, action) => {
      const { type, payload } = action.payload;

      switch (type) {
        case "GET_CUSTOMER_PRODUCTS":
          state.products = payload.products;
          break;
        case "SELECT_PRODUCT":
          state.selectedProduct = payload;
          break;
        default:
          break;
      }

      state.loading = false;
      state.error = null;
    },
    ProductActionFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
});

export const {
  ProductActionStart,
  ProductActionSuccess,
  ProductActionFailure,
  clearSelectedProduct,
} = customerProductSlice.actions;

export default customerProductSlice.reducer;
