// adminOrderSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  isFetching: false,
  error: null,
  // currentStatus: null, // Tracks which status is currently loaded
};

const adminOrderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    // ===========================================
    // SINGLE SET OF ACTIONS FOR ALL STATUSES
    // ===========================================
    fetchOrdersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchOrdersSuccess: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
      // state.currentStatus = action.payload.status;
      state.error = null;
    },
    fetchOrdersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchOrdersStart, fetchOrdersSuccess, fetchOrdersFailure } =
  adminOrderSlice.actions;

export default adminOrderSlice.reducer;
