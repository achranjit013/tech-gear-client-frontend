import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  featuredProducts: [],
  selectedProduct: {},
  favouriteProducts: [],
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, { payload = [] }) => {
      state.products = payload;
    },
    setFeaturedProducts: (state, { payload = [] }) => {
      state.featuredProducts = payload;
    },
    setSelectedProduct: (state, { payload }) => {
      state.selectedProduct = payload;
    },
    setFavouriteProducts: (state, { payload = [] }) => {
      state.favouriteProducts = payload;
    },
  },
});

const { reducer, actions } = productSlice;

export const {
  setProducts,
  setFeaturedProducts,
  setSelectedProduct,
  setFavouriteProducts,
} = actions;
export default reducer;
