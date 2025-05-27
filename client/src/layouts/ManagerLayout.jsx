import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function ManagerLayout({ children }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Check if user is authenticated and has manager role
  React.useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else if (currentUser.role !== "manager") {
      navigate(`/${currentUser.role}`);
    }
  }, [currentUser, navigate]);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!currentUser || currentUser.role !== "manager") {
    return null; // Or a loading spinner
  }

  return (
    <div className="manager-layout">
      {" "}
      <div className="sidebar bg-secondary text-white">
        <div className="logo p-4 text-center border-bottom">
          <img
            src="/src/assets/logo-white.svg"
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
        </div>        <nav className="nav flex-column p-2">
          <div className="nav-category py-2 text-uppercase text-white-50 small fw-bold ps-3">
            Chính
          </div>
          <a
            className="nav-link text-white d-flex align-items-center py-2"
            href="/manager"
          >
            <i className="bi bi-speedometer2 me-2"></i> Bảng điều khiển
          </a>

          <div className="nav-category py-2 text-uppercase text-white-50 small fw-bold ps-3">
            Báo cáo
          </div>
          <a
            className="nav-link text-white d-flex align-items-center py-2"
            href="/manager/reports/health-status"
          >
            <i className="bi bi-clipboard2-pulse me-2"></i> Tình trạng sức khỏe
          </a>
          <a
            className="nav-link text-white d-flex align-items-center py-2"
            href="/manager/reports/medications"
          >
            <i className="bi bi-capsule me-2"></i> Thuốc
          </a>
          <a
            className="nav-link text-white d-flex align-items-center py-2"
            href="/manager/reports/vaccinations"
          >
            <i className="bi bi-shield me-2"></i> Tiêm chủng
          </a>
          <a
            className="nav-link text-white d-flex align-items-center py-2"
            href="/manager/reports/incidents"
          >
            <i className="bi bi-exclamation-triangle me-2"></i> Sự cố
          </a>

          <div className="nav-category py-2 text-uppercase text-white-50 small fw-bold ps-3">
            Quản trị
          </div>
          <a
            className="nav-link text-white d-flex align-items-center py-2"
            href="/manager/staff"
          >
            <i className="bi bi-people me-2"></i> Quản lý nhân viên
          </a>
          <a
            className="nav-link text-white d-flex align-items-center py-2"
            href="/manager/resources"
          >
            <i className="bi bi-box-seam me-2"></i> Quản lý tài nguyên
          </a>
          <a
            className="nav-link text-white d-flex align-items-center py-2"
            href="/manager/settings"
          >
            <i className="bi bi-gear me-2"></i> Cài đặt
          </a>
        </nav>        <div className="mt-auto p-3 border-top">
          <button className="btn btn-light w-100" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i> Đăng xuất
          </button>
        </div>
      </div>
      <div className="main-content">        <header className="bg-white shadow-sm p-3">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="mb-0">Quản lý Sức khỏe Trường học</h2>
          </div>
          <div className="d-flex">
            <div className="btn-group me-2">
              <button className="btn btn-outline-secondary">
                <i className="bi bi-bell"></i>
                <span className="badge bg-danger ms-1">4</span>
              </button>
              <button className="btn btn-outline-secondary">
                <i className="bi bi-envelope"></i>
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

export default ManagerLayout;
