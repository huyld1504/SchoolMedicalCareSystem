import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function StudentLayout({ children }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Check if user is authenticated and has student role
  React.useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else if (currentUser.role !== "student") {
      navigate(`/${currentUser.role}`);
    }
  }, [currentUser, navigate]);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!currentUser || currentUser.role !== "student") {
    return null; // Or a loading spinner
  }

  return (
    <div className="student-layout">
      {" "}
      <div className="sidebar bg-warning">
        <div className="logo p-4 text-center border-bottom">
          <img
            src="/src/assets/logo.svg"
            alt="School Medical System"
            className="img-fluid mb-3"
            style={{ maxHeight: "60px" }}
          />
          <div className="user-avatar mt-2 mb-2">
            <img
              src="https://via.placeholder.com/50"
              alt="User"
              className="rounded-circle"
            />
          </div>
          <div className="user-name">{currentUser.name}</div>
        </div>
        <nav className="nav flex-column p-2">
          <div className="nav-category py-2 text-uppercase text-secondary small fw-bold ps-3">
            Main
          </div>
          <a
            className="nav-link d-flex align-items-center py-2"
            href="/student"
          >
            <i className="bi bi-speedometer2 me-2"></i> Dashboard
          </a>

          <div className="nav-category py-2 text-uppercase text-secondary small fw-bold ps-3">
            My Health
          </div>
          <a
            className="nav-link d-flex align-items-center py-2"
            href="/student/health-records"
          >
            <i className="bi bi-journal-medical me-2"></i> My Health Records
          </a>
          <a
            className="nav-link d-flex align-items-center py-2"
            href="/student/medications"
          >
            <i className="bi bi-capsule me-2"></i> My Medications
          </a>
          <a
            className="nav-link d-flex align-items-center py-2"
            href="/student/vaccinations"
          >
            <i className="bi bi-shield-plus me-2"></i> My Vaccinations
          </a>
          <a
            className="nav-link d-flex align-items-center py-2"
            href="/student/health-checks"
          >
            <i className="bi bi-heart-pulse me-2"></i> Health Checkups
          </a>

          <div className="nav-category py-2 text-uppercase text-secondary small fw-bold ps-3">
            Account
          </div>
          <a
            className="nav-link d-flex align-items-center py-2"
            href="/student/profile"
          >
            <i className="bi bi-person me-2"></i> My Profile
          </a>
        </nav>
        <div className="mt-auto p-3 border-top">
          <button className="btn btn-outline-dark w-100" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </button>
        </div>
      </div>
      <div className="main-content">
        <header className="bg-white shadow-sm p-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-0">Student Health Portal</h2>
            </div>
            <div className="d-flex">
              <div className="btn-group me-2">
                <button className="btn btn-outline-secondary">
                  <i className="bi bi-bell"></i>
                  <span className="badge bg-danger ms-1">1</span>
                </button>
                <button className="btn btn-outline-secondary">
                  <i className="bi bi-chat-text"></i>
                </button>
              </div>
            </div>
          </div>
        </header>
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}

export default StudentLayout;
