import React from "react";
import { useNavigate } from "react-router-dom";
import MagnusNavbar from "../components/magnus/MagnusNavbar";
import MagnusFooter from "../components/magnus/MagnusFooter";

function PublicLayout({ children }) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };
  return (
    <div className="public-layout">
      <MagnusNavbar />
      <main>{children}</main>
      <MagnusFooter />
    </div>
  );
}

export default PublicLayout;
