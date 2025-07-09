import { createSlice } from "@reduxjs/toolkit";

const customerSlice = createSlice({
  name: "customers",
  initialState: {
    customers: [],
    currentCustomer: null,
    stats: {
      totalCustomers: 0,
      activeCustomers: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
    },
    pagination: {
      currentPage: 1,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
    filters: {
      search: "",
      status: "all",
      type: "all",
    },
    isFetching: false,
    error: false,
    errMsg: "",
  },
  reducers: {
    CustomerActionStart: (state) => {
      state.isFetching = true;
      state.error = false;
      state.errMsg = "";
    },
    CustomerActionFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      state.errMsg = action.payload;
    },
    CustomerActionSuccess: (state, action) => {
      const { type, payload } = action.payload;
      state.isFetching = false;
      state.error = false;
      state.errMsg = "";

      switch (type) {
        case "GET_CUSTOMERS":
          state.customers = payload.customers;

          state.stats = payload.stats;
          state.pagination = payload.pagination;
          break;
        // case "GET_SINGLE_CUSTOMER":
        //   state.currentCustomer = payload.customer;
        //   break;
        // case "ADD_CUSTOMER":
        //   state.customers.unshift(payload);
        //   state.stats.totalCustomers += 1;
        //   break;
        // case "UPDATE_CUSTOMER":
        //   const updateIndex = state.customers.findIndex(
        //     (customer) => customer.id === payload.id
        //   );
        //   if (updateIndex !== -1) {
        //     state.customers[updateIndex] = payload;
        //   }
        //   if (
        //     state.currentCustomer &&
        //     state.currentCustomer.id === payload.id
        //   ) {
        //     state.currentCustomer = payload;
        //   }
        //   break;
        case "DELETE_CUSTOMER":
          state.customers = state.customers.filter(
            (customer) => customer.id !== payload
          );
          state.stats.totalCustomers = Math.max(
            0,
            state.stats.totalCustomers - 1
          );
          if (state.currentCustomer && state.currentCustomer.id === payload) {
            state.currentCustomer = null;
          }
          break;
        default:
          break;
      }
    },
    SetCustomerFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    ClearCustomerFilters: (state) => {
      state.filters = {
        search: "",
        status: "all",
        type: "all",
      };
    },
    ClearCustomerError: (state) => {
      state.error = false;
      state.errMsg = "";
      state.isFetching = false;
    },
    ResetCustomersState: () => customerSlice.getInitialState(),
  },
});

export const {
  CustomerActionStart,
  CustomerActionSuccess,
  CustomerActionFailure,
  SetCustomerFilters,
  ClearCustomerFilters,
  ClearCustomerError,
  ResetCustomersState,
} = customerSlice.actions;

export default customerSlice.reducer;
