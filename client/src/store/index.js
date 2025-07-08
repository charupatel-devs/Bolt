import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "../store/admin/adminAuthSlice";
import {
  default as customerProductsReducer,
  default as productReducer,
} from "../store/customer/productSlice";
import userAuthReducer from "../store/customer/userAuthSlice";
import adminCategoriesReducer from "./admin/adminCategorySlice";
import adminCustReducer from "./admin/adminCustomerSlice";
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
    customers: adminCustReducer,
    //customer
    userAuth: userAuthReducer,
    customerProducts: customerProductsReducer,
  },
});
