import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./pages/product/productSlice";
import categoryReducer from "./pages/category/categorySlice";
import userReducer from "./pages/user/userSlice";

const store = configureStore({
  reducer: {
    productInfo: productReducer,
    categoryInfo: categoryReducer,
    userInfo: userReducer,
  },
});

export default store;
