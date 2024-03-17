import React, { useEffect } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import { useDispatch, useSelector } from "react-redux";
import FeaturedProducts from "../../components/products/FeaturedProducts";
import { getFeaturedProductsAction } from "../product/productAction";
import { Link } from "react-router-dom";

const Favourite = () => {
  const dispatch = useDispatch();
  const { favouriteProducts } = useSelector((state) => state.productInfo);

  useEffect(() => {
    dispatch(
      getFeaturedProductsAction({
        ids: favouriteProducts?.map(({ productId }) => productId),
      })
    );
  }, [dispatch, favouriteProducts?.length]);

  return (
    <MainLayout>
      <div className="bg-gray-100">
        <div className="mx-auto max-w-4xl px-4 py-8 lg:max-w-7xl lg:px-8 divide-y divide-gray-500/30">
          {/* title and cta */}
          <div className="flex flex-col xxs:flex-row xxs:justify-between pb-6">
            <h2 className="space-y-2 font-semibold uppercase">My Favourites</h2>
            <Link
              to="/products"
              className="space-y-2 font-semibold hover:font-bold transition-all duration-300 text-indigo-600"
            >
              <span className="inset-0" aria-hidden="true"></span>Shop all
              products <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          {/* card body */}
          {favouriteProducts?.length ? (
            <FeaturedProducts />
          ) : (
            <p className="pt-6 text-center font-medium">
              No favourites to display
            </p>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Favourite;
