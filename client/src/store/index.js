import { configureStore } from "@reduxjs/toolkit";

import { default as productReducer } from "../store/customer/productSlice";
import userAuthReducer from "../store/customer/userAuthSlice";

// Admin slices
import adminAuthReducer from "../store/admin/adminAuthSlice";
import adminCategoriesReducer from "./admin/adminCategorySlice";
import adminCustReducer from "./admin/adminCustomerSlice";
import adminOrderReducer from "./admin/adminOrderSlice";
import adminProductReducer from "./admin/adminProductSlice";
import adminStockReducer from "./admin/adminStockSlice";
// Customer product slice
import cartReducer from "../store/customer/cartSlice"; 
// import orderReducer from "./customer/orderSlice"; 

export default configureStore({
  reducer: {
    // Admin-related state
    adminAuth: adminAuthReducer,
    categories: adminCategoriesReducer,
    products: adminProductReducer,
    orders: adminOrderReducer,
    customers: adminCustReducer,
    stocks: adminStockReducer,
    //customer

    // Customer-related state
    userAuth: userAuthReducer,
    product: productReducer,
    cart: cartReducer,       
    // order: orderReducer, 
  },
});
