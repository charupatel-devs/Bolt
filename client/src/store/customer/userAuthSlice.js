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
    UserLogoutStart: (state) => {
      state.loading = true;
    },
    UserLogoutSuccess: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  UserLoginStart,
  UserLoginSuccess,
  UserLoginFailure,
  UserLogoutStart,
  UserLogoutSuccess,
} = userAuthSlice.actions;

export default userAuthSlice.reducer;
