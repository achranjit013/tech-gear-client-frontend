import { getProducts } from "../../helper/axiosHelper";
import {
  setCartItems,
  setLatestArrivals,
  setSelectedProduct,
} from "./productSlice";

export const getLatestArrivalsAction = () => async (dispatch) => {
  console.log("i am in product action");
  const { status, findResult } = await getProducts();
  console.log(findResult);

  if (status === "success") {
    dispatch(setLatestArrivals(findResult));
  }
};

export const getSelectedProductAction = (slug) => async (dispatch) => {
  const { status, findResult } = await getProducts(slug);
  console.log(findResult);

  if (status === "success") {
    dispatch(setSelectedProduct(findResult));
  }
};

export const setCartItemsAction = (items) => (dispatch) => {
  console.log(items);
  dispatch(setCartItems(items));
};
