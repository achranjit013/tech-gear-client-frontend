import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="relative">
      <Header />

      <main className="min-h-[calc(100vh-34rem)] bg-gray-100">{children}</main>

      <Footer />
    </div>
  );
};

export default MainLayout;
