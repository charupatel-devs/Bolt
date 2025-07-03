import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "../store/admin/adminAuthSlice";
import userAuthReducer from "../store/customer/userAuthSlice";
import productReducer from "../store/customer/productSlice";

export default configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    userAuth: userAuthReducer,
    product: productReducer,
  },
});
