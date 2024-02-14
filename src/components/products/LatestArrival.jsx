import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getLatestArrivalsAction } from "../../pages/product/productAction";
import { useDispatch, useSelector } from "react-redux";

const LatestArrival = () => {
  const dispatch = useDispatch();
  const { latestArrivals } = useSelector((state) => state.productInfo);

  useEffect(() => {
    dispatch(getLatestArrivalsAction());
  }, [dispatch]);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 lg:max-w-7xl lg:px-8 -my-6 divide-y divide-gray-500/30">
        {/* title and cta */}
        <div className="flex justify-between">
          <h2 className="space-y-2 py-6 font-semibold uppercase">
            Latest Arrivals
          </h2>
          <Link
            to="/products"
            className="space-y-2 py-6 font-semibold text-indigo-600"
          >
            <span className="inset-0" aria-hidden="true"></span>Shop all
            products <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {/* card body */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center gap-y-10 gap-x-6 xl:gap-x-8  py-6">
          {latestArrivals?.map((product, i) => (
            <div
              className="max-w-md w-full bg-gray-300/20 shadow-lg rounded-xl p-3"
              key={i}
            >
              <div className="flex flex-col ">
                <div className="">
                  {/* product info */}
                  <div className="relative h-64 w-full mb-3 border border-gray-800 rounded-xl overflow-hidden">
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
                    {product.salesPrice && (
                      <div className="absolute -top-2 -left-16 p-6">
                        <div className="w-36 h-8">
                          <div className="h-full w-full bg-red-500 text-white text-center leading-8 font-medium transform -rotate-45">
                            {Math.round(
                              ((product?.price - product?.salesPrice) /
                                product?.price) *
                                100
                            ) + "% OFF"}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* price display */}
                    <div className="absolute flex flex-col bottom-0 right-0">
                      <div className="flex items-center p-1 gap-1 text-sm font-semibold text-gray-900">
                        $
                        {product?.salesPrice ? (
                          <>
                            {product?.salesPrice}
                            <p className="text-gray-400 line-through">
                              {"$" + product?.price}
                            </p>
                          </>
                        ) : (
                          product?.price
                        )}
                      </div>
                    </div>

                    {/* main image display */}
                    <img
                      src={"http://localhost:8000" + product?.thumbnail}
                      alt={product?.name}
                      className="w-[100%] h-[100%] object-fill object-center"
                    />
                  </div>

                  {/* product info */}
                  <div className="flex-auto justify-evenly">
                    {/* product name, ratings */}
                    <div className="flex flex-wrap ">
                      <div className="w-full flex-none text-sm flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-amber-500 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-gray-400 whitespace-nowrap mr-3">
                          4.60 (200 reviews)
                        </span>
                      </div>
                      <div className="flex items-center w-full justify-between min-w-0 ">
                        <h2 className="text-lg mr-auto cursor-pointer text-gray-800 truncate">
                          {product?.name}
                        </h2>
                        <div className="flex items-center bg-green-400 text-white text-xs px-2 py-1 ml-3 rounded-lg">
                          INSTOCK
                        </div>
                      </div>
                    </div>

                    {/* product bottom */}
                    <div className="flex font-medium justify-between pt-3">
                      {/* choose size */}
                      {/* <div className="dropdown dropdown-hover">
                        <div
                          tabIndex={0}
                          role="button"
                          className="bg-gray-800 hover:text-gray-100 w-16 h-9 rounded-lg flex items-center justify-center gap-1"
                          onClick={handleOnClickSize}
                        >
                          <span>sizes</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                        </div>
                        <ul
                          tabIndex={0}
                          className="dropdown-content z-[1] menu p-2 shadow bg-gray-800 rounded-lg pt-1 w-24"
                        >
                          <li className="" onClick={handleOnClickSize}>
                            <input
                              type="checkbox"
                              className="checkbox hidden"
                              id="productSize"
                            />
                            <label htmlFor="productSize">
                              <p className="block p-1 border-2 border-gray-100 hover:text-gray-100 rounded-full transition ease-in duration-300 cursor-pointer">
                                <span className="flex items-center justify-center w-3 h-3 rounded-full">
                                  S
                                </span>
                              </p>
                            </label>
                          </li>
                        </ul>
                      </div> */}

                      {/* <select name="size" onChange={handleOnChangeSize}>
                        <option value="">--size--</option>
                        <option value="s">S</option>
                        <option value="m">M</option>
                        <option value="l">L</option>
                        <option value="xl">XL</option>
                      </select> */}

                      {/* add to cart btn */}
                      {/* <button
                        className="transition ease-in duration-300 bg-gray-800 hover:bg-gray-900 border hover:border-gray-500 border-gray-700 hover:text-white  hover:shadow-lg text-gray-400 rounded-full w-9 h-9 text-center p-2"
                        onClick={() => handleOnClickCartBtn(product)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                          />
                        </svg>
                      </button> */}

                      {/* view product btn */}
                      <Link
                        to={`/products/` + product?.slug}
                        target="_blank"
                        className="transition ease-in duration-300 bg-gray-800 hover:bg-gray-900 border hover:border-gray-500 border-gray-700 hover:text-gray-100  hover:shadow-lg text-gray-400 rounded-full w-9 h-9 text-center p-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className=""
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LatestArrival;
