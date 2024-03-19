import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Products from "./pages/product/Products";
import ProductLanding from "./pages/product/ProductLanding";
import Login from "./pages/user/Login";
import { ToastContainer } from "react-toastify";
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/checkout/Checkout";
import PrivateRoute from "./components/privateRoute/PrivateRoute";
import Dashboard from "./pages/dashboard/Dashboard";
import ContactDetails from "./pages/profile/ContactDetails";
import OrderHistory from "./pages/orderHistory/OrderHistory";
import CreateAccount from "./pages/user/CreateAccount";
import VerifyEmail from "./pages/user/VerifyEmail";
import Favourite from "./pages/favourite/Favourite";
import CategoryLanding from "./pages/category/CategoryLanding";
import CategoriesPopover from "./components/layouts/CategoriesPopover";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/create-account" element={<CreateAccount />} />
        {/* <Route path="/products" element={<Products />} /> */}
        <Route path="/products/:slug" element={<ProductLanding />} />
        <Route path="/products" element={<CategoryLanding />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/favourites" element={<Favourite />} />
        <Route
          path="/categories-popover-menu"
          element={<CategoriesPopover />}
        />

        {/* below this point are all private routes */}

        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/contact-details"
          element={
            <PrivateRoute>
              <ContactDetails />
            </PrivateRoute>
          }
        />

        <Route
          path="/order-history"
          element={
            <PrivateRoute>
              <OrderHistory />
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
