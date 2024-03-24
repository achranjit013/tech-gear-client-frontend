import { Carousel } from "flowbite-react";

const Hero = () => {
  return (
    <div className="h-96">
      <Carousel>
        <img
          src="https://daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.jpg"
          alt="..."
          className="w-full h-full object-cover"
        />
        <img
          src="https://daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.jpg"
          alt="..."
          className="w-full h-full object-cover"
        />
        <img
          src="https://daisyui.com/images/stock/photo-1414694762283-acccc27bca85.jpg"
          alt="..."
          className="w-full h-full object-cover"
        />
        <img
          src="https://daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.jpg"
          alt="..."
          className="w-full h-full object-cover"
        />
        <img
          src="https://daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.jpg"
          alt="..."
          className="w-full h-full object-cover"
        />
      </Carousel>
    </div>
  );
};

export default Hero;
