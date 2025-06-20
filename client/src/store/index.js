import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "./admin/adminAuthSlice";
import adminCategoriesReducer from "./admin/adminCategorySlice";

export default configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    categories: adminCategoriesReducer,
    // Add other reducers here as you create them
  },
});
