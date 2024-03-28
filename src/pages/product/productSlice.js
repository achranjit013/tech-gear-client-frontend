import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [], //holds all products
  featuredProducts: [], // holds products for latest arrivals in home page and products for selected category
  selectedProduct: {}, // holds one product that has been clicked by user
  favouriteProducts: [], // holds products that has been set favourite by user
  subcategoryProducts: [], // holds products for selected subcategory
  menuProducts: [], // holds products for menu
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
    setSubcategoryProducts: (state, { payload = [] }) => {
      state.subcategoryProducts = payload;
    },
    setMenuProducts: (state, { payload = [] }) => {
      state.menuProducts = payload;
    },
  },
});

const { reducer, actions } = productSlice;

export const {
  setProducts,
  setFeaturedProducts,
  setSelectedProduct,
  setFavouriteProducts,
  setSubcategoryProducts,
  setMenuProducts,
} = actions;
export default reducer;
