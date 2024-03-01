import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  tenOrders: [],
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, { payload = [] }) => {
      state.orders = payload;
    },
    setTenOrders: (state, { payload = [] }) => {
      state.tenOrders = payload;
    },
  },
});

const { reducer, actions } = orderSlice;

export const { setOrders, setTenOrders } = actions;
export default reducer;
