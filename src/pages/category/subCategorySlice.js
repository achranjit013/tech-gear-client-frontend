import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  subCategories: [],
  selectedSubCategory: {},
};

const subCategorySlice = createSlice({
  name: "subCategories",
  initialState,
  reducers: {
    setSubCategories: (state, { payload = [] }) => {
      state.subCategories = payload;
    },
    setSelectedSubCategory: (state, { payload }) => {
      state.selectedSubCategory = payload;
    },
  },
});

const { reducer, actions } = subCategorySlice;

export const { setSubCategories, setSelectedSubCategory } = actions;
export default reducer;
