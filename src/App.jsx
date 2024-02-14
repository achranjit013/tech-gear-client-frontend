import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Products from "./pages/product/Products";
import ProductLanding from "./pages/product/ProductLanding";
import Login from "./pages/user/Login";
import { ToastContainer } from "react-toastify";
import Cart from "./pages/cart/Cart";
import CartPopover from "./components/cart/CartPopover";
import Checkout from "./pages/checkout/Checkout";
import PrivateRoute from "./components/privateRoute/PrivateRoute";
import Dashboard from "./pages/dashboard/Dashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<ProductLanding />} />
        {/* need to change the path of the following, vvi */}
        {/* <Route
          path="/products/cart-items/:slug&:size"
          element={<CartPopover />}
        /> */}
        <Route path="/cart" element={<Cart />} />

        {/* below this point are all private routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* <Route
          path="/cart/:productId&:size"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        /> */}

        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          }
        />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition:Bounce
      />
    </>
  );
}

export default App;
