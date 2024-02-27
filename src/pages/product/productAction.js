import { getProducts } from "../../helper/axiosHelper";
import { setLatestArrivals, setSelectedProduct } from "./productSlice";

export const getLatestArrivalsAction = () => async (dispatch) => {
  const { status, findResult } = await getProducts();

  if (status === "success") {
    dispatch(setLatestArrivals(findResult));
  }
};

export const getSelectedProductAction = (slug) => async (dispatch) => {
  const { status, findResult } = await getProducts(slug);

  if (status === "success") {
    dispatch(setSelectedProduct(findResult));
  }
};

// export const updateProductQtyAction = (slug, size) => async (dispatch) => {
//   const { status, findResult } = await updateProductsQty(slug, size);

//   if (status === "success") {
//     dispatch(setSelectedProduct(findResult));
//   }
// };

// export const setCartItemsAction = (items) => (dispatch) => {
//   dispatch(setCartItems(items));
// };
