import { useEffect, useState } from "react";
import { getProducts } from "../../helper/axiosHelper";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Earthen Bottle",
    href: "#",
    price: "$48",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg",
    imageAlt:
      "Tall slender porcelain bottle with natural clay textured body and cork stopper.",
  },
  {
    id: 2,
    name: "Nomad Tumbler",
    href: "#",
    price: "$35",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg",
    imageAlt:
      "Olive drab green insulated bottle with flared screw lid and flat top.",
  },
  {
    id: 3,
    name: "Focus Paper Refill",
    href: "#",
    price: "$89",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg",
    imageAlt:
      "Person using a pen to cross a task off a productivity paper card.",
  },
  {
    id: 4,
    name: "Machined Mechanical Pencil",
    href: "#",
    price: "$35",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg",
    imageAlt:
      "Hand holding black machined steel mechanical pencil with brass tip and top.",
  },
  {
    id: 5,
    name: "Earthen Bottle",
    href: "#",
    price: "$48",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg",
    imageAlt:
      "Tall slender porcelain bottle with natural clay textured body and cork stopper.",
  },
  {
    id: 6,
    name: "Nomad Tumbler",
    href: "#",
    price: "$35",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg",
    imageAlt:
      "Olive drab green insulated bottle with flared screw lid and flat top.",
  },
  {
    id: 7,
    name: "Focus Paper Refill",
    href: "#",
    price: "$89",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg",
    imageAlt:
      "Person using a pen to cross a task off a productivity paper card.",
  },
  {
    id: 8,
    name: "Machined Mechanical Pencil",
    href: "#",
    price: "$35",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg",
    imageAlt:
      "Hand holding black machined steel mechanical pencil with brass tip and top.",
  },
  {
    id: 9,
    name: "Earthen Bottle",
    href: "#",
    price: "$48",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg",
    imageAlt:
      "Tall slender porcelain bottle with natural clay textured body and cork stopper.",
  },
  {
    id: 10,
    name: "Nomad Tumbler",
    href: "#",
    price: "$35",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg",
    imageAlt:
      "Olive drab green insulated bottle with flared screw lid and flat top.",
  },
  {
    id: 11,
    name: "Focus Paper Refill",
    href: "#",
    price: "$89",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg",
    imageAlt:
      "Person using a pen to cross a task off a productivity paper card.",
  },
  {
    id: 12,
    name: "Machined Mechanical Pencil",
    href: "#",
    price: "$35",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg",
    imageAlt:
      "Hand holding black machined steel mechanical pencil with brass tip and top.",
  },
  // More products...
];

const LatestArrival = () => {
  const [lastestArrivals, setLatestArrivals] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const { status, findResult } = await getProducts();
      console.log(findResult);

      setLatestArrivals(findResult);
    }
    fetchData();
  }, []);

  console.log(lastestArrivals);
  console.log(import.meta.env.VITE_SERVER_ROOT);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 lg:max-w-7xl lg:px-8 -my-6 divide-y divide-gray-500/30">
        <div className="flex justify-between">
          <h2 className="space-y-2 py-6 font-semibold uppercase">
            Latest Arrivals
          </h2>
          <Link
            to="/products"
            className="space-y-2 py-6 font-semibold text-indigo-600"
          >
            <span className="inset-0" aria-hidden="true"></span>Shop all
            products <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 space-y-2 py-6">
          {lastestArrivals?.map((product, i) => (
            <a
              key={product?._id}
              href={"/products/" + product?._id}
              className="group"
            >
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                {/* <img src={import.meta.env.VITE_SERVER_ROOT + url} width={100} /> */}

                <img
                  src={"http://localhost:8000" + product?.thumbnail}
                  alt={product?.name}
                  className="h-full w-full object-cover object-center group-hover:opacity-75"
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700">{product?.name}</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">
                {product?.price}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LatestArrival;
