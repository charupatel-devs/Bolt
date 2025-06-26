import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "../store/admin/adminAuthSlice";
import userAuthReducer from "../store/customer/userAuthSlice";
import customerProductsReducer from "../store/customer/customerProductSlice";
export default configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    userAuth: userAuthReducer, 
    customerProducts: customerProductsReducer,
  },
});
