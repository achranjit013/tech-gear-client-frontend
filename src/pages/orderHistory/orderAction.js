import { getOrders } from "../../helper/axiosHelper";
import { setOrders, setTenOrders } from "./orderSlice";

export const getAllOrdersAction = (obj) => async (dispatch) => {
  const { findResult, status } = await getOrders(obj);

  if (status === "success") {
    dispatch(setOrders(findResult));
  }
};

export const getTenOrdersAction = (obj) => async (dispatch) => {
  const { findResult, status } = await getOrders(obj);

  if (status === "success") {
    dispatch(setTenOrders(findResult));
  }
};
