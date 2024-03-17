import React, { useEffect, useState } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import { useSelector } from "react-redux";
import CartItems from "../../components/cart/CartItems";
import { getProducts } from "../../helper/axiosHelper";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

// Make sure to call `loadStripe` outside of a component’s render to avoid recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  "pk_test_51OdhKKGFSsWXIxQllqJD2RbqwmqKSCNtBHvJyz2WbA1WzInrssSdOOgwzjFmknPTZyL9WcboDoFsZMrVotHVH3lU000T947jg5"
);

const Checkout = () => {
  const { cartItems } = useSelector((state) => state.cartInfo);
  const [selectedOption, setSelectedOption] = useState("standard");
  const [filteredCartItems, setFilteredCartItems] = useState([]);
  const [subTotal, setSubTotal] = useState(0);

  useEffect(() => {
    // grab the product id from cart and fetch fresh product data from database
    const fetchData = async () => {
      try {
        const promises = cartItems?.map(async ({ _id, slug, size, qty }) => {
          const { findResult } = await getProducts({ slug, size });

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

        setSubTotal(
          filteredResults
            .reduce((accumulator, { totalPrice }) => {
              return accumulator + Number(totalPrice);
            }, 0)
            .toFixed(2)
        );

        setFilteredCartItems(filteredResults);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [cartItems]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const getPrice = () => {
    if (selectedOption === "standard") {
      return 10; // Set the price for the standard option
    } else if (selectedOption === "express") {
      return 20; // Set the price for the express option
    }
  };

  return (
    <MainLayout>
      <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32 p-6">
        <div className="px-4 pt-8">
          <p className="text-xl font-medium">Order Summary</p>
          <p className="text-gray-400">
            Check your items. And select a suitable shipping method.
          </p>

          <CartItems checkout={true} />

          {cartItems.length ? (
            <>
              <p className="mt-8 text-lg font-medium">Shipping Methods</p>
              <form className="mt-5 grid gap-6">
                <div className="relative">
                  <input
                    className="peer hidden"
                    id="radio_1"
                    type="radio"
                    name="radio"
                    value="standard"
                    checked={selectedOption === "standard"}
                    onChange={handleOptionChange}
                  />
                  <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
                  <label
                    className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                    htmlFor="radio_1"
                  >
                    <div className="ml-5">
                      <span className="mt-2 font-semibold">Standard</span>
                      <p className="text-slate-500 text-sm leading-6">
                        Delivery time: 7-10 Days
                      </p>
                    </div>
                  </label>
                  <div className="pointer-events-none absolute inset-y-0 left-0 -top-5 inline-flex items-center px-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5 text-red-500"
                    >
                      <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                      <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                    </svg>
                  </div>
                </div>
                <div className="relative">
                  <input
                    className="peer hidden"
                    id="radio_2"
                    type="radio"
                    name="radio"
                    value="express"
                    checked={selectedOption === "express"}
                    onChange={handleOptionChange}
                  />
                  <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
                  <label
                    className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                    htmlFor="radio_2"
                  >
                    <div className="ml-5">
                      <span className="mt-2 font-semibold">Express</span>
                      <p className="text-slate-500 text-sm leading-6">
                        Delivery time: 2-4 Days
                      </p>
                    </div>
                  </label>
                  <div className="pointer-events-none absolute inset-y-0 left-0 -top-5 inline-flex items-center px-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5 text-yellow-400"
                    >
                      <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                      <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                    </svg>
                  </div>
                </div>
              </form>
            </>
          ) : (
            ""
          )}
        </div>

        <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
          {cartItems.length ? (
            <>
              <p className="text-xl font-medium">Payment Details</p>
              <p className="text-gray-400">
                Complete your order by providing your payment details.
              </p>
            </>
          ) : (
            ""
          )}

          <Elements stripe={stripePromise}>
            <CheckoutForm
              subTotal={subTotal}
              getPrice={getPrice}
              filteredCartItems={filteredCartItems}
            />
          </Elements>
        </div>
      </div>
    </MainLayout>
  );
};

export default Checkout;
