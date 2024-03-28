import React, { useEffect } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import { useDispatch } from "react-redux";
import { getFeaturedProductsAction } from "./productAction";
import FeaturedProducts from "../../components/products/FeaturedProducts";

const Products = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeaturedProductsAction({ products: "all" }));
  }, [dispatch]);

  return (
    <MainLayout>
      <div className="bg-gray-100">
        <div className="mx-auto max-w-4xl px-4 py-8 lg:max-w-7xl lg:px-6 divide-y divide-gray-500/30">
          <div className="flex flex-col xxs:flex-row xxs:justify-between pb-6">
            <h2 className="space-y-2 font-semibold uppercase">
              Products / all
            </h2>
          </div>

          <div className="grid grid-cols-1 xxs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center gap-y-6 gap-x-6 pt-6">
            <FeaturedProducts />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Products;
