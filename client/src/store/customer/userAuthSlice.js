// src/store/customer/userAuthSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Optionally load initial state from localStorage
const storedUser = localStorage.getItem("userData");
const storedToken = localStorage.getItem("userToken");

const initialState = {
  userData: storedUser ? JSON.parse(storedUser) : null,
  userToken: storedToken ? storedToken : null,
  loading: false,
  error: null,
};

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    // LOGIN
    UserLoginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    UserLoginSuccess: (state, action) => {
      state.loading = false;
      state.userData = action.payload.user;
      state.userToken = action.payload.token;
      state.error = null;
      
      // Force immediate localStorage update
      try {
        localStorage.setItem("userData", JSON.stringify(action.payload.user));
        localStorage.setItem("userToken", action.payload.token);
        console.log("✅ localStorage updated:", { 
          userToken: localStorage.getItem("userToken") ? "Present" : "Missing",
          userData: localStorage.getItem("userData") ? "Present" : "Missing"
        });
      } catch (error) {
        console.error("❌ localStorage error:", error);
      }
    },
    UserLoginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // REGISTER
    UserRegisterStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    UserRegisterSuccess: (state, action) => {
      state.loading = false;
      state.userData = action.payload.user;
      state.userToken = action.payload.token;
      state.error = null;
      localStorage.setItem("userData", JSON.stringify(action.payload.user));
      localStorage.setItem("userToken", action.payload.token);
    },
    UserRegisterFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // LOGOUT
    UserLogout: (state) => {
      state.userData = null;
      state.userToken = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("userData");
      localStorage.removeItem("userToken");
    },

    // OPTIONAL utility
    ClearUserError: (state) => {
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  UserLoginStart,
  UserLoginSuccess,
  UserLoginFailure,
  UserRegisterStart,
  UserRegisterSuccess,
  UserRegisterFailure,
  UserLogout,
  ClearUserError,
} = userAuthSlice.actions;

export default userAuthSlice.reducer;
