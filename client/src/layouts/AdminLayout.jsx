import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function AdminLayout({ children }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Check if user is authenticated and has admin role
  React.useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else if (currentUser.role !== "admin") {
      navigate(`/${currentUser.role}`);
    }
  }, [currentUser, navigate]);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!currentUser || currentUser.role !== "admin") {
    return null; // Or a loading spinner
  }

  return (
    <div className="admin-layout">
      {" "}
      <div className="sidebar bg-primary text-white">
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
        </div>
        <nav className="nav flex-column p-2">
          <div className="nav-category py-2 text-uppercase text-white-50 small fw-bold ps-3">
            Chính
          </div>
          <a
            className="nav-link text-white d-flex align-items-center py-2"
            href="/admin"
          >
            <i className="bi bi-speedometer2 me-2"></i> Bảng điều khiển
          </a>          <div className="nav-category py-2 text-uppercase text-white-50 small fw-bold ps-3">
            Quản trị
          </div>
          <a
            className="nav-link text-white d-flex align-items-center py-2"
            href="/admin/users"
          >
            <i className="bi bi-people me-2"></i> Quản lý người dùng
          </a>

          <a
            className="nav-link text-white d-flex align-items-center py-2"
            href="/admin/pending-approvals"
          >
            <i className="bi bi-check-circle me-2"></i> Phê duyệt đang chờ
          </a>          
          {/* <a
            className="nav-link text-white d-flex align-items-center py-2"
            href="/admin/activities"
          >
            <i className="bi bi-activity me-2"></i> Hoạt động hệ thống
          </a> */}

          <a
            className="nav-link text-white d-flex align-items-center py-2"
            href="/admin/vaccination-scheduler"
          >
            <i className="bi bi-calendar-check me-2"></i> Lịch tiêm chủng
          </a>

          {/* <a
            className="nav-link text-white d-flex align-items-center py-2"
            href="/admin/settings"
          >
            <i className="bi bi-gear me-2"></i> Cài đặt hệ thống
          </a> */}

          <div className="nav-category py-2 text-uppercase text-white-50 small fw-bold ps-3">
            Phân tích
          </div>          <a
            className="nav-link text-white d-flex align-items-center py-2"
            href="/admin/reports"
          >            <i className="bi bi-file-earmark-bar-graph me-2"></i> Tổng quan
            Báo cáo
          </a>
          <a
            className="nav-link text-white d-flex align-items-center py-2"
            href="/admin/reports/health"
          >
            <i className="bi bi-heart-pulse me-2"></i> Báo cáo sức khỏe
          </a>
          <a
            className="nav-link text-white d-flex align-items-center py-2"
            href="/admin/reports/medication"
          >
            <i className="bi bi-capsule me-2"></i> Báo cáo thuốc
          </a>          <a
            className="nav-link text-white d-flex align-items-center py-2"
            href="/admin/reports/vaccination"
          >
            <i className="bi bi-shield me-2"></i> Báo cáo tiêm chủng
          </a>
          <a
            className="nav-link text-white d-flex align-items-center py-2"
            href="/admin/reports/incidents"
          >
            <i className="bi bi-exclamation-triangle me-2"></i> Báo cáo sự cố
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
            <h2 className="mb-0">Bảng điều khiển Quản trị</h2>
          </div>
          <div className="d-flex">
            <div className="btn-group me-2">
              <button className="btn btn-outline-secondary">
                <i className="bi bi-bell"></i>
                <span className="badge bg-danger ms-1">5</span>
              </button>
              <button className="btn btn-outline-secondary">
                <i className="bi bi-gear"></i>
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

export default AdminLayout;
