import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, Popover, Transition } from "@headlessui/react";
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
  getAllProductsForMenuAction,
  setFavouriteItemsAction,
} from "../../pages/product/productAction";
import CategoriesPopover from "./CategoriesPopover";
import {
  getAllCategoriesAction,
  getAllSubCategoriesAction,
} from "../../pages/category/categoryAction";
import mbname from "../../assets/mbname.png";

const navigation = [
  { name: "Hot Deals🔥", href: "#" },
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
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [isShowing, setIsShowing] = useState(false); //to show cart window on mouse hover / enter

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllCartItemsAction());
      dispatch(getAllFavouriteItemsAction());
    } else {
      dispatch(autoLogin());
      dispatch(setCartItemsAction());
      dispatch(setFavouriteItemsAction());
    }

    dispatch(getAllCategoriesAction());
    dispatch(getAllSubCategoriesAction());
    dispatch(getAllProductsForMenuAction());
  }, [dispatch, user?._id]);

  const handleOnHamburgerMenuClick = () => {
    setMobileMenuOpen(true);
    setCategoryMenuOpen(false);
  };

  return (
    <header className="sticky inset-x-0 top-0 z-50 bg-gray-800 text-neutral-200">
      <TopNav />

      <nav
        className="flex items-center justify-between p-6 lg:px-8 relative"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link
            to="/"
            className="-m-1.5 p-1.5 flex gap-2 items-start justify-cente"
          >
            <img src={mbname} alt="name" className="w-36 md:w-48" />
          </Link>
        </div>

        <div className="hidden lg:flex lg:gap-x-9">
          {/* start */}
          <Popover className="">
            {({ open }) => (
              <>
                <Popover.Button
                  type="button"
                  className="text-lg font-mono leading-6"
                  onMouseEnter={() => setIsShowing(true)}
                  onMouseLeave={() => setIsShowing(false)}
                >
                  Categories
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
                  <Popover.Panel className="absolute left-0 right-0 z-10 w-screen transform max-h-screen overflow-y-scroll pt-7 rounded-md border border-gray-800 border-t-0 rounded-t-none">
                    <CategoriesPopover />
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
          {/* end */}

          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-lg font-mono leading-6"
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
            onClick={handleOnHamburgerMenuClick}
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
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-50">
          {/* title and close btn */}
          <div className="flex items-center justify-between bg-gray-800 p-6">
            <Link to="/" className="-m-1.5 p-1.5">
              <img src={mbname} alt="name" className="w-36 md:w-48" />
            </Link>

            <button
              type="button"
              className="inline-flex items-center p-1 w-9 h-9 justify-center text-sm text-gray-800 rounded-lg lg:hidden bg-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 flow-root p-6">
            <div className="-my-6 divide-y divide-gray-500/10">
              {/* search bar */}
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

              {/* menu links */}
              <div className="space-y-2 py-6">
                <Link
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-800 hover:bg-gray-200"
                  onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                >
                  Categories
                </Link>

                {categoryMenuOpen && (
                  <div className="">
                    <CategoriesPopover />
                  </div>
                )}

                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-800 hover:bg-gray-200"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* user links */}
              <div className="py-6">
                {user?._id ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-800 hover:bg-gray-200"
                    >
                      My Account
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-800 hover:bg-gray-200"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/create-account"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-800 hover:bg-gray-300"
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
