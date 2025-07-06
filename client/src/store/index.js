import { configureStore } from "@reduxjs/toolkit";

import adminAuthReducer from "../store/admin/adminAuthSlice";
import userAuthReducer from "../store/customer/userAuthSlice";

// Admin slices
import adminCategoriesReducer from "./admin/adminCategorySlice";
import adminProductReducer from "./admin/adminProductSlice";
import adminOrderReducer from "./admin/adminOrderSlice";

// Customer product slice
import productReducer from "../store/customer/productSlice";  // rename import if needed

export default configureStore({
  reducer: {
    // Admin-related state
    adminAuth: adminAuthReducer,
    categories: adminCategoriesReducer,
    products: adminProductReducer,
    orders: adminOrderReducer,

    // Customer-related state
    userAuth: userAuthReducer,
    product: productReducer,
  },
});
