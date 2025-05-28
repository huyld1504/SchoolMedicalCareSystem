import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function NurseLayout({ children }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Check if user is authenticated and has nurse role
  React.useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else if (currentUser.role !== "nurse") {
      navigate(`/${currentUser.role}`);
    }
  }, [currentUser, navigate]);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!currentUser || currentUser.role !== "nurse") {
    return null; // Or a loading spinner
  }

  return (
    <div className="nurse-layout">
      {" "}
      <div className="sidebar bg-info text-white">
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
            />          </div>
          <div className="user-name">{currentUser.name}</div>
        </div>        
        
        
        <nav className="nav flex-column p-2">
          <div className="nav-category py-2 text-uppercase text-white-50 small fw-bold ps-3">
            Chính
          </div>
          <a
            className="nav-link text-white d-flex align-items-center py-2"
            href="/nurse"
          >
            <i className="bi bi-speedometer2 me-2"></i> Bảng điều khiển
          </a>          <div className="nav-category py-2 text-uppercase text-white-50 small fw-bold ps-3">
            Dịch vụ Y tế
          </div>          {/* Quick Actions in Medical Services Section */}
         
          <a href="/nurse/medications/admin" className="nav-link text-white d-flex align-items-center py-2">
            <i className="bi bi-clipboard2-pulse me-2"></i> Cấp thuốc
          </a>
          <a href="/nurse/health-checks" className="nav-link text-white d-flex align-items-center py-2">
            <i className="bi bi-heart-pulse me-2"></i> Khám sức khỏe
          </a>
          
      
        
                   
          <a
            className="nav-link text-white d-flex align-items-center py-2"
            href="/nurse/medical-events"
          >
            <i className="bi bi-journal-medical me-2"></i> Danh sách sự kiện
          </a>          
          <a
            className="nav-link text-white d-flex align-items-center py-2"
            href="/nurse/medications"
          >
            <i className="bi bi-capsule me-2"></i> Thuốc
          </a>
          <a
            className="nav-link text-white d-flex align-items-center py-2"
            href="/nurse/medications/admin"
          >
            <i className="bi bi-clipboard2-pulse me-2"></i> Cấp thuốc
          </a>
          <a
            className="nav-link text-white d-flex align-items-center py-2"
            href="/nurse/medications/inventory"
          >
            <i className="bi bi-box-seam me-2"></i> Kho thuốc
          </a>

          <div className="nav-category py-2 text-uppercase text-white-50 small fw-bold ps-3">
            Chăm sóc Phòng ngừa
          </div>
          {/* <a
            className="nav-link text-white d-flex align-items-center py-2"
            href="/nurse/vaccinations"
          >
            <i className="bi bi-shield-plus me-2"></i> Vaccination Programs
          </a> */}
          <a
            className="nav-link text-white d-flex align-items-center py-2"
            href="/nurse/health-checks"
          >
            <i className="bi bi-heart-pulse me-2"></i> Khám sức khỏe
          </a>

          <div className="nav-category py-2 text-uppercase text-white-50 small fw-bold ps-3">
            Hồ sơ
          </div>
          <a
            className="nav-link text-white d-flex align-items-center py-2"
            href="/nurse/students"
          >
            <i className="bi bi-people me-2"></i> Hồ sơ học sinh
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
            <h2 className="mb-0">Trung tâm Y tế Trường học</h2>
          </div>
          <div className="d-flex">
            <div className="btn-group me-2">
              <button className="btn btn-outline-secondary">
                <i className="bi bi-bell"></i>
                <span className="badge bg-danger ms-1">3</span>
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

export default NurseLayout;
