import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getLatestArrivalsAction } from "../../pages/product/productAction";
import { useDispatch, useSelector } from "react-redux";
import { getReviewAction } from "../../pages/product/reviewAction";

const LatestArrival = () => {
  const dispatch = useDispatch();
  const { latestArrivals } = useSelector((state) => state.productInfo);
  const { reviews } = useSelector((state) => state.reviewInfo);

  useEffect(() => {
    dispatch(getLatestArrivalsAction());
    dispatch(getReviewAction());
  }, [dispatch]);

  const ratingsMap = reviews.reduce((accumulator, { productId, ratings }) => {
    if (!accumulator[productId]) {
      accumulator[productId] = [];
    }
    accumulator[productId].push(ratings);
    return accumulator;
  }, {});

  const getHighestSalesPricePercent = (arr) => {
    let highestSalesPricePercent = 0;

    for (let i = 0; i < arr.length; i++) {
      const salesPrice = arr[i].salesPrice;
      const price = arr[i].price;

      let salePercent = 0;
      if (salesPrice) {
        salePercent = Math.round(((price - salesPrice) / price) * 100);
      }
      if (salePercent > highestSalesPricePercent) {
        highestSalesPricePercent = salePercent;
      }
    }

    return highestSalesPricePercent;
  };

  const getLowestPrice = (arr) => {
    let lowestProductPrice = arr[0].price;

    for (let i = 0; i < arr.length; i++) {
      const price = arr[i].price;

      if (price < lowestProductPrice) {
        lowestProductPrice = price;
      }
    }

    return lowestProductPrice;
  };

  return (
    <div className="bg-gray-100">
      <div className="mx-auto max-w-2xl px-4 py-16 lg:max-w-7xl lg:px-8 -my-6 divide-y divide-gray-500/30">
        {/* title and cta */}
        <div className="flex flex-col xxs:flex-row xxs:justify-between">
          <h2 className="space-y-2 pt-6 xxs:py-6 font-semibold uppercase">
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
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center gap-y-10 gap-x-6 xl:gap-x-8 py-6">
          {latestArrivals?.map((product, i) => {
            const ratings = ratingsMap[product._id] || [];
            const totalRatings = ratings.reduce(
              (sum, rating) => sum + rating,
              0
            );
            const averageRating =
              ratings.length > 0 ? totalRatings / ratings.length : 0;

            const totalQty = product?.variants.reduce(
              (accumulator, { qty }) => accumulator + qty,
              0
            );

            const highestSalesPercent = getHighestSalesPricePercent(
              product.variants
            );

            const lowestPrice = getLowestPrice(product.variants);

            return (
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
                      {highestSalesPercent > 0 && (
                        <div className="absolute -top-2 -left-16 p-6">
                          <div className="w-36 h-8">
                            <div className="h-full w-full bg-red-500 text-white text-center leading-8 font-medium transform -rotate-45">
                              {highestSalesPercent}% OFF
                            </div>
                          </div>
                        </div>
                      )}

                      {/* price display */}
                      <div className="absolute flex flex-col bottom-0 right-0">
                        <div className="flex items-center p-1 gap-1 text-sm font-semibold text-gray-900">
                          ${lowestPrice}
                        </div>
                      </div>

                      {/* main image display */}
                      <img
                        src={"http://localhost:8000" + product?.thumbnail}
                        alt={product?.name}
                        className="w-[100%] h-[100%] object-contain object-center"
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
                            {averageRating} ({ratings.length} reviews)
                          </span>
                        </div>
                        <div className="flex items-center w-full justify-between min-w-0 ">
                          <h2 className="text-lg mr-auto cursor-pointer text-gray-800 truncate">
                            {product?.name}
                          </h2>
                          <div className="flex items-center bg-green-400 text-white text-xs px-1 py-1 ml-2 rounded-lg">
                            {totalQty > 0
                              ? totalQty > Math.ceil(0.2 * totalQty)
                                ? "in stock"
                                : "low in stock"
                              : "out of stock"}
                          </div>
                        </div>
                      </div>

                      {/* product bottom */}
                      <div className="flex font-medium justify-between pt-3">
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
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LatestArrival;
