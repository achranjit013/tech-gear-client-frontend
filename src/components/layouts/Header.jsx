import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import TopNav from "./TopNav";
import { useDispatch, useSelector } from "react-redux";
import CartPopover from "../cart/CartPopover";
import {
  getAllCartItemsAction,
  setCartItemsAction,
} from "../../pages/cart/cartAction";
import { autoLogin } from "../../pages/user/userAction";
import {
  getAllFavouriteItemsAction,
  setFavouriteItemsAction,
} from "../../pages/product/productAction";

// to do.. navigation acc to categories stored in db
const navigation = [
  { name: "Products", href: "/products" },
  { name: "Categories", href: "/categories" },
  { name: "Marketplace", href: "#" },
  { name: "Company", href: "#" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userInfo);
  const { favouriteProducts } = useSelector((state) => state.productInfo);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllCartItemsAction());
      dispatch(getAllFavouriteItemsAction());
    } else {
      dispatch(autoLogin());
      dispatch(setCartItemsAction());
      dispatch(setFavouriteItemsAction());
    }
  }, [dispatch, user?._id]);

  return (
    <header className="sticky inset-x-0 top-0 z-50 bg-gray-800 text-neutral-200">
      <TopNav />

      <nav
        className="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="h-8 font-semibold text-xl uppercase">
              Variété Vortéx
            </span>
          </Link>
        </div>

        <div className="hidden lg:flex lg:gap-x-9">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-sm font-semibold leading-6"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex flex-1 justify-end order-2 gap-3 relative">
          {/* search bar */}
          <div className="relative hidden sm:block">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="search-navbar"
              className="block w-full p-2 ps-10 text-sm text-gray-50 border border-gray-600 rounded-lg bg-gray-700 focus:ring-gray-700 focus:border-gray-500 placeholder-gray-400"
              placeholder="Search products..."
            />
          </div>

          {/* favourite icon */}
          <Link
            to="/favourites"
            className={classNames(
              favouriteProducts?.length > 0
                ? "text-red-500 hover:text-red-400"
                : "text-gray-400 hover:text-gray-200",
              "relative inline-flex items-center p-1 w-9 h-9 justify-center text-sm bg-gray-700 hover:bg-gray-600 transition ease-in duration-300 shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 cursor-pointer"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </Link>

          {/* cart popover */}
          <CartPopover />

          {/* hamburger menu icon */}
          <button
            type="button"
            className="inline-flex items-center p-1 w-9 h-9 justify-center text-sm bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-gray-200  rounded-lg lg:hidden focus:outline-none focus:ring-2 focus:ring-gray-600 transition ease-in duration-300 shadow cursor-pointer"
            onClick={() => setMobileMenuOpen(true)}
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
      </nav>

      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="h-8 font-semibold text-xl uppercase">
                Variété vortéx
              </span>
            </Link>
            <button
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6 sm:py-3">
                <div className="relative block sm:hidden">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>

                  <input
                    type="text"
                    id="search-navbar"
                    className="block w-full p-2 ps-10 text-sm text-gray-800 border border-gray-300 rounded-lg bg-gray-50 focus:ring-gray-800 focus:border-gray-800 placeholder-gray-400"
                    placeholder="Search products..."
                  />
                </div>
              </div>
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-800 hover:bg-gray-50"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                {user?._id ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-800 hover:bg-gray-50"
                    >
                      My Account
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-800 hover:bg-gray-50"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/create-account"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-800 hover:bg-gray-50"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};

export default Header;
