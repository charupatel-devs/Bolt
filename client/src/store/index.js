import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "./admin/adminAuthSlice";
import adminCategoriesReducer from "./admin/adminCategorySlice";
import adminProductReducer from "./admin/adminProductSlice";

export default configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    categories: adminCategoriesReducer,
    products: adminProductReducer, // Assuming you have an adminProductReducer
    // Add other reducers here as you create them
  },
});
