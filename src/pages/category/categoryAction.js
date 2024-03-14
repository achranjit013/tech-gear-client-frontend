import { getCategories, getSubCategories } from "../../helper/axiosHelper";
import { setSelectedCategory } from "./categorySlice";
import { setSelectedSubCategory } from "./subCategorySlice";

export const getSelectedProductCategoryAction = (_id) => async (dispatch) => {
  const { status, findResult } = await getCategories(_id);

  if (status === "success") {
    dispatch(setSelectedCategory(findResult));
  }
};

export const getSelectedProductSubCategoryAction =
  (_id) => async (dispatch) => {
    const { status, findResult } = await getSubCategories(_id);

    if (status === "success") {
      dispatch(setSelectedSubCategory(findResult));
    }
  };
