import { createSlice } from "@reduxjs/toolkit";

// Initialize state from localStorage
const token = localStorage.getItem("userToken");
const userData = JSON.parse(localStorage.getItem("userData"));

const initialState = {
  user: userData || null,
  token: token || null,
  loading: false,
  error: null,
};

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    // Login actions
    UserLoginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    UserLoginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;

      // Store in localStorage
      localStorage.setItem("userToken", action.payload.token);
      localStorage.setItem("userData", JSON.stringify(action.payload.user));
    },
    UserLoginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Register actions
    UserRegisterStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    UserRegisterSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;

      // Store in localStorage
      localStorage.setItem("userToken", action.payload.token);
      localStorage.setItem("userData", JSON.stringify(action.payload.user));
    },
    UserRegisterFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Logout actions
    UserLogoutStart: (state) => {
      state.loading = true;
    },
    UserLogoutSuccess: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;

      // Remove from localStorage
      localStorage.removeItem("userToken");
      localStorage.removeItem("userData");
    },

    // Clear error (optional utility reducer)
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
  UserLogoutStart,
  UserLogoutSuccess,
  ClearUserError,
} = userAuthSlice.actions;

export default userAuthSlice.reducer;