const categories = [
  {
    id: 1,
    name: "Earthen Bottle",
    href: "#",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg",
    imageAlt:
      "Tall slender porcelain bottle with natural clay textured body and cork stopper.",
  },
  {
    id: 2,
    name: "Nomad Tumbler",
    href: "#",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg",
    imageAlt:
      "Olive drab green insulated bottle with flared screw lid and flat top.",
  },
  {
    id: 3,
    name: "Focus Paper Refill",
    href: "#",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg",
    imageAlt:
      "Person using a pen to cross a task off a categoryivity paper card.",
  },
  {
    id: 4,
    name: "Machined Mechanical Pencil",
    href: "#",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg",
    imageAlt:
      "Hand holding black machined steel mechanical pencil with brass tip and top.",
  },
];

const FeaturedCategories = () => {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-16 lg:max-w-7xl lg:px-8 -my-6 divide-y divide-gray-500/30">
        <h2 className="space-y-2 py-6 font-semibold uppercase">
          Featured Categories
        </h2>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 xl:gap-x-8 space-y-2 py-6">
          {categories.map((category) => (
            <a key={category.id} href={category.href} className="group">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                <img
                  src={category.imageSrc}
                  alt={category.imageAlt}
                  className="h-full w-full object-cover object-center group-hover:opacity-75"
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700">{category.name}</h3>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCategories;
