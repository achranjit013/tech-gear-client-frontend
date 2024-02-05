import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  selectedCategory: {},
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories: (state, { payload = [] }) => {
      state.categories = payload;
    },
    setSelectedCategory: (state, { payload }) => {
      state.selectedCategory = payload;
    },
  },
});

const { reducer, actions } = categorySlice;

export const { setCategories, setSelectedCategory } = actions;
export default reducer;
