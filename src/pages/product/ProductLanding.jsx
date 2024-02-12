import React, { useEffect, useState, Fragment } from "react";
import {
  StarIcon,
  CheckIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/20/solid";
import { RadioGroup, Listbox, Transition } from "@headlessui/react";
import MainLayout from "../../components/layouts/MainLayout";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSelectedProductAction, setCartItemsAction } from "./productAction";
import { getSelectedProductCategoryAction } from "../category/categoryAction";

const reviews = { href: "#", average: 4, totalCount: 117 };

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ProductLanding = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();

  const { selectedProduct } = useSelector((state) => state.productInfo);
  const { selectedCategory } = useSelector((state) => state.categoryInfo);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the initial data
        await dispatch(getSelectedProductAction(slug));
      } catch (error) {
        // Handle errors...
        console.error("Error fetching selected product:", error);
      }
    };

    fetchData(); // Invoke the fetch function

    if (selectedProduct?._id) {
      dispatch(getSelectedProductCategoryAction(selectedProduct.parentCatId));
      setSelected(selectedProduct.variants[0]); //default variant
      setProductThumbnail(selectedProduct.thumbnail); //default thumbnail
    }
  }, [dispatch, slug, selectedProduct?._id]);

  const [productThumbnail, setProductThumbnail] = useState("");
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(1);

  const changeOnSelect = (selectedSize) => {
    const selectedVariant = selectedProduct.variants.find(
      (variant) => variant.size === selectedSize
    );

    setSelected(selectedVariant);
    setChecked(1);
  };

  const handleOnCartBtnSubmit = (e) => {
    e.preventDefault();

    // Retrieve the cart items from local storage
    const localStorageItemsString = localStorage.getItem("cartItems");
    const localStorageItems = localStorageItemsString
      ? JSON.parse(localStorageItemsString)
      : [];

    const obj = {
      _id: selectedProduct?._id,
      slug: selectedProduct?.slug,
      size: selected?.size,
      qty: checked,
    };

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

    // Dispatch action to update Redux store
    dispatch(setCartItemsAction(localStorageItems));
  };

  function CheckIcon(props) {
    return (
      <svg viewBox="0 0 24 24" fill="none" {...props}>
        <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
        <path
          d="M7 13l3 3 7-7"
          stroke="#fff"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <MainLayout>
      <div className="bg-white">
        <div className="py-6 px-6 lg:px-8">
          {/* breadcrumb */}
          <nav aria-label="Breadcrumb">
            <ol role="list" className="mx-auto flex items-center space-x-2">
              <li className="">
                <div className="flex items-center">
                  <Link
                    to="/"
                    className="mr-2 text-sm font-medium text-gray-900"
                  >
                    Home
                  </Link>
                  <svg
                    width={16}
                    height={20}
                    viewBox="0 0 16 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-5 w-4 text-gray-300"
                  >
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                </div>
              </li>

              <li className="">
                <div className="flex items-center">
                  <Link
                    to={`/categories/` + selectedCategory?.slug}
                    className="mr-2 text-sm font-medium text-gray-900"
                  >
                    {selectedCategory?.title}
                  </Link>
                  <svg
                    width={16}
                    height={20}
                    viewBox="0 0 16 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-5 w-4 text-gray-300"
                  >
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                </div>
              </li>

              <li className="text-sm">
                <Link
                  to={`/products/` + selectedProduct?.slug}
                  aria-current="page"
                  className="font-medium text-gray-500 hover:text-gray-600"
                >
                  {selectedProduct?.name}
                </Link>
              </li>
            </ol>
          </nav>

          <div className="mt-6 md:grid md:max-w-7xl md:grid-cols-2 md:gap-x-4">
            {/* Image gallery */}
            <div className="flex justify-evenly md:justify-start md:flex-col md:gap-4">
              {/* thumbnail */}
              <div className="h-[28rem] w-3/4 md:w-full relative rounded overflow-hidden">
                <img
                  src={`http://localhost:8000` + productThumbnail}
                  alt={`${selectedProduct?.name}-image-thumbnail`}
                  className="w-full h-full object-fill object-center"
                />

                {/* add to favorite button */}
                <div className="absolute flex flex-col top-0 right-0 p-1">
                  <button className="transition ease-in duration-300 bg-gray-800  hover:text-gray-100 shadow hover:shadow-md text-gray-400 rounded-full w-8 h-8 text-center p-1">
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
                  </button>
                </div>

                {/* sales tag display */}
                {selected?.salesPrice && (
                  <div className="absolute top-[1rem] -left-[4rem] p-4">
                    <div className="w-48 h-10">
                      <div className="h-full w-full bg-red-500 text-white flex items-center justify-center leading-8 font-semibold text-2xl transform -rotate-45">
                        {Math.round(
                          ((selected?.price - selected?.salesPrice) /
                            selected?.price) *
                            100
                        ) + "% OFF"}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* other images */}
              <div className="flex flex-col gap-y-4 md:flex-row md:flex-wrap md:gap-x-4 md:gap-y-0">
                {selectedProduct?.images?.map((item, i) => (
                  <button
                    key={i}
                    className=""
                    onClick={() => setProductThumbnail(item)}
                  >
                    <div className="h-[4.5rem] w-[4.5rem] rounded overflow-hidden">
                      <img
                        src={`http://localhost:8000` + item}
                        alt={`${selectedProduct?.name}-image-${i}`}
                        className="h-full w-full object-fill object-center"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Product info */}
            <div className="max-w-2xl pt-6 md:pt-0">
              {/* product name */}
              <div className="">
                <h1 className="text-2xl font-bold tracking-tight uppercase text-gray-900 md:text-3xl">
                  {selectedProduct.name}
                </h1>
              </div>

              {/* price */}
              <div className="mt-4">
                <p className="text-2xl tracking-tight text-gray-900">
                  AU${" "}
                  {selected?.salesPrice ? (
                    <>
                      {selected?.salesPrice}
                      <span className="text-gray-300 line-through pl-3">
                        {"$" + selected?.price}
                      </span>
                    </>
                  ) : (
                    selected?.price
                  )}
                </p>

                {/* Reviews */}
                <div className="mt-6">
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <StarIcon
                          key={rating}
                          className={classNames(
                            reviews.average > rating
                              ? "text-gray-900"
                              : "text-gray-200",
                            "h-5 w-5 flex-shrink-0"
                          )}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <a
                      href={reviews.href}
                      className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      {reviews.totalCount} reviews
                    </a>
                  </div>
                </div>

                <form className="mt-10" onSubmit={handleOnCartBtnSubmit}>
                  {/* Sizes */}
                  <div className="mt-10">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">
                        Size
                      </h3>
                      <a
                        href="#"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Size guide
                      </a>
                    </div>

                    <RadioGroup
                      value={selected?.size}
                      onChange={changeOnSelect}
                      className="mt-4"
                    >
                      <div className="grid grid-cols-4 gap-4">
                        {selectedProduct?.variants?.map((plan) => (
                          <RadioGroup.Option
                            key={plan.size}
                            name="plan"
                            value={plan.size}
                            aria-checked={plan.size === selected?.size}
                            className={({ active, checked }) =>
                              `${
                                active
                                  ? "ring-2 ring-white/60 ring-offset-2 ring-offset-sky-300"
                                  : ""
                              }
                  ${checked ? "bg-sky-900/75 text-white" : "bg-white"}
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                            }
                          >
                            {({ active, checked }) => (
                              <>
                                <div className="flex w-full items-center justify-between">
                                  <div className="flex items-center">
                                    <div className="text-sm">
                                      <RadioGroup.Label
                                        as="p"
                                        className={`font-medium uppercase ${
                                          checked
                                            ? "text-white"
                                            : "text-gray-900"
                                        }`}
                                      >
                                        {plan.size}
                                      </RadioGroup.Label>
                                    </div>
                                  </div>
                                  {checked && (
                                    <div className="shrink-0 text-white">
                                      <CheckIcon className="h-6 w-6" />
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </RadioGroup.Option>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  {/* qty */}
                  <div className="mt-10">
                    <Listbox value={checked} onChange={setChecked}>
                      {({ open }) => (
                        <>
                          <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
                            Quantity
                          </Listbox.Label>
                          <div className="relative mt-2">
                            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                              <span className="flex items-center">
                                <span className="ml-3 block truncate">
                                  {checked}
                                </span>
                              </span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                <ChevronUpDownIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </span>
                            </Listbox.Button>

                            <Transition
                              show={open}
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {[...Array(selected?.qty)].map(
                                  (val, quantity) => (
                                    <Listbox.Option
                                      key={quantity + 1}
                                      className={({ active }) =>
                                        classNames(
                                          active
                                            ? "bg-indigo-600 text-white"
                                            : "text-gray-900",
                                          "relative cursor-default select-none py-2 pl-3 pr-9"
                                        )
                                      }
                                      value={quantity + 1}
                                    >
                                      {({ selected, active }) => (
                                        <>
                                          <div className="flex items-center">
                                            <span
                                              className={classNames(
                                                checked
                                                  ? "font-semibold"
                                                  : "font-normal",
                                                "ml-3 block truncate"
                                              )}
                                            >
                                              {quantity + 1}
                                            </span>
                                          </div>

                                          {checked ? (
                                            <span
                                              className={classNames(
                                                active
                                                  ? "text-white"
                                                  : "text-indigo-600",
                                                "absolute inset-y-0 right-0 flex items-center pr-4"
                                              )}
                                            >
                                              <CheckIcon
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                              />
                                            </span>
                                          ) : null}
                                        </>
                                      )}
                                    </Listbox.Option>
                                  )
                                )}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </>
                      )}
                    </Listbox>
                  </div>

                  {/* Description and details */}
                  <div className="">
                    <div className="mt-10">
                      <h2 className="text-sm font-medium text-gray-900">
                        Description
                      </h2>

                      <div className="mt-4 space-y-6">
                        <p className="text-sm text-gray-600">
                          {selectedProduct.description}
                        </p>
                      </div>
                    </div>

                    {/* <div className="mt-10">
                      <h2 className="text-sm font-medium text-gray-900">
                        Highlights
                      </h2>

                      <div className="mt-4">
                        <ul
                          role="list"
                          className="list-disc space-y-2 pl-4 text-sm"
                        >
                          {product.highlights.map((highlight) => (
                            <li key={highlight} className="text-gray-400">
                              <span className="text-gray-600">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-10">
                      <h2 className="text-sm font-medium text-gray-900">
                        Details
                      </h2>

                      <div className="mt-4 space-y-6">
                        <p className="text-sm text-gray-600">
                          {product.details}
                        </p>
                      </div>
                    </div> */}
                  </div>

                  {/* add to cart btn */}
                  <button
                    type="submit"
                    className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Add to bag
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductLanding;
