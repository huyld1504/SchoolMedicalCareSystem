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
      <div className="container pt-4">
        <button className="btn btn-outline-secondary mb-3" onClick={handleBack}>
          <i className="bi bi-arrow-left"></i> Back
        </button>
      </div>
      <main>{children}</main>
      <MagnusFooter />
    </div>
  );
}

export default PublicLayout;
