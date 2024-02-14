import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  selectedCartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, { payload = [] }) => {
      state.cartItems = [...payload];
    },
    setSelectedCartItems: (state, { payload = [] }) => {
      state.selectedCartItems = [...payload];
    },
  },
});

const { reducer, actions } = cartSlice;

export const { setCartItems, setSelectedCartItems } = actions;
export default reducer;
