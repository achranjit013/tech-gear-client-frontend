import FeaturedCategories from "../../components/categories/FeaturedCategories";
import Hero from "../../components/hero/Hero";
import MainLayout from "../../components/layouts/MainLayout";
import NewsLetter from "../../components/newsletter/NewsLetter";
import LatestArrival from "../../components/products/LatestArrival";
import Testimonials from "../../components/testimonials/Testimonials";

const Home = () => {
  return (
    <MainLayout>
      <Hero />
      <LatestArrival />
      <FeaturedCategories />
      <Testimonials />
      <NewsLetter />
    </MainLayout>
  );
};

export default Home;
