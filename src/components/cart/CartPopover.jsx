import React, { useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCartItemsAction } from "../../pages/product/productAction";
import { getProductsForCart } from "../../helper/axiosHelper";
import { Link } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const CartPopover = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.productInfo);
  const [revisedCartItems, setRevisedCartItems] = useState([]);
  const [isShowing, setIsShowing] = useState(false); //to show cart window on mouse hover

  const handleOnMouseEnter = () => {
    setRevisedCartItems([]); // clearing the state on each mouse event

    // grab the product id from cart and fetch fresh product data from database
    cartItems?.map(async ({ slug, size, qty }) => {
      const { findResult } = await getProductsForCart({ slug, size });
      if (findResult?._id) {
        const obj = {
          _id: findResult._id,
          slug: findResult.slug,
          name: findResult.name,
          sku: findResult.sku,
          thumbnail: findResult.thumbnail,
          selectedSize: size,
          selectedQty: qty,
          stockCount: findResult.variants[0]?.qty,
          stockStatus:
            findResult.variants[0]?.qty > 0
              ? findResult.variants[0]?.qty > qty
                ? "in stock"
                : "low in stock"
              : "out of stock",
          price:
            findResult.variants[0]?.salesPrice ?? findResult.variants[0]?.price,
          totalPrice: (
            (findResult.variants[0]?.salesPrice ??
              findResult.variants[0]?.price) * qty
          ).toFixed(2),
          isEnoughQty: !(findResult.variants[0]?.qty < qty),
        };
        setRevisedCartItems((prevArray) => [...prevArray, obj]);
      }
    });
    setIsShowing(true); // for showing cart window
  };

  // update the qty of the item in cart (either add or subtract) function
  const handleOnQtyChange = (item) => {
    // Retrieve the cart items from local storage
    const localStorageItemsString = localStorage.getItem("cartItems");
    const localStorageItems = JSON.parse(localStorageItemsString);

    // Find the index of the item in the existing array in local storage
    const existingItemIndex = localStorageItems.findIndex(
      (currentItem) =>
        currentItem._id === item._id && currentItem.size === item.selectedSize
    );

    // Find the index of the item in the existing array in revisedCartItems
    const existingCartItemIndex = revisedCartItems.findIndex(
      (currentItem) =>
        currentItem._id === item._id &&
        currentItem.selectedSize === item.selectedSize
    );

    if (existingItemIndex !== -1) {
      // If the item exists, update the quantity
      if (item.action === "+") {
        localStorageItems[existingItemIndex].qty += 1;

        // set the updated qty, price for display
        revisedCartItems[existingCartItemIndex].selectedQty += 1;
        revisedCartItems[existingCartItemIndex].totalPrice = (
          revisedCartItems[existingCartItemIndex].price *
          revisedCartItems[existingCartItemIndex].selectedQty
        ).toFixed(2);
      } else if (item.action === "-") {
        if (localStorageItems[existingItemIndex].qty === 1) {
          if (
            window.confirm(
              `Are you sure to remove ${item.name} - ${item.selectedSize} from your cart?`
            )
          ) {
            // take out the current item from localStorageItems
            localStorageItems.splice(existingItemIndex, 1);

            // set the revisedCartItems array with updated values
            setRevisedCartItems(
              revisedCartItems.filter(
                (filterItem) =>
                  filterItem._id !== item._id ||
                  filterItem.selectedSize !== item.selectedSize
              )
            );
          }
        } else {
          // if the qty is more than 1, just decrease the qty
          localStorageItems[existingItemIndex].qty -= 1;

          // set the updated qty, price for display
          revisedCartItems[existingCartItemIndex].selectedQty -= 1;
          revisedCartItems[existingCartItemIndex].totalPrice = (
            revisedCartItems[existingCartItemIndex].price *
            revisedCartItems[existingCartItemIndex].selectedQty
          ).toFixed(2);
        }
      }

      // Save the updated array back into local storage
      localStorage.setItem("cartItems", JSON.stringify(localStorageItems));

      // Dispatch action to update Redux store
      dispatch(setCartItemsAction(localStorageItems));
    }
  };

  // remove item from cart function
  const handleOnRemove = (item) => {
    // Retrieve the cart items from local storage
    const localStorageItemsString = localStorage.getItem("cartItems");
    const localStorageItems = JSON.parse(localStorageItemsString);

    // Find the index of the item in the existing array
    const existingItemIndex = localStorageItems.findIndex(
      (currentItem) =>
        currentItem._id === item._id && currentItem.size === item.selectedSize
    );

    if (existingItemIndex !== -1) {
      // take out the current item from localStorageItems
      localStorageItems.splice(existingItemIndex, 1);

      // Save the updated array back into local storage
      localStorage.setItem("cartItems", JSON.stringify(localStorageItems));

      // Dispatch action to update Redux store
      dispatch(setCartItemsAction(localStorageItems));

      // set the revisedCartItems array with new values
      setRevisedCartItems(
        revisedCartItems.filter(
          (filterItem) =>
            filterItem._id !== item._id ||
            filterItem.selectedSize !== item.selectedSize
        )
      );
    }
  };

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            type="button"
            className="relative inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={() => setIsShowing(false)}
          >
            <div className="top-0.5 absolute left-[1.38rem]">
              {cartItems.length > 0 && (
                <p className="flex h-2 w-2 items-center justify-center rounded-full bg-red-500 p-2 text-xs text-white">
                  {cartItems.reduce((accumulator, item) => {
                    return accumulator + item.qty;
                  }, 0)}
                </p>
              )}
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`${
                !isShowing ? "hidden" : "block"
              } absolute -bottom-[1.5rem] h-6 w-6`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
            show={isShowing}
            onMouseEnter={() => setIsShowing(true)}
            onMouseLeave={() => setIsShowing(false)}
          >
            <Popover.Panel className="absolute right-0 z-10 w-screen max-w-52 xxs:max-w-80 xs:max-w-md sm:max-w-lg transform max-h-[36rem] overflow-y-scroll">
              {/* <CartItems /> */}
              <div className="overflow-x-hidden rounded-md shadow-lg ring-1 ring-black/5 pt-[1.51rem]">
                <div className="bg-gray-50 p-3">
                  <span className="flex flex-col items-start">
                    <span className="text-md font-mono text-gray-900">
                      {revisedCartItems?.length} items in your cart!
                    </span>
                    {/* {!isEnoughQty && (
        <span className="text-white text-xs bg-red-500 rounded-lg p-1">
          ** please adjust the quantity of one or more items in
          your cart as we may have insufficient stock !
        </span>
      )} */}
                  </span>
                </div>

                {/* cart items */}
                {revisedCartItems?.map(
                  (
                    {
                      isEnoughQty,
                      stockStatus,
                      name,
                      price,
                      totalPrice,
                      selectedQty,
                      selectedSize,
                      sku,
                      stockCount,
                      thumbnail,
                      _id,
                    },
                    i
                  ) => (
                    <div key={i} className="bg-gray-50 px-2 py-1">
                      <div className="rounded-md shadow-md flex flex-col xs:flex-row py-0.5 px-0.5 bg-gray-100">
                        <div className="flex items-center">
                          <img
                            src={`http://localhost:8000` + thumbnail}
                            alt="product-image"
                            className="w-full rounded-md xs:w-40 p-2 overflow-hidden"
                          />
                        </div>
                        <div className="flex w-full flex-col xs:flex-row xs:justify-between p-2">
                          <div className="">
                            <h2 className="text-md font-bold uppercase text-gray-900">
                              {name}
                            </h2>
                            <span className="block mt-1 text-xs uppercase text-gray-700">
                              {sku} / {selectedSize}
                            </span>
                            <span
                              className={classNames(
                                stockCount > 0
                                  ? stockCount > selectedQty
                                    ? "bg-green-600"
                                    : "bg-orange-600"
                                  : "bg-red-600",
                                "text-xs text-white px-1.5 py-0.5 rounded-full"
                              )}
                            >
                              {stockStatus}
                            </span>
                          </div>
                          <div className="mt-4 flex justify-between xs:space-y-2 xs:mt-0 xs:block">
                            <div className="flex items-center border-gray-100">
                              <button
                                disabled={!(stockCount > 0)}
                                className="cursor-pointer rounded-l bg-gray-900 h-8 w-8 duration-100 hover:bg-gray-800"
                                onClick={() =>
                                  handleOnQtyChange({
                                    _id,
                                    selectedSize,
                                    selectedQty,
                                    name,
                                    action: "-",
                                  })
                                }
                              >
                                {" "}
                                -{" "}
                              </button>
                              <span
                                className={classNames(
                                  stockCount > selectedQty
                                    ? "text-gray-900"
                                    : "text-orange-600",
                                  "h-8 w-8 border-y-2 border-gray-900 bg-gray-100 text-sm outline-none flex items-center justify-center"
                                )}
                              >
                                {selectedQty}
                              </span>
                              <button
                                disabled={!(stockCount > selectedQty)}
                                className="cursor-pointer rounded-r bg-gray-900 h-8 w-8 duration-100 hover:bg-gray-800"
                                onClick={() =>
                                  handleOnQtyChange({
                                    _id,
                                    selectedSize,
                                    selectedQty,
                                    name,
                                    action: "+",
                                  })
                                }
                              >
                                {" "}
                                +{" "}
                              </button>
                            </div>
                            <div className="flex flex-col items-end xs:space-y-0.5">
                              <div className="flex items-center gap-0.5">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-5 h-5 text-gray-900"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                  />
                                </svg>

                                <span className="text-sm text-gray-900">
                                  {totalPrice}
                                </span>
                              </div>

                              <span className="flex items-end">
                                <button
                                  className="text-red-600 text-xs underline"
                                  onClick={() =>
                                    handleOnRemove({ _id, selectedSize })
                                  }
                                >
                                  remove
                                </button>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}

                {/* total cart amount */}
                <div className="bg-gray-50 pt-4 px-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-900">Subtotal:</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-gray-900"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>

                      <span className="text-sm text-gray-900">
                        {revisedCartItems
                          .reduce((accumulator, { totalPrice }) => {
                            return accumulator + Number(totalPrice);
                          }, 0)
                          .toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* checkout button */}
                <div className="bg-gray-50 p-4">
                  <Link
                    to="/cart"
                    className=" rounded-md transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50 grid"
                  >
                    <button className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-8 py-2 rounded">
                      Proceed to checkout
                    </button>
                  </Link>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default CartPopover;
