import { toast } from "react-toastify";
import {
  deleteAFavourite,
  fetchFavourites,
  getProducts,
  postAFavourite,
} from "../../helper/axiosHelper";
import {
  setFavouriteProducts,
  setFeaturedProducts,
  setSelectedProduct,
} from "./productSlice";

export const getSelectedProductAction = (slug) => async (dispatch) => {
  const { status, findResult } = await getProducts({ slug });

  if (status === "success") {
    dispatch(setSelectedProduct(findResult));
  }
};

export const getFeaturedProductsAction = (obj) => async (dispatch) => {
  const { status, findResult } = await getProducts(obj);

  if (status === "success") {
    dispatch(setFeaturedProducts(findResult));
  }
};

// fetch all favourites
export const getAllFavouriteItemsAction = () => async (dispatch) => {
  const { status, findResult } = await fetchFavourites();

  if (status === "success") {
    dispatch(setFavouriteProducts(findResult));
  }
};

// post new favourite
export const postNewFavouriteItemAction = (items) => async (dispatch) => {
  const { userId, favourite, ...rest } = items;
  if (userId) {
    // for logged in user
    let pending;
    if (!favourite) {
      pending = postAFavourite(rest);
    } else {
      pending = deleteAFavourite(rest);
    }

    toast.promise(pending, {
      pending: "Please wait...",
    });

    const { status, message } = await pending;
    toast[status](message);

    if (status === "success") {
      dispatch(getAllFavouriteItemsAction());
    }
  } else {
    // for not logged in user
    dispatch(storeFavouriteInLocalAction({ favourite, ...rest }));
  }
};

// post favourite items from local to db
export const postFavouriteItemFromLocal = () => async (dispatch) => {
  const localStorageFavouriteItemsString =
    localStorage.getItem("favouriteItems");
  const localStorageItems = localStorageFavouriteItemsString
    ? JSON.parse(localStorageFavouriteItemsString)
    : [];

  const { status } = await postAFavourite({ ids: localStorageItems });

  if (status === "success") {
    //  After a successful storage, remove the object from local storage
    localStorage.removeItem("favouriteItems");
    dispatch(getAllFavouriteItemsAction());
  }
};

// store favourites in local storage
export const storeFavouriteInLocalAction =
  ({ favourite, ...obj }) =>
  async (dispatch) => {
    // Show "please wait..." message
    toast.info("Please wait...", {
      autoClose: 1000, // Close after 1 second
      closeOnClick: false,
      closeButton: false,
    });

    // Simulate the action taking some time to complete
    setTimeout(() => {
      // Retrieve the cart items from local storage
      const localStorageItemsString = localStorage.getItem("favouriteItems");
      let localStorageItems = localStorageItemsString
        ? JSON.parse(localStorageItemsString)
        : [];

      let message = "";

      // if (existingItemIndex !== -1) {
      if (!favourite) {
        // If the product is not in the favourite list, push the new object
        localStorageItems.push(obj);
        message = "The product has been successfully added to your favourite.";
      } else {
        // If the product is in the favourite list, remove it from local storage
        localStorageItems = localStorageItems.filter(
          (item) => item.productId !== obj.productId
        );
        message =
          "The product has been successfully removed from your favourite.";
      }

      // Save the updated array back into local storage
      localStorage.setItem("favouriteItems", JSON.stringify(localStorageItems));

      toast.success(message);

      // Dispatch action to update Redux store
      dispatch(setFavouriteItemsAction());
    }, 1000); // 3000 milliseconds (3 seconds) delay
  };

// dispatch favourites in local to redux
export const setFavouriteItemsAction = () => (dispatch) => {
  const localStorageItemsString = localStorage.getItem("favouriteItems");
  const localStorageItems = localStorageItemsString
    ? JSON.parse(localStorageItemsString)
    : [];

  if (localStorageItems) {
    dispatch(setFavouriteProducts(localStorageItems));
  }
};
