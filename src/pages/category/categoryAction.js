import { getCategories } from "../../helper/axiosHelper";
import { setSelectedCategory } from "./categorySlice";

export const getSelectedProductCategoryAction = (_id) => async (dispatch) => {
  const { status, findResult } = await getCategories(_id);
  console.log(findResult);

  if (status === "success") {
    dispatch(setSelectedCategory(findResult));
  }
};
