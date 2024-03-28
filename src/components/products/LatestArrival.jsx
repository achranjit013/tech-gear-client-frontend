import { useEffect } from "react";
import { getFeaturedProductsAction } from "../../pages/product/productAction";
import { useDispatch } from "react-redux";
import FeaturedProducts from "./FeaturedProducts";
import { Link } from "react-router-dom";

const LatestArrival = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeaturedProductsAction());
  }, [dispatch]);

  return (
    <>
      <div className="bg-white">
        <div className="mx-auto max-w-4xl px-4 pt-16 lg:max-w-7xl lg:px-8 divide-y divide-gray-500/30">
          {/* title and cta */}
          <div className="flex flex-col xxs:flex-row xxs:justify-between pb-6">
            <h2 className="space-y-2 font-semibold uppercase">
              Latest Arrivals
            </h2>
            <a
              href="/products/all"
              className="space-y-2 font-semibold hover:font-bold transition-all duration-300 text-indigo-600"
            >
              <span className="inset-0" aria-hidden="true"></span>Shop all
              products <span aria-hidden="true">&rarr;</span>
            </a>
          </div>

          {/* card body */}
          <div className="grid grid-cols-1 xxs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center gap-y-6 gap-x-6 pt-6">
            <FeaturedProducts />
          </div>
        </div>
      </div>
    </>
  );
};

export default LatestArrival;
