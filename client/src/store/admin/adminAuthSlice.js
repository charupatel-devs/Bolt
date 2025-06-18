import { createSlice } from "@reduxjs/toolkit";

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState: {
    admin: null,
    token: localStorage.getItem("adminToken"),
    isAuthenticated: !!localStorage.getItem("adminToken"),

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
      const { token, admin } = action.payload;
      state.admin = admin;
      state.token = token;
      state.isAuthenticated = true;
      state.isFetching = false;
      state.error = false;
      state.errMsg = "";

      // ✅ Persist token to localStorage
      localStorage.setItem("adminToken", token);
    },
    AdminLoginFailure: (state, action) => {
      state.admin = null;
      state.token = null;
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
      state.token = null;
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
    AdminLogoutSuccess: (state) => {
      state.admin = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isFetching = false;
      state.error = false;
      state.errMsg = "";

      // ✅ Remove token from localStorage
      localStorage.removeItem("adminToken");
    },
    AdminLogoutFailure: (state) => {
      state.admin = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isFetching = false;
      state.error = false;
      state.errMsg = "";

      // ✅ Remove token on failure too
      localStorage.removeItem("adminToken");
    },

    // Clear Error
    ClearAdminError: (state, action) => {
      state.error = false;
      state.errMsg = "";
    },

    // Check Initial Auth
    CheckInitialAuth: (state) => {
      const token = localStorage.getItem("adminToken");
      if (token) {
        state.token = token;
        state.isAuthenticated = true;
      } else {
        state.token = null;
        state.isAuthenticated = false;
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
  CheckInitialAuth,
} = adminAuthSlice.actions;

export default adminAuthSlice.reducer;
