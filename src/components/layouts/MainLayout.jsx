import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import TopNav from "./TopNav";

const MainLayout = ({ children, displayCart }) => {
  return (
    <div className="relative">
      <Header />

      <main className="min-h-[calc(100vh-50rem)]">{children}</main>

      <Footer />
    </div>
  );
};

export default MainLayout;
