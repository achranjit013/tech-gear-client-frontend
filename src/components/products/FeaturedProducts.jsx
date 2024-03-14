import { useEffect } from "react";
import { Link } from "react-router-dom";
import { postNewFavouriteItemAction } from "../../pages/product/productAction";
import { useDispatch, useSelector } from "react-redux";
import { getReviewAction } from "../../pages/product/reviewAction";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const FeaturedProducts = () => {
  const dispatch = useDispatch();
  const { featuredProducts } = useSelector((state) => state.productInfo);
  const { favouriteProducts } = useSelector((state) => state.productInfo);
  const { reviews } = useSelector((state) => state.reviewInfo);
  const { user } = useSelector((state) => state.userInfo);

  useEffect(() => {
    dispatch(getReviewAction());
  }, [dispatch]);

  const handleOnAddFavouriteBtn = (productId, favourite) => {
    const obj = {
      userId: user?._id,
      productId,
      favourite,
    };

    dispatch(postNewFavouriteItemAction(obj));
  };

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
    <>
      {/* card body */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center gap-y-10 gap-x-6 md:gap-x-3 lg:gap-x-4 xl:gap-x-8 py-6">
        {featuredProducts?.map((product, i) => {
          const ratings = ratingsMap[product._id] || [];
          const totalRatings = ratings.reduce((sum, rating) => sum + rating, 0);
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
                    <div className="absolute flex flex-col top-0 right-0 p-1 z-10">
                      <button
                        className={classNames(
                          favouriteProducts.filter(
                            ({ productId }) => productId === product._id
                          ).length > 0
                            ? "text-red-500 hover:text-red-400"
                            : "text-gray-400 hover:text-gray-200",
                          "transition ease-in duration-300 bg-gray-800 shadow rounded-full w-8 h-8 text-center p-1"
                        )}
                        onClick={() =>
                          handleOnAddFavouriteBtn(
                            product._id,
                            favouriteProducts.filter(
                              ({ productId }) => productId === product._id
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
                    <div className="absolute flex flex-col bottom-0 right-0 z-10">
                      <div className="flex items-center p-1 gap-1 text-sm font-semibold rounded-tl-lg bg-gray-50 text-gray-800">
                        ${lowestPrice}
                      </div>
                    </div>

                    {/* main image display */}
                    <Link to={`/products/` + product?.slug} target="_blank">
                      <img
                        src={product?.thumbnail}
                        alt={product?.name}
                        className="absolute top-0 left-0 w-full h-full object-fit-cover"
                      />
                    </Link>
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
                        <h2 className="text-lg capitalize mr-auto cursor-pointer text-gray-800 truncate">
                          {product?.name}
                        </h2>
                        <div className="flex items-center bg-green-400 text-white text-xs px-1 py-1 ml-2 rounded-lg text-nowrap">
                          {totalQty > 0
                            ? totalQty > Math.ceil(0.2 * totalQty)
                              ? "in stock"
                              : "low in stock"
                            : "out of stock"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default FeaturedProducts;
