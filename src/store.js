import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./pages/product/productSlice";
import categoryReducer from "./pages/category/categorySlice";
import cartReducer from "./pages/cart/cartSlice";
import userReducer from "./pages/user/userSlice";
import orderReducer from "./pages/orderHistory/orderSlice";
import modalReducer from "./components/modal/modalSlice";
import reviewReducer from "./pages/product/reviewSlice";

const store = configureStore({
  reducer: {
    productInfo: productReducer,
    categoryInfo: categoryReducer,
    cartInfo: cartReducer,
    userInfo: userReducer,
    orderInfo: orderReducer,
    modalInfo: modalReducer,
    reviewInfo: reviewReducer,
  },
});

export default store;
