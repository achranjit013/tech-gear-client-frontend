import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Products from "./pages/product/Products";
import ProductLanding from "./pages/product/ProductLanding";
import Login from "./pages/user/Login";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<ProductLanding />} />
      </Routes>

      <ToastContainer />
    </>
  );
}

export default App;
