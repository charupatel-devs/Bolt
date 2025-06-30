import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "../store/admin/adminAuthSlice";
import customerProductsReducer from "../store/customer/customerProductSlice";
import userAuthReducer from "../store/customer/userAuthSlice";
import adminCategoriesReducer from "./admin/adminCategorySlice";
import adminProductReducer from "./admin/adminProductSlice";

export default configureStore({
  reducer: {
    //admin
    adminAuth: adminAuthReducer,
    categories: adminCategoriesReducer,
    products: adminProductReducer,

    //customer
    userAuth: userAuthReducer,
    customerProducts: customerProductsReducer,
  },
});
