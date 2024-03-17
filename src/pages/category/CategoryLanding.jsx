import React, { useEffect } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { getSelectedCategoryAction } from "./categoryAction";
import { useDispatch, useSelector } from "react-redux";
import { autoLogin } from "../user/userAction";
import { getFeaturedProductsAction } from "../product/productAction";
import FeaturedProducts from "../../components/products/FeaturedProducts";

const CategoryLanding = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const slug = searchParams.get("category");

  const { selectedCategory } = useSelector((state) => state.categoryInfo);
  const { featuredProducts } = useSelector((state) => state.productInfo);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch selected category
      await dispatch(getSelectedCategoryAction({ slug }));
    };

    const fetchProducts = async () => {
      // fetch all products for selected category
      await dispatch(
        getFeaturedProductsAction({ categoryId: selectedCategory._id })
      );
    };

    fetchData();

    if (selectedCategory?._id) {
      fetchProducts();
    }
  }, [dispatch, slug, selectedCategory?._id]);

  return (
    <MainLayout>
      <div className="bg-gray-100">
        <div className="mx-auto max-w-4xl px-4 py-8 lg:max-w-7xl lg:px-8 divide-y divide-gray-500/30">
          {/* title and cta */}
          <div className="flex flex-col xxs:flex-row xxs:justify-between pb-6">
            <h2 className="space-y-2 font-semibold uppercase">Products</h2>
            <Link
              to="/products"
              className="space-y-2 font-semibold hover:font-bold transition-all duration-300 text-indigo-600"
            >
              <span className="inset-0" aria-hidden="true"></span>Shop all
              products <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          {/* card body */}
          <div>
            {selectedCategory?._id && featuredProducts?.length ? (
              <FeaturedProducts />
            ) : (
              <>
                <p className="pt-6 text-center font-medium">
                  No products to display for {selectedCategory.title}.
                </p>
                <p className="pt-3 text-center font-medium">
                  Stay tuned, we will be adding the products soon.
                </p>
                <p className="pt-3 text-center font-medium">
                  Sorry for the inconvenience!
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CategoryLanding;
