import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./pages/product/productSlice";
import categoryReducer from "./pages/category/categorySlice";
import cartReducer from "./pages/cart/cartSlice";
import userReducer from "./pages/user/userSlice";

const store = configureStore({
  reducer: {
    productInfo: productReducer,
    categoryInfo: categoryReducer,
    cartInfo: cartReducer,
    userInfo: userReducer,
  },
});

export default store;
