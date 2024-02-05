import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./pages/product/productSlice";
import categoryReducer from "./pages/category/categorySlice";

const store = configureStore({
  reducer: {
    productInfo: productReducer,
    categoryInfo: categoryReducer,
  },
});

export default store;
