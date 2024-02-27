import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {
  fetchPaymentIntent,
  getProducts,
  postAOrder,
  updateProductsQty,
} from "../../helper/axiosHelper";
import { useDispatch, useSelector } from "react-redux";
import { updateCartItemAction } from "../cart/cartAction";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function CheckoutForm({
  subTotal,
  getPrice,
  filteredCartItems,
}) {
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useSelector((state) => state.userInfo);

  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({});
  const [checkoutMessage, setCheckoutMessage] = useState(null);
  const [billingChecked, setBillingChecked] = useState(false);

  const handleOnBillingCheckbox = (e) => {
    setBillingChecked(!billingChecked);
    if (!billingChecked) {
      // Fill the form fields when the checkbox is checked
      setForm({
        ...form,
        billingStreet: form.shippingStreet,
        billingState: form.shippingState,
        billingZip: form.shippingZip,
      });
    } else {
      // Clear the form fields when the checkbox is unchecked
      setForm({
        ...form,
        billingStreet: "",
        billingState: "",
        billingZip: "",
      });
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      setMessage("Not ready to process the payment");
      return;
    }

    setIsLoading(true);

    // Create PaymentIntent as soon as the page loads
    const { clientSecret } = await fetchPaymentIntent({
      amount: Number(subTotal) + getPrice(),
      currency: "aud",
      PaymentMethodType: "card",
    });

    const { paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: form.billingCardholder,
          email: form.billingUserEmail,
        },
      },
    });

    if (paymentIntent?.status === "succeeded") {
      // call order api and send cart, user, payment details to store in your order table
      const carts = filteredCartItems?.map(
        ({
          cartId,
          name,
          selectedQty,
          selectedSize,
          totalPrice,
          thumbnail,
        }) => {
          return {
            cartId,
            productName: name,
            orderedQty: selectedQty.toString(),
            orderedSize: selectedSize,
            totalPrice,
            thumbnail,
          };
        }
      );

      const obj = {
        email: form.billingUserEmail,
        name: form.billingCardholder,
        shippingStreet: form.shippingStreet,
        shippingState: form.shippingState,
        shippingZip: form.shippingZip,
        billingStreet: form.billingStreet,
        billingState: form.billingState,
        billingZip: form.billingZip,
        carts,
        amount: (Number(subTotal) + getPrice()).toFixed(2),
        paymentMethod: paymentIntent?.payment_method,
        paymentIntentId: paymentIntent?.id,
      };

      const { status, message } = await postAOrder(obj);

      // if success, update cart and product table
      if (status === "success") {
        filteredCartItems?.map(
          async ({ cartId, slug, selectedSize, selectedQty }) => {
            // update cart status to inactive after payment success
            dispatch(
              updateCartItemAction({
                userId: user?._id,
                _id: cartId,
                status: "inactive",
              })
            );

            // check if product exists
            const { findResult } = await getProducts(slug, selectedSize);

            if (findResult?._id) {
              // if the product exist
              // update the qty wrt. size
              const revisedQty = findResult.variants[0].qty - selectedQty;
              const updateResult = await updateProductsQty({
                slug,
                variants: [{ size: selectedSize, qty: revisedQty.toString() }],
              });
            }
          }
        );
      }

      setCheckoutMessage(message);
    } else {
      // If unsuccessful payment, show error
      setCheckoutMessage(
        "Sorry, couldn't place your order. Please try again later!"
      );
    }

    setIsLoading(false);

    return;
  };

  return (
    <>
      {filteredCartItems.length ? (
        <form id="payment-form" onSubmit={handleOnSubmit}>
          {/* email */}
          <label
            htmlFor="email"
            className="mt-4 mb-2 block text-sm font-medium"
          >
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="billingUserEmail"
              required
              className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm text-gray-800 outline-none focus:z-10 focus:border-gray-800 focus:ring-gray-800 placeholder:text-gray-400"
              placeholder="your.email@gmail.com"
              onChange={handleOnChange}
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            </div>
          </div>

          {/* card holder */}
          <label
            htmlFor="card-holder"
            className="mt-4 mb-2 block text-sm font-medium"
          >
            Card Holder
          </label>
          <div className="relative">
            <input
              type="text"
              id="card-holder"
              name="billingCardholder"
              required
              className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm uppercase shadow-sm text-gray-800 outline-none focus:z-10 focus:border-gray-800 focus:ring-gray-800 placeholder:text-gray-400"
              placeholder="Your full name here"
              onChange={handleOnChange}
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                />
              </svg>
            </div>
          </div>

          {/* shipping address */}
          <label
            htmlFor="shipping-address"
            className="mt-4 mb-2 block text-sm font-medium"
          >
            Shipping Address
          </label>
          <div className="flex flex-col gap-1">
            <div className="relative">
              <input
                type="text"
                id="shipping-address"
                name="shippingStreet"
                required
                className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm text-gray-800 outline-none focus:z-10 focus:border-gray-800 focus:ring-gray-800 placeholder:text-gray-400"
                placeholder="Unit / Apartment / House No. and Street Address"
                onChange={handleOnChange}
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-4 w-4 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                  />
                </svg>
              </div>
            </div>

            <div className="flex gap-1">
              <div className="relative flex-grow">
                <select
                  name="shippingState"
                  required
                  className={classNames(
                    !form.shippingState ? "text-gray-400" : "text-gray-800",
                    "w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-gray-800 focus:ring-gray-800"
                  )}
                  onChange={handleOnChange}
                >
                  <option value="">States & Territories</option>
                  <option value="NSW">NSW</option>
                  <option value="QLD">QLD</option>
                  <option value="SA">SA</option>
                  <option value="TAS">TAS</option>
                  <option value="VIC">VIC</option>
                  <option value="WA">WA</option>
                  <option value="NT">NT</option>
                  <option value="ACT">ACT</option>
                </select>

                <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-4 w-4 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25"
                    />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="shippingZip"
                  required
                  className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm text-gray-800  outline-none focus:z-10 focus:border-gray-800 focus:ring-gray-800 placeholder:text-gray-400"
                  placeholder="ZIP"
                  onChange={handleOnChange}
                />

                <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="h-4 w-4 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* billing address */}
          <label
            htmlFor="billing-address"
            className="mt-4 mb-2 flex gap-2.5 text-sm font-medium"
          >
            <span>Billing Address</span>
            <div className="flex items-center">
              <input
                id="checked-checkbox"
                type="checkbox"
                className="w-4 h-4 text-gray-800 bg-gray-50 border-gray-300 rounded focus:ring-gray-800 ring-offset-gray-800 focus:ring-2"
                checked={billingChecked}
                onChange={handleOnBillingCheckbox}
              />
              <label
                htmlFor="checked-checkbox"
                className="ms-1 text-sm font-medium text-gray-400"
              >
                Same as Shipping Address
              </label>
            </div>
          </label>
          <div className="flex flex-col gap-1">
            <div className="relative">
              <input
                type="text"
                id="billing-address"
                name="billingStreet"
                value={form.billingStreet}
                required
                className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm text-gray-800 outline-none focus:z-10 focus:border-gray-800 focus:ring-gray-800 placeholder:text-gray-400"
                placeholder="Unit / Apartment / House No. and Street Address"
                onChange={handleOnChange}
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-4 w-4 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                  />
                </svg>
              </div>
            </div>

            <div className="flex gap-1">
              <div className="relative flex-grow">
                <select
                  name="billingState"
                  value={form.billingState}
                  required
                  className={classNames(
                    !form.billingState ? "text-gray-400" : "text-gray-800",
                    "w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-gray-800 focus:ring-gray-800"
                  )}
                  onChange={handleOnChange}
                >
                  <option value="">States & Territories</option>
                  <option value="NSW">NSW</option>
                  <option value="QLD">QLD</option>
                  <option value="SA">SA</option>
                  <option value="TAS">TAS</option>
                  <option value="VIC">VIC</option>
                  <option value="WA">WA</option>
                  <option value="NT">NT</option>
                  <option value="ACT">ACT</option>
                </select>

                <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-4 w-4 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25"
                    />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="billingZip"
                  value={form.billingZip}
                  required
                  className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm text-gray-800  outline-none focus:z-10 focus:border-gray-800 focus:ring-gray-800 placeholder:text-gray-400"
                  placeholder="ZIP"
                  onChange={handleOnChange}
                />

                <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="h-4 w-4 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* card details */}
          <label
            htmlFor="card-details"
            className="mt-4 mb-2 block text-sm font-medium"
          >
            Card Details
          </label>
          <CardElement
            options={{
              hidePostalCode: true,
              style: {
                base: {
                  color: "#424242", // Set the base text color to gray-800
                  "::placeholder": {
                    color: "#A0AEC0", // Set the placeholder text color to gray-400
                  },
                },
              },
            }}
            className="w-full bg-white rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm"
          />

          {/* subtotal and shipping */}
          <div className="mt-6 border-t border-b py-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">Subtotal</p>
              <p className="font-semibold text-gray-900">${subTotal}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">Shipping</p>
              <p className="font-semibold text-gray-900">
                ${getPrice().toFixed(2)}
              </p>
            </div>
          </div>

          {/* total */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">Total</p>
            <p className="text-2xl font-semibold text-gray-900">
              ${(Number(subTotal) + getPrice()).toFixed(2)}
            </p>
          </div>

          {/* place order button */}
          <button
            disabled={isLoading || !stripe || !elements}
            id="submit"
            className="mt-4 mb-8 w-full rounded-md flex items-center justify-center bg-gray-900 px-6 py-3 font-medium text-gray-50"
          >
            {isLoading ? (
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-50 animate-spin fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            ) : (
              <>Place order</>
            )}
          </button>
        </form>
      ) : (
        <div className="">
          {checkoutMessage
            ? checkoutMessage
            : "Please add items to your cart before checkout. Thanks!"}
        </div>
      )}
    </>
  );
}
