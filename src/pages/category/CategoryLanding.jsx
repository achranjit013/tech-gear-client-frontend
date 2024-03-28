import React, { useEffect } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import { Link, useSearchParams } from "react-router-dom";
import {
  getSelectedCategoryAction,
  getSelectedSubCategoryAction,
} from "./categoryAction";
import { useDispatch, useSelector } from "react-redux";
import { getFeaturedProductsAction } from "../product/productAction";
import FeaturedProducts from "../../components/products/FeaturedProducts";

const CategoryLanding = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const slug = searchParams.get("category");
  const subcategorySlug = searchParams.get("subcategory");

  const { selectedCategory } = useSelector((state) => state.categoryInfo);
  const { selectedSubCategory } = useSelector((state) => state.subCategoryInfo);
  const { featuredProducts } = useSelector((state) => state.productInfo);

  const fetchData = async () => {
    // Fetch selected category
    await dispatch(getSelectedCategoryAction({ slug }));
    subcategorySlug &&
      (await dispatch(getSelectedSubCategoryAction({ slug: subcategorySlug })));
  };

  const fetchProducts = async () => {
    // fetch all products for selected category or subcategory
    const filter = subcategorySlug
      ? { subCategoryId: selectedSubCategory?._id }
      : { categoryId: selectedCategory?._id };

    await dispatch(getFeaturedProductsAction(filter));
  };

  useEffect(() => {
    // fetch selected category and subcategory with their resp. slug
    fetchData();

    if (selectedCategory?._id) {
      fetchProducts();
    }
  }, [dispatch, slug, selectedCategory?._id, selectedSubCategory?._id]);

  return (
    <MainLayout>
      <div className="bg-gray-100">
        <div className="mx-auto max-w-4xl px-4 py-8 lg:max-w-7xl lg:px-8 divide-y divide-gray-500/30">
          {/* title and cta */}
          <div className="flex flex-col xxs:flex-row xxs:justify-between pb-6">
            <h2 className="space-y-2 font-semibold uppercase">
              {selectedCategory?.title}{" "}
              {subcategorySlug && ` / ${selectedSubCategory?.title}`}
            </h2>
            <Link
              to="/products/all"
              className="space-y-2 font-semibold hover:font-bold transition-all duration-300 text-indigo-600"
            >
              <span className="inset-0" aria-hidden="true"></span>Shop all
              products <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          {/* card body */}
          <div>
            {selectedCategory?._id && featuredProducts?.length ? (
              <div className="grid grid-cols-1 xxs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center gap-y-6 gap-x-6 pt-6">
                <FeaturedProducts />
              </div>
            ) : (
              <>
                <p className="pt-6 text-center font-medium">
                  No products to display.
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
