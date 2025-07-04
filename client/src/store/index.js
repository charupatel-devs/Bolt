import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "../store/admin/adminAuthSlice";
import userAuthReducer from "../store/customer/userAuthSlice";
import productReducer from "../store/customer/productSlice";

import customerProductsReducer from "../store/customer/customerProductSlice";
import userAuthReducer from "../store/customer/userAuthSlice";
import adminCategoriesReducer from "./admin/adminCategorySlice";
import adminOrderReducer from "./admin/adminOrderSlice";
import adminProductReducer from "./admin/adminProductSlice";
export default configureStore({
  reducer: {
    //admin
    adminAuth: adminAuthReducer,
    userAuth: userAuthReducer,
    product: productReducer,
    categories: adminCategoriesReducer,
    products: adminProductReducer,
    orders: adminOrderReducer,
    //customer
    userAuth: userAuthReducer,
    customerProducts: customerProductsReducer,
  },
});
