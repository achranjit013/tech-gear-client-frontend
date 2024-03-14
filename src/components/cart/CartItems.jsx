import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getProducts, getProductsForCart } from "../../helper/axiosHelper";
import {
  deleteCartItemAction,
  setCartItemsAction,
  updateCartItemAction,
} from "../../pages/cart/cartAction";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const CartItems = ({ cartPopover, checkout }) => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cartInfo);
  const { user } = useSelector((state) => state.userInfo);
  const [revisedCartItemss, setRevisedCartItemss] = useState([]);

  useEffect(() => {
    setRevisedCartItemss([]); // clearing the state on each mouse event

    // grab the product id from cart and fetch fresh product data from database
    const fetchData = async () => {
      try {
        const promises = cartItems?.map(async ({ _id, slug, size, qty }) => {
          const { findResult } = await getProducts(slug, size);

          if (findResult?._id) {
            const obj = {
              cartId: _id,
              productId: findResult._id,
              slug: findResult.slug,
              name: findResult.name,
              sku: findResult.sku,
              thumbnail: findResult.thumbnail,
              selectedSize: size,
              selectedQty: qty,
              stockCount: findResult.variants[0]?.qty,
              stockStatus:
                findResult.variants[0]?.qty > 0
                  ? findResult.variants[0]?.qty >
                    Math.ceil(0.2 * findResult.variants[0]?.qty)
                    ? "in stock"
                    : "low in stock"
                  : "out of stock",
              price:
                findResult.variants[0]?.salesPrice ??
                findResult.variants[0]?.price,
              totalPrice: (
                (findResult.variants[0]?.salesPrice ??
                  findResult.variants[0]?.price) * qty
              ).toFixed(2),
              isEnoughQty: !(findResult.variants[0]?.qty < qty),
            };

            return obj;
          }
        });

        const results = await Promise.all(promises);

        const filteredResults = results.filter(Boolean); // Filter out any undefined values

        setRevisedCartItemss(filteredResults);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [cartItems]);

  // update the qty of the item in cart (either add or subtract) function
  const handleOnQtyChange = (item) => {
    const obj = {
      productId: item?.productId,
      userId: user?._id,
      _id: item?.cartId,
      size: item?.selectedSize,
      slug: item?.slug,
      qty: (item?.action === "+"
        ? Number(item?.selectedQty) + 1
        : Number(item?.selectedQty) - 1
      ).toString(),
    };

    if (obj.qty === "0" || obj.qty === 0) {
      handleOnRemove({
        cartId: item?.cartId,
        productId: item?.productId,
        selectedSize: item?.selectedSize,
        name: item?.name,
      });
    } else {
      dispatch(updateCartItemAction(obj));
    }
  };

  // remove item from cart function
  const handleOnRemove = (item) => {
    if (
      window.confirm(
        `Are you sure to remove ${item.name} / size: ${item.selectedSize} from your cart?`
      )
    ) {
      dispatch(deleteCartItemAction({ userId: user?._id, ...item }));
    }
  };

  return (
    <div className="bg-gray-100">
      <div className="mx-auto max-w-7xl justify-center px-4 py-6 lg:px-8  gap-6">
        <div className="divide-y divide-gray-500/20 rounded-lg border">
          <div className="px-4 py-6">
            <span className="text-md font-mono text-gray-900">
              {revisedCartItemss.reduce((accumulator, { selectedQty }) => {
                return accumulator + Number(selectedQty);
              }, 0)}{" "}
              items in your cart!
            </span>
          </div>
          {/* cart items */}
          {revisedCartItemss?.map(
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
                productId,
                cartId,
                slug,
              },
              i
            ) => (
              <div key={i} className="py-6">
                <div className="flex flex-col xs:flex-row">
                  <div className="flex items-center">
                    <img
                      src={thumbnail}
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
                      {checkout && (
                        <span className="text-sm text-gray-900">
                          Qty: {selectedQty}
                        </span>
                      )}
                      {!checkout && (
                        <span
                          className={classNames(
                            stockCount > 0
                              ? stockCount > Math.ceil(0.2 * stockCount)
                                ? "bg-green-600"
                                : "bg-orange-600"
                              : "bg-red-600",
                            "text-xs text-white px-1.5 py-0.5 rounded-full"
                          )}
                        >
                          {stockStatus}
                        </span>
                      )}
                    </div>
                    <div className="mt-4 flex justify-between xs:space-y-2 xs:mt-0 xs:block">
                      {!checkout && (
                        <div className="flex items-center border-gray-100">
                          <button
                            disabled={!(stockCount > 0)}
                            className="cursor-pointer rounded-l bg-gray-900 h-8 w-8 duration-100 hover:bg-gray-800"
                            onClick={() =>
                              handleOnQtyChange({
                                cartId,
                                productId,
                                selectedSize,
                                selectedQty,
                                slug,
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
                              selectedQty > stockCount
                                ? "text-orange-600"
                                : "text-gray-900",
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
                                cartId,
                                productId,
                                selectedSize,
                                selectedQty,
                                slug,
                                name,
                                action: "+",
                              })
                            }
                          >
                            {" "}
                            +{" "}
                          </button>
                        </div>
                      )}

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

                        {!checkout && (
                          <span className="flex items-end">
                            <button
                              className="text-red-600 text-xs underline"
                              onClick={() =>
                                handleOnRemove({
                                  cartId,
                                  productId,
                                  selectedSize,
                                  name,
                                })
                              }
                            >
                              remove
                            </button>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Sub total */}
        {cartItems.length
          ? !checkout && (
              <div className="h-full mt-6 rounded-lg border p-6 shadow-md">
                {/* subtotal */}
                <div className="mb-2 flex justify-between text-md font-bold">
                  <div>
                    <span className="text-gray-900">Subtotal</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.8}
                      stroke="currentColor"
                      className="w-5 h-5 text-gray-900"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>

                    <span className="text-gray-900">
                      {revisedCartItemss
                        .reduce((accumulator, { totalPrice }) => {
                          return accumulator + Number(totalPrice);
                        }, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* shipping */}
                {!cartPopover && (
                  <p className="text-sm text-gray-400">
                    ** select your preferred shipping method and enter your
                    payment details in the next page.
                  </p>
                )}

                {/* checkout button */}
                {cartPopover ? (
                  <Link to="/cart" className="mt-4 rounded-md grid">
                    <button className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 rounded-md text-center">
                      Proceed to cart
                    </button>
                  </Link>
                ) : (
                  <Link to="/checkout" className="mt-4 rounded-md grid">
                    <button className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 rounded-md text-center">
                      Checkout Securely
                    </button>
                  </Link>
                )}
              </div>
            )
          : ""}
      </div>
    </div>
  );
};

export default CartItems;
