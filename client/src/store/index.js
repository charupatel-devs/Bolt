import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "./admin/adminAuthSlice";

export default configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    // Add other reducers here as you create them
  },
});
