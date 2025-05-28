import React from "react";
import Navbar from "../components/public/Navbar";
import Footer from "../components/public/Footer";

function PublicLayout({ children }) {
  return (
    <div className="public-layout">
      <Navbar />
      <main className="pt-20">{children}</main>
      <Footer />
    </div>
  );
}

export default PublicLayout;
