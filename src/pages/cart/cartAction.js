import {
  deleteCart,
  getUserCart,
  postACart,
  updateCart,
} from "../../helper/axiosHelper";
import { setCartItems } from "./cartSlice";
import { toast } from "react-toastify";

export const getAllCartItemsAction = () => async (dispatch) => {
  const { status, findResult } = await getUserCart();

  if (status === "success") {
    dispatch(setCartItems(findResult));
  }
};

export const setCartItemsAction = () => (dispatch) => {
  const localStorageItemsString = localStorage.getItem("cartItems");
  const localStorageItems = localStorageItemsString
    ? JSON.parse(localStorageItemsString)
    : [];

  if (localStorageItems) {
    dispatch(setCartItems(localStorageItems));
  }
};

export const postNewCartItemAction = (items) => async (dispatch) => {
  const { userId, ...rest } = items;
  if (userId) {
    // for logged in user
    console.log(rest);
    const pending = postACart(rest);

    toast.promise(pending, {
      pending: "Please wait...",
    });

    const { status, message } = await pending;
    toast[status](message);

    if (status === "success") {
      dispatch(getAllCartItemsAction());
    }
  } else {
    // for not logged in user
    dispatch(storeCartInLocalAction(rest));
  }
};

export const postCartItemFromLocal = () => async (dispatch) => {
  console.log("i am in post from local");
  const localStorageItemsString = localStorage.getItem("cartItems");
  const localStorageItems = localStorageItemsString
    ? JSON.parse(localStorageItemsString)
    : [];

  localStorageItems?.map(async (obj) => {
    // Store the object (in local storage) in the database
    const { status } = await postACart(obj);

    if (status === "success") {
      // After a successful storage, remove the object from local storage
      removeStoredObject(obj);
      dispatch(getAllCartItemsAction());
    }
  });
};

// function to remove the object from local storage after storing that object in databse successfully
export const removeStoredObject = (obj) => {
  // Retrieve the array of objects from local storage
  const localStorageItemsString = localStorage.getItem("cartItems");
  const localStorageItems = localStorageItemsString
    ? JSON.parse(localStorageItemsString)
    : [];

  // Find the index of the object in the array
  const index = localStorageItems.findIndex(
    (item) => item._id === obj._id && item.size === obj.size
  );

  // Remove the object from the array
  localStorageItems.splice(index, 1);

  // Update the local storage with the modified array
  localStorage.setItem("cartItems", JSON.stringify(localStorageItems));
};

export const storeCartInLocalAction = (obj) => (dispatch) => {
  // Show "please wait..." message
  toast.info("Please wait...");

  // Simulate the action taking some time to complete
  setTimeout(() => {
    // Retrieve the cart items from local storage
    const localStorageItemsString = localStorage.getItem("cartItems");
    const localStorageItems = localStorageItemsString
      ? JSON.parse(localStorageItemsString)
      : [];

    // Find the index of the item in the existing array
    const existingItemIndex = localStorageItems.findIndex(
      (item) => item._id === obj._id && item.size === obj.size
    );

    if (existingItemIndex !== -1) {
      // If the item exists, update the quantity
      localStorageItems[existingItemIndex].qty = obj.qty;
    } else {
      // If the item doesn't exist, push the new object
      localStorageItems.push(obj);
    }

    // Save the updated array back into local storage
    localStorage.setItem("cartItems", JSON.stringify(localStorageItems));

    toast.success(
      "The product has been successfully added to the cart. Please visit cart to checkout!"
    );

    // Dispatch action to update Redux store
    dispatch(setCartItemsAction());
  }, 3000); // 3000 milliseconds (3 seconds) delay
};

export const updateCartItemAction = (items) => async (dispatch) => {
  console.log(items);
  const { userId, ...rest } = items;
  if (userId) {
    // for logged in user
    const { _id, qty } = rest;
    const { status, message } = await updateCart({
      _id,
      qty,
    });

    if (status === "success") {
      dispatch(getAllCartItemsAction());
    } else {
      toast[status](message);
    }
  } else {
    // for not logged in user
    const { _id, userId, ...obj } = rest;
    dispatch(updateCartInLocalAction(obj));
  }
};

export const updateCartInLocalAction = (obj) => (dispatch) => {
  console.log(obj);
  // Retrieve the cart items from local storage
  const localStorageItemsString = localStorage.getItem("cartItems");
  const localStorageItems = JSON.parse(localStorageItemsString);

  // Find the index of the item in the existing array in local storage
  const existingItemIndex = localStorageItems.findIndex(
    (currentItem) =>
      currentItem.productId === obj.productId && currentItem.size === obj.size
  );

  if (existingItemIndex !== -1) {
    // If the item exists, update the quantity
    localStorageItems[existingItemIndex].qty = obj.qty;
  }

  // Save the updated array back into local storage
  localStorage.setItem("cartItems", JSON.stringify(localStorageItems));

  // Dispatch action to update Redux store
  dispatch(setCartItemsAction());
};

export const deleteCartItemAction = (items) => async (dispatch) => {
  console.log(items);
  const { userId, ...rest } = items;
  if (userId) {
    // for logged in user
    const { cartId } = rest;
    const { status, message } = await deleteCart({ _id: cartId });

    toast[status](message);

    if (status === "success") {
      dispatch(getAllCartItemsAction());
    }
  } else {
    // for not logged in user
    dispatch(deleteCartInLocalAction(rest));
  }
};

export const deleteCartInLocalAction = (obj) => (dispatch) => {
  console.log(obj);
  // Retrieve the cart items from local storage
  const localStorageItemsString = localStorage.getItem("cartItems");
  const localStorageItems = JSON.parse(localStorageItemsString);
  console.log(localStorageItems);
  // Find the index of the item in the existing array in local storage
  const existingItemIndex = localStorageItems.findIndex(
    (currentItem) =>
      currentItem.productId === obj.productId &&
      currentItem.size === obj.selectedSize
  );

  console.log(existingItemIndex);

  if (existingItemIndex !== -1) {
    // take out the current item from localStorageItems
    localStorageItems.splice(existingItemIndex, 1);
  }

  console.log(localStorageItems);
  // Save the updated array back into local storage
  localStorage.setItem("cartItems", JSON.stringify(localStorageItems));

  // Dispatch action to update Redux store
  dispatch(setCartItemsAction());
};
