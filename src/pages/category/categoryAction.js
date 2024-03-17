import { getCategories, getSubCategories } from "../../helper/axiosHelper";
import { setCategories, setSelectedCategory } from "./categorySlice";
import { setSelectedSubCategory } from "./subCategorySlice";

export const getSelectedCategoryAction = (obj) => async (dispatch) => {
  const { status, findResult } = await getCategories(obj);

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

export const getAllCategoriesAction = () => async (dispatch) => {
  const { status, findResult } = await getCategories();

  if (status === "success") {
    dispatch(setCategories(findResult));
  }
};
