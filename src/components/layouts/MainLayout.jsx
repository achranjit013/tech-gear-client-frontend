import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import TopNav from "./TopNav";

const MainLayout = ({ children, title }) => {
  return (
    <div className="relative">
      <Header />

      <main className="min-h-[calc(100vh-4.5rem)]">{children}</main>

      <Footer />
    </div>
  );
};

export default MainLayout;
