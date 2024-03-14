import React, { useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import CartItems from "./CartItems";

const CartPopover = () => {
  const { cartItems } = useSelector((state) => state.cartInfo);
  const [isShowing, setIsShowing] = useState(false); //to show cart window on mouse hover / enter

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            type="button"
            className="relative inline-flex items-center p-1 w-9 h-9 justify-center text-sm bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 transition ease-in duration-300 shadow"
            onMouseEnter={() => setIsShowing(true)}
            onMouseLeave={() => setIsShowing(false)}
          >
            <div className="top-[0.04rem] absolute left-[1.22rem]">
              {cartItems?.length > 0 && (
                <p className="flex h-1 w-1 items-center justify-center rounded-full bg-red-500 p-2 text-xs text-gray-50">
                  {cartItems.reduce((accumulator, { qty }) => {
                    return accumulator + Number(qty);
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
            enter="transition ease-out duration-300"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-300"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
            show={isShowing}
            onMouseEnter={() => setIsShowing(true)}
            onMouseLeave={() => setIsShowing(false)}
          >
            <Popover.Panel className="absolute right-0 z-10 w-screen max-w-52 xxs:max-w-80 xs:max-w-md sm:max-w-lg transform max-h-[36rem] overflow-y-scroll pt-6 rounded-md border border-gray-800 border-t-0 rounded-t-none">
              <CartItems cartPopover={true} />
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default CartPopover;
