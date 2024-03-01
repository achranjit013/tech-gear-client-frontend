import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reviews: [],
};

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    setReviews: (state, { payload = [] }) => {
      state.reviews = payload;
    },
  },
});

const { reducer, actions } = reviewSlice;

export const { setReviews } = actions;
export default reducer;
