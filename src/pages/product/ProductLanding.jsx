import React, { useEffect, useState, Fragment, useRef } from "react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { RadioGroup, Listbox, Transition } from "@headlessui/react";
import MainLayout from "../../components/layouts/MainLayout";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getFeaturedProductsAction,
  getSelectedProductAction,
  postNewFavouriteItemAction,
} from "./productAction";
import {
  getSelectedCategoryAction,
  getSelectedProductSubCategoryAction,
} from "../category/categoryAction";
import { postNewCartItemAction } from "../cart/cartAction";
import { autoLogin } from "../user/userAction";
import { getReviewAction } from "./reviewAction";
import { FaStarHalfStroke } from "react-icons/fa6";
import FeaturedProducts from "../../components/products/FeaturedProducts";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ProductLanding = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const { user } = useSelector((state) => state.userInfo);
  const { selectedProduct } = useSelector((state) => state.productInfo);
  const { favouriteProducts } = useSelector((state) => state.productInfo);
  const { selectedCategory } = useSelector((state) => state.categoryInfo);
  const { selectedSubCategory } = useSelector((state) => state.subCategoryInfo);
  const { reviews } = useSelector((state) => state.reviewInfo);

  const [productThumbnail, setProductThumbnail] = useState("");
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(1);
  const imageContainerRef = useRef(null);
  const [showPrevNextButton, setShowPrevNextButton] = useState(false);
  const [showTopBottomButton, setShowTopBottomButton] = useState(false);

  useEffect(() => {
    const container = imageContainerRef.current;

    if (container) {
      const handleScroll = () => {
        setShowPrevNextButton(
          container.scrollWidth - container.clientWidth > 0
        );
        setShowTopBottomButton(
          container.scrollHeight - container.clientHeight > 0
        );
      };

      const handleResize = () => {
        handleScroll(); // Call handleScroll to update button visibility
      };

      container.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleResize);

      // Initial check after a short delay to ensure rendering
      setTimeout(() => {
        handleScroll();
      }, 10);

      // Clean up
      return () => {
        container.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

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
      dispatch(getSelectedCategoryAction({ _id: selectedProduct.categoryId }));
      dispatch(
        getSelectedProductSubCategoryAction(selectedProduct.subCategoryId)
      );
      dispatch(
        getFeaturedProductsAction({ categoryId: selectedProduct.categoryId })
      );
      setSelected(selectedProduct.variants[0]); //default variant
      setProductThumbnail(selectedProduct.thumbnail); //default thumbnail
      dispatch(getReviewAction({ productId: selectedProduct._id }));
    }

    dispatch(autoLogin());
  }, [dispatch, slug, selectedProduct?._id]);

  const changeOnSelect = (selectedSize) => {
    const selectedVariant = selectedProduct.variants.find(
      (variant) => variant.size === selectedSize
    );

    setSelected(selectedVariant);
    setChecked(1);
  };

  const handleOnCartBtnSubmit = (e) => {
    e.preventDefault();

    const obj = {
      userId: user?._id,
      productId: selectedProduct?._id,
      slug: selectedProduct?.slug,
      size: selected?.size,
      qty: checked.toString(),
      status: "active",
    };

    dispatch(postNewCartItemAction(obj));
  };

  const handleOnAddFavouriteBtn = (favourite) => {
    const obj = {
      userId: user?._id,
      productId: selectedProduct?._id,
      favourite,
    };

    dispatch(postNewFavouriteItemAction(obj));
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

  const totalRatings = reviews.reduce(
    (accumulator, { ratings }) => accumulator + ratings,
    0
  );

  const averageRating = reviews.length > 0 ? totalRatings / reviews.length : 0;

  const scrollImage = (scrollDirection) => {
    if (imageContainerRef.current) {
      if (scrollDirection === "next") {
        imageContainerRef.current.scrollLeft +=
          imageContainerRef.current.offsetWidth;
      } else if (scrollDirection === "prev") {
        imageContainerRef.current.scrollLeft -=
          imageContainerRef.current.offsetWidth;
      } else if (scrollDirection === "top") {
        imageContainerRef.current.scrollTop -=
          imageContainerRef.current.offsetHeight;
      } else if (scrollDirection === "bottom") {
        imageContainerRef.current.scrollTop +=
          imageContainerRef.current.offsetHeight;
      }
    }
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 flex justify-center pb-8">
        <div className="py-6 px-6 lg:px-8">
          {/* breadcrumb */}
          <nav aria-label="Breadcrumb">
            <ol
              role="list"
              className="mx-auto flex items-center flex-wrap space-x-2"
            >
              {/* home */}
              <li className="">
                <div className="flex items-center">
                  <a
                    href="/"
                    className="mr-2 text-sm font-medium capitalize text-gray-800"
                  >
                    Home
                  </a>
                  <div>
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
                </div>
              </li>

              {/* category */}
              <li className="">
                <div className="flex items-center">
                  <a
                    href={`/products?category=${selectedCategory?.slug}`}
                    className="mr-2 text-sm font-medium capitalize text-gray-800 text-nowrap"
                  >
                    {selectedCategory?.title}
                  </a>
                  <div>
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
                </div>
              </li>

              {/* subcategory */}
              <li className="">
                <div className="flex items-center">
                  <a
                    href={`/products?category=${selectedCategory?.slug}&subcategory=${selectedSubCategory?.slug}`}
                    className="mr-2 text-sm font-medium capitalize text-gray-800"
                  >
                    {selectedSubCategory?.title}
                  </a>
                  <div>
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
                </div>
              </li>

              {/* product */}
              <li className="text-sm">
                <span
                  aria-current="page"
                  className="font-medium capitalize text-gray-600 hover:text-gray-800 transition-all duration-300 cursor-pointer"
                >
                  {selectedProduct?.name}
                </span>
              </li>
            </ol>
          </nav>

          {/* Product Details */}
          <div className="mt-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8">
            {/* Image gallery */}
            <div className="grid grid-cols-1 sm:grid-cols-[minmax(100px,_1fr)_100px] gap-4">
              {/* thumbnail */}
              <div className="w-full h-[30rem] overflow-hidden border border-gray-800 rounded relative">
                <img
                  src={productThumbnail}
                  alt={`${selectedProduct?.name}-image-thumbnail`}
                  className="absolute top-0 left-0 h-full w-full p-1 rounded"
                />

                {/* add to favourite button */}
                <div className="absolute flex flex-col top-0 right-0 p-1">
                  <button
                    className={classNames(
                      favouriteProducts.filter(
                        ({ productId }) => productId === selectedProduct?._id
                      ).length > 0
                        ? "text-red-500 hover:text-red-400"
                        : "text-gray-400 hover:text-gray-200",
                      "transition ease-in duration-300 bg-gray-800 shadow rounded-full w-8 h-8 text-center p-1"
                    )}
                    onClick={() =>
                      handleOnAddFavouriteBtn(
                        favouriteProducts.filter(
                          ({ productId }) => productId === selectedProduct?._id
                        ).length > 0
                      )
                    }
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
              <div
                className={classNames(
                  showPrevNextButton || showTopBottomButton
                    ? "mx-6 sm:mx-0 sm:my-6"
                    : "",
                  "sm:h-[27rem] relative"
                )}
              >
                <div
                  className="sm:h-[27rem] w-full flex sm:flex-col gap-4 overflow-auto scroll-smooth"
                  ref={imageContainerRef}
                >
                  {selectedProduct?.images?.map((item, i) => (
                    <button
                      key={i}
                      className="relative"
                      onClick={() => setProductThumbnail(item)}
                    >
                      <div className="h-[100px] w-[100px] border border-gray-800 rounded overflow-hidden">
                        <img
                          src={item}
                          alt={`${selectedProduct?.name}-image-${i}`}
                          className="absolute top-0 left-0 h-full w-full p-1 rounded"
                        />
                      </div>
                    </button>
                  ))}
                </div>
                {/* scroll left-right */}
                {showPrevNextButton && (
                  <button
                    onClick={() => scrollImage("prev")}
                    className="absolute top-6 -left-6 transform translate-y-1/2 sm:hidden"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="bg-gray-800"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-4.28 9.22a.75.75 0 0 0 0 1.06l3 3a.75.75 0 1 0 1.06-1.06l-1.72-1.72h5.69a.75.75 0 0 0 0-1.5h-5.69l1.72-1.72a.75.75 0 0 0-1.06-1.06l-3 3Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}

                {showPrevNextButton && (
                  <button
                    onClick={() => scrollImage("next")}
                    className="absolute top-6 -right-6 transform translate-y-1/2 sm:hidden"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="bg-gray-800"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}

                {/* scroll top-bottom */}
                {showTopBottomButton && (
                  <button
                    onClick={() => scrollImage("top")}
                    className="absolute -top-6 left-8 hidden sm:block"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="bg-gray-800"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm.53 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v5.69a.75.75 0 0 0 1.5 0v-5.69l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}

                {showTopBottomButton && (
                  <button
                    onClick={() => scrollImage("bottom")}
                    className="absolute -bottom-6 right-8 hidden sm:block"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="bg-gray-800"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-.53 14.03a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V8.25a.75.75 0 0 0-1.5 0v5.69l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Product info */}
            <div className="max-w-2xl pt-6 lg:pt-0">
              {/* product name */}
              <div className="">
                <h1 className="text-2xl font-bold tracking-tight uppercase text-gray-800 md:text-3xl">
                  {selectedProduct.name}
                </h1>
              </div>

              {/* price */}
              <div className="mt-4">
                <p className="text-2xl tracking-tight text-gray-800">
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
                    {averageRating > 0 && (
                      <>
                        <div
                          className="flex items-center justify-center mr-3"
                          id="ratings"
                        >
                          {Array(Math.floor(averageRating))
                            .fill("")
                            .map((str, i) => (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="text-warning w-5 h-5"
                                key={i}
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ))}
                          {averageRating - Math.floor(averageRating) > 0 && (
                            <FaStarHalfStroke className="text-warning w-5 h-5" />
                          )}
                          {Array(5 - Math.ceil(averageRating))
                            .fill("")
                            .map((str, i) => (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-5 h-5"
                                key={i}
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ))}

                          <span className="ml-1">({averageRating})</span>
                        </div>
                      </>
                    )}

                    <Link
                      to="#"
                      className="text-sm font-medium text-gray-800 hover:text-gray-600 hover:underline cursor-pointer"
                    >
                      {reviews.length} reviews
                    </Link>
                  </div>
                </div>

                <form className="mt-10" onSubmit={handleOnCartBtnSubmit}>
                  {/* Sizes */}
                  <div className="mt-10">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-800">
                        Size
                      </h3>
                    </div>

                    <RadioGroup
                      value={selected?.size}
                      onChange={changeOnSelect}
                      className="mt-4"
                    >
                      <div className="grid grid-cols-2 xxs:grid-cols-3 xs:grid-cols-4 lg:grid-cols-3 gap-4">
                        {selectedProduct?.variants?.map((plan) => (
                          <RadioGroup.Option
                            key={plan.size}
                            name="plan"
                            value={plan.size}
                            aria-checked={plan.size === selected?.size}
                            className={({ active, checked }) =>
                              `${
                                active
                                  ? "ring-2 ring-white/60 ring-offset-2 ring-offset-gray-500"
                                  : ""
                              }
                  ${checked ? "bg-gray-800 text-gray-100" : "bg-gray-100"}
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
                                            ? "text-gray-100"
                                            : "text-gray-800"
                                        }`}
                                      >
                                        {plan.size}
                                      </RadioGroup.Label>
                                    </div>
                                  </div>
                                  {checked && (
                                    <div className="shrink-0 text-gray-100">
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
                          <Listbox.Label className="block text-sm font-medium leading-6 text-gray-800">
                            Quantity
                          </Listbox.Label>
                          <div className="relative mt-2">
                            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800 sm:text-sm sm:leading-6">
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
                                            ? "bg-gray-800 text-gray-100"
                                            : "text-gray-800",
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
                                                  ? "text-gray-100"
                                                  : "text-gray-800",
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
                      <h2 className="text-sm font-medium text-gray-800">
                        Description
                      </h2>

                      <div className="mt-4 space-y-6">
                        <p className="text-sm text-gray-600">
                          {selectedProduct.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* add to cart btn */}
                  <button
                    type="submit"
                    className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-gray-800 px-8 py-3 text-base font-medium text-gray-100 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
                  >
                    Add to bag
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* you may also like */}
      <div className="bg-gray-100 py-12">
        <div className="mx-auto max-w-4xl px-4 lg:max-w-7xl lg:px-6 divide-y divide-gray-500/30">
          <div className="flex flex-col xxs:flex-row xxs:justify-between pb-6">
            <h2 className="space-y-2 font-semibold uppercase">
              You may also like
            </h2>
          </div>

          <div className="flex overflow-x-scroll gap-x-6 pt-6">
            <FeaturedProducts />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductLanding;
