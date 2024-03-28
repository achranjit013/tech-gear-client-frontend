import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Slider from "react-slick";

const FeaturedCategories = () => {
  let settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
  };

  const { categories } = useSelector((state) => state.categoryInfo);
  const { subCategories } = useSelector((state) => state.subCategoryInfo);
  const { menuProducts } = useSelector((state) => state.productInfo);

  const getCategoryInfo = (catId, property) => {
    const category = categories.find((item) => item._id === catId);
    return category ? category[property] : undefined;
  };

  const getSubCategoryInfo = (catId, subCatId, property) => {
    const subcategory = subCategories
      .find((item) => item._id === catId)
      ?.subCat?.find((item) => item._id === subCatId);

    return subcategory ? subcategory[property] : undefined;
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-4 pt-16 lg:max-w-7xl lg:px-8 divide-y divide-gray-500/30">
        <div className="flex flex-col xxs:flex-row xxs:justify-between pb-6">
          <h2 className="space-y-2 font-semibold uppercase">
            Shop by Categories
          </h2>
          <a
            href="/products/all"
            className="space-y-2 font-semibold hover:font-bold transition-all duration-300 text-indigo-600"
          >
            <span className="inset-0" aria-hidden="true"></span>Shop all
            categories <span aria-hidden="true">&rarr;</span>
          </a>
        </div>

        <div className="flex flex-nowrap overflow-x-auto pt-6">
          {/* {subCategories?.map(({ _id: catId, subCat }) => (
            <div key={catId} className="group flex-shrink-0 mr-6 last:mr-0">
              <div className="h-52 md:h-56 xl:h-64 aspect-h-[0.16] md:aspect-h-[0.12] aspect-w-1 w-52 md:w-56 xl:w-64 overflow-hidden rounded-md bg-gray-300/15">
                <Slider {...settings}>
                  <div className="h-full w-full">
                    <Link
                      to={
                        `/products?category=` + getCategoryInfo(catId, "slug")
                      }
                      target="_blank"
                      className="block"
                    >
                      <div className="h-full w-full">
                        <img
                          src={getCategoryInfo(catId, "image")}
                          alt={`Image - ${getCategoryInfo(catId, "slug")}`}
                          className="h-full w-full object-cover object-center group-hover:opacity-75"
                        />
                      </div>
                    </Link>
                  </div>
                  {subCat.map(({ _id, slug, image }, index) => (
                    <div key={_id} className="">
                      <Link
                        to={
                          `/products?category=` + getCategoryInfo(catId, "slug")
                        }
                        target="_blank"
                        className="block"
                      >
                        <div className="h-full w-full">
                          <img
                            src={image}
                            alt={`Image - ${slug}`}
                            className="h-full w-full group-hover:opacity-75"
                          />
                        </div>
                      </Link>
                    </div>
                  ))}
                </Slider>
              </div>

              <h3 className="mt-2 text-sm text-gray-700 capitalize font-medium">
                {getCategoryInfo(catId, "title")}
              </h3>
            </div>
          ))} */}
          {menuProducts?.map(({ _id: catId, subCategories: subCat }) => (
            <div
              key={catId.categoryId}
              className="group flex-shrink-0 mr-6 last:mr-0"
            >
              <div className="h-52 md:h-56 xl:h-64 aspect-h-[0.16] md:aspect-h-[0.12] aspect-w-1 w-52 md:w-56 xl:w-64 overflow-hidden rounded-md bg-gray-300/15">
                <Slider {...settings}>
                  <div className="h-full w-full">
                    <Link
                      to={
                        `/products?category=` +
                        getCategoryInfo(catId.categoryId, "slug")
                      }
                      target="_blank"
                      className="block"
                    >
                      <div className="h-full w-full">
                        <img
                          src={getCategoryInfo(catId.categoryId, "image")}
                          alt={`Image - ${getCategoryInfo(
                            catId.categoryId,
                            "slug"
                          )}`}
                          className="h-full w-full object-cover object-center group-hover:opacity-75"
                        />
                      </div>
                    </Link>
                  </div>
                  {subCat.map(({ subCategoryId: _id }, index) => (
                    <div key={_id} className="">
                      <Link
                        to={
                          `/products?category=` +
                          getCategoryInfo(catId.categoryId, "slug")
                        }
                        target="_blank"
                        className="block"
                      >
                        <div className="h-full w-full">
                          <img
                            src={getSubCategoryInfo(
                              catId.categoryId,
                              _id,
                              "image"
                            )}
                            alt={`Image - ${getSubCategoryInfo(
                              catId.categoryId,
                              _id,
                              "slug"
                            )}`}
                            className="h-full w-full group-hover:opacity-75"
                          />
                        </div>
                      </Link>
                    </div>
                  ))}
                </Slider>
              </div>

              <h3 className="mt-2 text-sm text-gray-700 capitalize font-medium">
                {getCategoryInfo(catId.categoryId, "title")}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCategories;
