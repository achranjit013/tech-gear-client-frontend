import { Link } from "react-router-dom";
import { postNewFavouriteItemAction } from "../../pages/product/productAction";
import { useDispatch, useSelector } from "react-redux";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const FeaturedProducts = () => {
  const dispatch = useDispatch();
  const { selectedProduct } = useSelector((state) => state.productInfo);
  const { featuredProducts } = useSelector((state) => state.productInfo);
  const { favouriteProducts } = useSelector((state) => state.productInfo);
  const { reviews } = useSelector((state) => state.reviewInfo);
  const { user } = useSelector((state) => state.userInfo);

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
      {featuredProducts
        ?.filter((item) => item._id !== selectedProduct?._id)
        ?.map((product, i) => {
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
              className="max-w-xs w-full bg-gray-300/15 shadow-sm rounded-md p-1"
              key={i}
            >
              {/* product display */}
              <div className="relative h-56 sm:h-64 w-full rounded-t-md overflow-hidden">
                {/* add to favorite button */}
                <div className="absolute top-0 right-0 z-10">
                  <button
                    className={classNames(
                      favouriteProducts.filter(
                        ({ productId }) => productId === product._id
                      ).length > 0
                        ? "text-red-500 hover:text-red-400"
                        : "text-gray-400 hover:text-gray-200",
                      "transition-all ease-in duration-300 bg-gray-800 shadow rounded-tr-md rounded-bl-md w-8 h-8 flex items-center justify-center"
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
                  <div className="absolute -top-2 -left-16 p-6 z-10">
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
                    className="absolute top-0 left-0 h-full w-full"
                  />
                </Link>
              </div>

              {/* product info */}
              <div className="flex flex-wrap rounded-b-md mt-3">
                {/* product ratings */}
                <div className="w-full text-sm flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-amber-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>

                  <span className="text-gray-400 whitespace-nowrap">
                    {averageRating} ({ratings.length} reviews)
                  </span>
                </div>

                {/* product name and availability */}
                <div className="flex items-center w-full justify-between min-w-0">
                  <h2 className="text-sm font-medium capitalize mr-auto cursor-pointer text-gray-800 truncate pl-[0.1rem]">
                    {product?.name}
                  </h2>
                  <div className="flex items-center bg-green-500 text-white text-xs font-bold px-1.5 py-1 rounded-br-md rounded-tl-md text-nowrap">
                    {totalQty > 0
                      ? totalQty > Math.ceil(0.2 * totalQty)
                        ? "in stock"
                        : "low in stock"
                      : "out of stock"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default FeaturedProducts;
