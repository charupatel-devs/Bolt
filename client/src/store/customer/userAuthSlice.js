import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
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
      state.user = action.payload;
      state.error = null;
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
      state.user = action.payload;
      state.error = null;
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
      state.loading = false;
      state.error = null;
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
