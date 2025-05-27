import React from 'react';

function MagnusFooter() {
  return (
    <footer className="magnus-footer">
      <div className="container">
        <div className="magnus-footer__logo">
          <h2 style={{ color: 'white' }}>MAGNUS HEALTH</h2>
        </div>

        <div className="magnus-footer__links">          <div className="magnus-footer__column">
          <h4>Giải pháp</h4>
          <ul>
            <li><a href="#">Hồ sơ Sức khỏe Học sinh</a></li>
            <li><a href="#">Quản lý Thể thao</a></li>
            <li><a href="#">Sàng lọc COVID-19</a></li>
            <li><a href="#">Theo dõi Tiêm chủng</a></li>
            <li><a href="#">Magnus Mobile</a></li>
          </ul>
        </div>
          <div className="magnus-footer__column">
            <h4>Công ty</h4>
            <ul>
              <li><a href="#">Về chúng tôi</a></li>
              <li><a href="#">Ban lãnh đạo</a></li>
              <li><a href="#">Tuyển dụng</a></li>
              <li><a href="#">Tin tức & Báo chí</a></li>
              <li><a href="#">Đối tác</a></li>
            </ul>
          </div>
          <div className="magnus-footer__column">
            <h4>Tài nguyên</h4>
            <ul>
              <li><a href="#">Trung tâm Hỗ trợ</a></li>
              <li><a href="#">Video Đào tạo</a></li>
              <li><a href="#">Hội thảo Web</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Tài liệu</a></li>
            </ul>
          </div>

          <div className="magnus-footer__column">
            <h4>Pháp lý</h4>
            <ul>
              <li><a href="#">Chính sách Bảo mật</a></li>
              <li><a href="#">Điều khoản Dịch vụ</a></li>
              <li><a href="#">Tuân thủ HIPAA</a></li>
              <li><a href="#">Bảo mật</a></li>
              <li><a href="#">Khả năng Tiếp cận</a></li>
            </ul>
          </div>

          <div className="magnus-footer__column">
            <h4>Liên hệ</h4>
            <ul>
              <li><a href="#">sales@magnushealth.com</a></li>
              <li><a href="#">(800) 123-4567</a></li>
              <li><a href="#">Phiếu Hỗ trợ</a></li>
            </ul>
          </div>
        </div>

        <div className="magnus-footer__bottom">
          <p>&copy; {new Date().getFullYear()} Magnus Health. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default MagnusFooter; 