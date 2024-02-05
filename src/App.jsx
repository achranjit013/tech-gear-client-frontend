import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Products from "./pages/product/Products";
import ProductLanding from "./pages/product/ProductLanding";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<ProductLanding />} />
      </Routes>
    </>
  );
}

export default App;
