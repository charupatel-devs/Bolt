// adminOrderSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  recentOrders: [],
  stats: {
    today: {
      total: 0,
      revenue: 0,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      refunded: 0,
      returns: 0,
    },
    week: {
      total: 0,
      revenue: 0,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      refunded: 0,
      returns: 0,
    },
    month: {
      total: 0,
      revenue: 0,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      refunded: 0,
      returns: 0,
    },
  },
  isFetching: false,
  error: null,
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
    fetchRecentOrdersSuccess: (state, action) => {
      state.loading = false;
      state.recentOrders = action.payload.recentOrders;
      state.stats = action.payload.stats || [];
      state.error = null;
    },
    fetchOrdersSuccess: (state, action) => {
      state.loading = false;
      state.orders = action.payload || [];
      state.error = null;
    },
    fetchOrdersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchRecentOrdersSuccess,
  fetchOrdersFailure,
} = adminOrderSlice.actions;

export default adminOrderSlice.reducer;
