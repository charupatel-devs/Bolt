import { createSlice } from "@reduxjs/toolkit";

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState: {
    admin: null,
    isAuthenticated: false,
    isFetching: false,
    error: false,
    errMsg: "",
  },
  reducers: {
    // Login Actions
    AdminLoginStart: (state, action) => {
      state.isFetching = true;
      state.error = false;
      state.errMsg = "";
    },
    AdminLoginSuccess: (state, action) => {
      state.admin = action.payload.admin;
      state.isAuthenticated = true;
      state.isFetching = false;
      state.error = false;
      state.errMsg = "";
    },
    AdminLoginFailure: (state, action) => {
      state.admin = null;
      state.isAuthenticated = false;
      state.isFetching = false;
      state.error = true;
      state.errMsg = action.payload;
    },

    // Get Profile Actions
    GetAdminProfileStart: (state, action) => {
      state.isFetching = true;
      state.error = false;
    },
    GetAdminProfileSuccess: (state, action) => {
      state.admin = action.payload;
      state.isAuthenticated = true;
      state.isFetching = false;
      state.error = false;
      state.errMsg = "";
    },
    GetAdminProfileFailure: (state, action) => {
      state.admin = null;
      state.isAuthenticated = false;
      state.isFetching = false;
      state.error = true;
      state.errMsg = action.payload;
    },

    // Logout Actions
    AdminLogoutStart: (state, action) => {
      state.isFetching = true;
      state.error = false;
    },
    AdminLogoutSuccess: (state, action) => {
      state.admin = null;
      state.isAuthenticated = false;
      state.isFetching = false;
      state.error = false;
      state.errMsg = "";
    },
    AdminLogoutFailure: (state, action) => {
      // Even on failure, we logout locally
      state.admin = null;
      state.isAuthenticated = false;
      state.isFetching = false;
      state.error = false;
      state.errMsg = "";
    },

    // Clear Error
    ClearAdminError: (state, action) => {
      state.error = false;
      state.errMsg = "";
      state.isFetching = false;
    },

    // Set Authentication Status
    SetAuthenticationStatus: (state, action) => {
      state.isAuthenticated = action.payload;
      if (!action.payload) {
        state.admin = null;
      }
    },
  },
});

export const {
  AdminLoginStart,
  AdminLoginSuccess,
  AdminLoginFailure,
  GetAdminProfileStart,
  GetAdminProfileSuccess,
  GetAdminProfileFailure,
  AdminLogoutStart,
  AdminLogoutSuccess,
  AdminLogoutFailure,
  ClearAdminError,
  SetAuthenticationStatus,
} = adminAuthSlice.actions;

export default adminAuthSlice.reducer;
