import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "../store/admin/adminAuthSlice";
import userAuthReducer from "../store/customer/userAuthSlice";

export default configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    userAuth: userAuthReducer, 
  },
});
