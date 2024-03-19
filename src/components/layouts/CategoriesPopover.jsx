import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSubCategoriesByCategoryIdAction } from "../../pages/category/categoryAction";
import { getProductsBySubCategoryIdAction } from "../../pages/product/productAction";
import { TbCategory, TbCategory2 } from "react-icons/tb";
import { IoMdListBox } from "react-icons/io";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const CategoriesPopover = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categoryInfo);
  const { subCategories } = useSelector((state) => state.subCategoryInfo);
  const { subcategoryProducts } = useSelector((state) => state.productInfo);

  const [categorySlug, setCategorySlug] = useState(categories[0]?.slug);
  const [lastClickedIndexCategory, setLastClickedIndexCategory] = useState(0);
  const [lastClickedIndexSubCategory, setLastClickedIndexSubCategory] =
    useState(0);

  useEffect(() => {
    dispatch(getSubCategoriesByCategoryIdAction(categories[0]?._id));
  }, []);

  useEffect(() => {
    dispatch(
      getProductsBySubCategoryIdAction({
        subCategoryId: subCategories[0]?._id,
      })
    );
  }, [subCategories[0]?._id]);

  const fetchSubCategoriesOnMouseEnter = (categoryId, slug, index) => {
    dispatch(getSubCategoriesByCategoryIdAction(categoryId));
    setLastClickedIndexCategory(index);
    setLastClickedIndexSubCategory(0);
    setCategorySlug(slug);
  };

  const fetchProductsOnMouseEnter = (subCategoryId, index) => {
    dispatch(getProductsBySubCategoryIdAction({ subCategoryId }));
    setLastClickedIndexSubCategory(index);
  };

  const extractSrc = (svgImage) => {
    const srcRegex = /<img\s+src=['"]([^'"]+)['"]/;
    const match = svgImage?.match(srcRegex);
    return match ? match[1] : ""; // Extracting src value from the matched regex
  };

  return (
    <div className="grid grid-cols-[300px_300px_minmax(300px,_1fr)] divide-x-[0.1px]">
      {/* categories */}
      <aside
        className="border-t border-t-gray-50 h-screen bg-gray-800"
        aria-label="Sidebar"
      >
        <div className="px-6 py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {categories?.map((category, index) => (
              <li key={index}>
                <a
                  href={`/products?category=${category.slug}`}
                  className={classNames(
                    index === lastClickedIndexCategory ? "bg-gray-700" : "",
                    "flex items-center p-2 rounded-lg text-gray-50 hover:bg-gray-700 group"
                  )}
                  onMouseEnter={() =>
                    fetchSubCategoriesOnMouseEnter(
                      category._id,
                      category.slug,
                      index
                    )
                  }
                >
                  <TbCategory
                    className={classNames(
                      index === lastClickedIndexCategory
                        ? "text-gray-100"
                        : "text-gray-400",
                      "w-5 h-5 transition duration-75 group-hover:text-gray-100"
                    )}
                  />

                  <span
                    className={classNames(
                      index === lastClickedIndexCategory
                        ? "text-gray-100"
                        : "text-gray-400",
                      "ms-3 uppercase transition duration-75 group-hover:text-gray-100"
                    )}
                  >
                    {category.title}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* subcategories */}
      <aside
        className="border-t border-t-gray-50 h-screen bg-gray-800"
        aria-label="Sidebar"
      >
        <div className="px-6 py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {subCategories?.map((subCategory, index) => (
              <li key={index}>
                <a
                  href={`/products?category=${categorySlug}&subcategory=${subCategory.slug}`}
                  className={classNames(
                    index === lastClickedIndexSubCategory ? "bg-gray-700" : "",
                    "flex items-center p-2 rounded-lg text-gray-50 hover:bg-gray-700 group"
                  )}
                  onMouseEnter={() =>
                    fetchProductsOnMouseEnter(subCategory._id, index)
                  }
                >
                  <TbCategory2
                    className={classNames(
                      index === lastClickedIndexCategory
                        ? "text-gray-100"
                        : "text-gray-400",
                      "w-5 h-5 transition duration-75 group-hover:text-gray-100"
                    )}
                  />
                  <span
                    className={classNames(
                      index === lastClickedIndexSubCategory
                        ? "text-gray-100"
                        : "text-gray-400",
                      "ms-3 uppercase transition duration-75 group-hover:text-gray-100"
                    )}
                  >
                    {subCategory.title}
                  </span>
                </a>
              </li>
            ))}

            {!subCategories?.length && (
              <li className="flex items-center p-2 rounded-lg text-gray-50 bg-gray-700 group">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 text-red-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>

                <span className="ms-3 capitalize text-red-500 font-light">
                  Products coming soon...
                </span>
              </li>
            )}
          </ul>
        </div>
      </aside>

      {/* products */}
      <aside
        className="border-t border-t-gray-50 h-screen bg-gray-800"
        aria-label="Sidebar"
      >
        <div className="px-6 py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {subcategoryProducts?.map((product, index) => (
              <li key={index}>
                <a
                  href={`/products/` + product?.slug}
                  className="flex items-center p-2 rounded-lg text-gray-50 hover:bg-gray-700 group"
                >
                  <IoMdListBox
                    className={classNames(
                      index === lastClickedIndexCategory
                        ? "text-gray-100"
                        : "text-gray-400",
                      "w-5 h-5 transition duration-75 group-hover:text-gray-100"
                    )}
                  />
                  <span className="ms-3 uppercase transition duration-75 text-gray-400 group-hover:text-gray-100">
                    {product.name}
                  </span>
                </a>
              </li>
            ))}

            {!subcategoryProducts?.length && (
              <li className="flex items-center p-2 rounded-lg text-gray-50 bg-gray-700 group">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 text-red-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>

                <span className="ms-3 capitalize text-red-500 font-light">
                  Products coming soon...
                </span>
              </li>
            )}
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default CategoriesPopover;
