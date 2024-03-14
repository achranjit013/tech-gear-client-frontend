import { useEffect } from "react";
import { getLatestArrivalsAction } from "../../pages/product/productAction";
import { useDispatch } from "react-redux";
import FeaturedProducts from "./FeaturedProducts";
import { Link } from "react-router-dom";

const LatestArrival = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getLatestArrivalsAction());
  }, [dispatch]);

  return (
    <>
      <div className="bg-gray-100">
        <div className="mx-auto max-w-4xl px-4 py-16 lg:max-w-7xl lg:px-8 divide-y divide-gray-500/30">
          {/* title and cta */}
          <div className="flex flex-col xxs:flex-row xxs:justify-between pb-6">
            <h2 className="space-y-2 font-semibold uppercase">
              Latest Arrivals
            </h2>
            <Link
              to="/products"
              className="space-y-2 font-semibold hover:font-bold transition-all duration-300 text-indigo-600"
            >
              <span className="inset-0" aria-hidden="true"></span>Shop all
              products <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          {/* card body */}
          <FeaturedProducts />
        </div>
      </div>
    </>
  );
};

export default LatestArrival;
