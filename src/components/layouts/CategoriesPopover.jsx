import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TbCategory, TbCategory2 } from "react-icons/tb";
import { IoMdListBox } from "react-icons/io";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const CategoriesPopover = () => {
  const { categories } = useSelector((state) => state.categoryInfo);
  const { subCategories } = useSelector((state) => state.subCategoryInfo);
  const { menuProducts } = useSelector((state) => state.productInfo);

  const [lastClickedIndexCategory, setLastClickedIndexCategory] = useState(0);
  const [lastClickedIndexSubCategory, setLastClickedIndexSubCategory] =
    useState(0);
  const [activeCategory, setActiveCategory] = useState({
    categoryId: menuProducts[0]?._id.categoryId,
    subCat: menuProducts[0]?.subCategories,
  });
  const [activeSubCategory, setActiveSubCategory] = useState(
    menuProducts[0]?.subCategories[0]
  );

  return (
    <div className="grid grid-cols-1 xxs:grid-cols-[200px_minmax(180px,_1fr)] xs:grid-cols-[270px_minmax(270px,_1fr)] md:grid-cols-[360px_minmax(360px,_1fr)] lg:grid-cols-[300px_300px_minmax(300px,_1fr)] bg-gray-50 lg:bg-gray-800 border border-gray-300 lg:border-none rounded-lg lg:rounded-none h-auto lg:h-screen">
      {/* categories */}
      <div className="lg:border-t border-r lg:border-t-gray-500 border-r-gray-300 lg:border-r-gray-500">
        <div className="px-6 py-4 overflow-y-auto">
          <div className="space-y-2 font-medium">
            {menuProducts.map(({ _id, subCategories }, index) => (
              <a
                key={_id.categoryId}
                href={`/products?category=${
                  categories.find((item) => item._id === _id.categoryId)?.slug
                }`}
                className={classNames(
                  index === lastClickedIndexCategory
                    ? "bg-gray-200 lg:bg-gray-700"
                    : "",
                  "flex items-center p-2 rounded-lg hover:bg-gray-200 lg:hover:bg-gray-700 group cursor-pointer"
                )}
                onMouseEnter={() => {
                  setActiveCategory({
                    categoryId: _id.categoryId,
                    subCat: subCategories,
                  });
                  setActiveSubCategory(subCategories[0]);
                  setLastClickedIndexCategory(index);
                  setLastClickedIndexSubCategory(0); // reset the index of the subcategory to 0
                }}
              >
                <div>
                  <TbCategory
                    className={classNames(
                      index === lastClickedIndexCategory
                        ? "text-gray-800 lg:text-gray-100"
                        : "text-gray-500 lg:text-gray-400",
                      "w-5 h-5 transition duration-75 group-hover:text-gray-800 lg:group-hover:text-gray-100"
                    )}
                  />
                </div>
                <span
                  className={classNames(
                    index === lastClickedIndexCategory
                      ? "text-gray-800 lg:text-gray-100"
                      : "text-gray-500 lg:text-gray-400",
                    "inline-block ms-3 uppercase transition duration-75 group-hover:text-gray-800 lg:group-hover:text-gray-100"
                  )}
                >
                  {
                    categories.find((item) => item._id === _id.categoryId)
                      ?.title
                  }
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* subcategories */}
      <div className="hidden xxs:block lg:border-t lg:border-r lg:border-t-gray-500 lg:border-r-gray-500">
        <div className="px-6 py-4 overflow-y-auto">
          <div className="space-y-2 font-medium">
            {activeCategory?.categoryId &&
              activeCategory?.subCat?.map(
                ({ subCategoryId, products }, index) => (
                  <a
                    key={subCategoryId}
                    href={`/products?category=${
                      categories.find(
                        (item) => item._id === activeCategory?.categoryId
                      )?.slug
                    }&subcategory=${
                      subCategories
                        .find((item) => item._id === activeCategory.categoryId)
                        ?.subCat?.find((item) => item._id === subCategoryId)
                        ?.slug
                    }`}
                    className={classNames(
                      index === lastClickedIndexSubCategory
                        ? "bg-gray-200 lg:bg-gray-700"
                        : "",
                      "flex items-center p-2 rounded-lg hover:bg-gray-200 lg:hover:bg-gray-700 group cursor-pointer"
                    )}
                    onMouseEnter={() => {
                      setActiveSubCategory({ subCategoryId, products });
                      setLastClickedIndexSubCategory(index);
                    }}
                  >
                    <div>
                      <TbCategory2
                        className={classNames(
                          index === lastClickedIndexSubCategory
                            ? "text-gray-800 lg:text-gray-100"
                            : "text-gray-500 lg:text-gray-400",
                          "w-5 h-5 transition duration-75 group-hover:text-gray-800 lg:group-hover:text-gray-100"
                        )}
                      />
                    </div>
                    <span
                      className={classNames(
                        index === lastClickedIndexSubCategory
                          ? "text-gray-800 lg:text-gray-100"
                          : "text-gray-500 lg:text-gray-400",
                        "inline-block ms-3 uppercase transition duration-75 group-hover:text-gray-800 lg:group-hover:text-gray-100"
                      )}
                    >
                      {
                        subCategories
                          .find(
                            (item) => item._id === activeCategory.categoryId
                          )
                          ?.subCat?.find((item) => item._id === subCategoryId)
                          ?.title
                      }
                    </span>
                  </a>
                )
              )}
          </div>
        </div>
      </div>

      {/* products */}
      <div className="hidden lg:block lg:border-t lg:border-t-gray-500">
        <div className="px-6 py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {activeSubCategory?.subCategoryId &&
              activeSubCategory?.products?.map((product) => (
                <a
                  key={product._id}
                  href={`/products/` + product.slug}
                  className="flex items-center p-2 rounded-lg text-gray-50 hover:bg-gray-700 group cursor-pointer"
                >
                  <div>
                    <IoMdListBox className="w-5 h-5 transition duration-75 text-gray-400 group-hover:text-gray-100" />
                  </div>
                  <span className="inline-block ms-3 uppercase transition duration-75 text-gray-400 group-hover:text-gray-100">
                    {product.name}
                  </span>
                </a>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPopover;
