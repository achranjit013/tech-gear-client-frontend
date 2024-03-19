import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Slider from "react-slick";

const images = [
  {
    img: "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg",
  },
  {
    img: "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg",
  },
  {
    img: "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg",
  },
  {
    img: "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg",
  },
];

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

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-16 lg:max-w-7xl lg:px-8 divide-y divide-gray-500/30">
        <h2 className="space-y-2 pb-6 font-semibold uppercase">
          Shop by Categories
        </h2>

        <div className="flex flex-nowrap overflow-x-auto py-6">
          {categories?.map((category) => (
            <div
              key={category._id}
              className="group flex-shrink-0 mr-6 last:mr-0"
            >
              <div className="aspect-h-[0.16] md:aspect-h-[0.12] aspect-w-1 w-44 md:w-56 xl:w-64 overflow-hidden rounded-lg bg-gray-200">
                <Slider {...settings}>
                  {images.map(({ img }, index) => (
                    <div key={index} className="">
                      <Link
                        to={`/products?category=` + category?.slug}
                        target="_blank"
                        className="block"
                      >
                        <div className="h-full w-full">
                          <img
                            src={img}
                            alt={`Image ${index}`}
                            className="h-full w-full object-cover object-center group-hover:opacity-75"
                          />
                        </div>
                      </Link>
                    </div>
                  ))}
                </Slider>
              </div>

              <h3 className="mt-2 text-sm text-gray-700 capitalize font-medium">
                {category.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCategories;
