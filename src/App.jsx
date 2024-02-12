import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Products from "./pages/product/Products";
import ProductLanding from "./pages/product/ProductLanding";
import Login from "./pages/user/Login";
import { ToastContainer } from "react-toastify";
import Cart from "./pages/cart/Cart";
import CartPopover from "./components/cart/CartPopover";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<ProductLanding />} />
        <Route
          path="/products/cart-items/:slug&:size"
          element={<CartPopover />}
        />
        <Route path="/cart" element={<Cart />} />
      </Routes>

      <ToastContainer />
    </>
  );
}

export default App;
