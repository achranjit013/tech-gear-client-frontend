import { getCategories, getSubCategories } from "../../helper/axiosHelper";
import { setCategories, setSelectedCategory } from "./categorySlice";
import { setSelectedSubCategory, setSubCategories } from "./subCategorySlice";

export const getSelectedCategoryAction = (obj) => async (dispatch) => {
  const { status, findResult } = await getCategories(obj);

  if (status === "success") {
    dispatch(setSelectedCategory(findResult));
  }
};

export const getSelectedSubCategoryAction = (obj) => async (dispatch) => {
  const { status, findResult } = await getSubCategories(obj);

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

export const getAllSubCategoriesAction = () => async (dispatch) => {
  const { status, findResult } = await getSubCategories();

  if (status === "success") {
    dispatch(setSubCategories(findResult));
  }
};

export const getSelectedProductSubCategoryAction =
  (_id) => async (dispatch) => {
    const { status, findResult } = await getSubCategories({ _id });

    if (status === "success") {
      dispatch(setSelectedSubCategory(findResult));
    }
  };

export const getSubCategoriesByCategoryIdAction =
  (categoryId) => async (dispatch) => {
    const { status, findResult } = await getSubCategories({ categoryId });

    if (status === "success") {
      dispatch(setSubCategories(findResult));
    }
  };
