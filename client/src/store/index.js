import { configureStore } from "@reduxjs/toolkit";

import adminAuthReducer from "../store/admin/adminAuthSlice";
import { default as productReducer } from "../store/customer/productSlice";
import userAuthReducer from "../store/customer/userAuthSlice";
import adminCategoriesReducer from "./admin/adminCategorySlice";
import adminCustReducer from "./admin/adminCustomerSlice";
import adminOrderReducer from "./admin/adminOrderSlice";

// Admin slices
import adminProductReducer from "./admin/adminProductSlice";

// Customer product slice

export default configureStore({
  reducer: {
    // Admin-related state
    adminAuth: adminAuthReducer,
    categories: adminCategoriesReducer,
    products: adminProductReducer,
    orders: adminOrderReducer,
    customers: adminCustReducer,
    //customer

    // Customer-related state
    userAuth: userAuthReducer,
    product: productReducer,
  },
});
