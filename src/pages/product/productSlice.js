import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  latestArrivals: [],
  selectedProduct: {},
  cartItems: [],
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, { payload = [] }) => {
      state.products = payload;
    },
    setLatestArrivals: (state, { payload = [] }) => {
      state.latestArrivals = payload;
    },
    setSelectedProduct: (state, { payload }) => {
      state.selectedProduct = payload;
    },
    setCartItems: (state, { payload = [] }) => {
      state.cartItems = [...payload];
    },
  },
});

const { reducer, actions } = productSlice;

export const {
  setProducts,
  setLatestArrivals,
  setSelectedProduct,
  setCartItems,
} = actions;
export default reducer;
