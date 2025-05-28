import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="bg-blue-50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Hệ Thống Chăm Sóc Y Tế Học Đường
              </h1>              <p className="text-xl text-gray-600 mb-8">
                School Medical cung cấp dịch vụ chăm sóc sức khỏe toàn diện
                để đảm bảo học sinh luôn khỏe mạnh và học tập hiệu quả. Đội ngũ y tế
                chuyên nghiệp của chúng tôi cam kết hỗ trợ sức khỏe con em bạn.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition duration-300"
                >
                  Đăng Nhập Hệ Thống
                </Link>
                <Link
                  to="/health-resources"
                  className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-medium py-3 px-6 rounded-md transition duration-300"
                >
                  Tài Liệu Sức Khỏe
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 lg:pl-10">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
                alt="Y tá trường học khám cho học sinh"
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Dịch Vụ Chăm Sóc Sức Khỏe
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi cung cấp đa dạng dịch vụ chăm sóc sức khỏe để đảm bảo
              sức khỏe con em bạn trong suốt năm học.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Hồ Sơ Sức Khỏe</h3>
              <p className="text-gray-600">
                Lưu trữ hồ sơ sức khỏe toàn diện bao gồm dị ứng,
                tình trạng y tế và lịch sử điều trị.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Quản Lý Thuốc Men
              </h3>
              <p className="text-gray-600">
                Gửi thuốc đến trường một cách an toàn với hướng dẫn đầy đủ
                để đội ngũ được đào tạo của chúng tôi thực hiện.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Ứng Phó Khẩn Cấp</h3>
              <p className="text-gray-600">
                Chăm sóc tức thì cho chấn thương, bệnh tật và các trường hợp khẩn cấp
                với ghi chép đầy đủ và thông báo phụ huynh.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Chương Trình Tiêm Chủng
              </h3>
              <p className="text-gray-600">
                Phối hợp chương trình tiêm chủng ở trường với sự đồng ý của phụ huynh
                và theo dõi đúng cách.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Khám Sức Khỏe</h3>
              <p className="text-gray-600">
                Kiểm tra định kỳ về thị lực, thính lực, tăng trưởng và các chỉ số
                sức khỏe quan trọng khác với báo cáo chi tiết.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Giáo Dục Sức Khỏe</h3>
              <p className="text-gray-600">
                Tài liệu và hội thảo về các chủ đề sức khỏe quan trọng dành cho
                học sinh, phụ huynh và cộng đồng trường học.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Health Resources Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tài Liệu Sức Khỏe Học Đường
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Khám phá thư viện tài liệu phong phú về sức khỏe học đường,
              hướng dẫn chăm sóc và các kiến thức y tế cần thiết.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Sổ Tay Y Tế</h3>
              <p className="text-gray-600 text-sm mb-4">
                Hướng dẫn cơ bản về chăm sóc sức khỏe học sinh tại trường.
              </p>
              <Link
                to="/health-handbook"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Xem chi tiết →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Quy Trình Y Tế</h3>
              <p className="text-gray-600 text-sm mb-4">
                Các quy trình xử lý tình huống y tế tại trường học.
              </p>
              <Link
                to="/medical-procedures"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Tìm hiểu thêm →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Biểu Mẫu Y Tế</h3>
              <p className="text-gray-600 text-sm mb-4">
                Tải xuống các biểu mẫu y tế cần thiết cho học sinh.
              </p>
              <Link
                to="/medical-forms"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Tải xuống →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-orange-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">FAQ Y Tế</h3>
              <p className="text-gray-600 text-sm mb-4">
                Câu hỏi thường gặp về dịch vụ y tế tại trường.
              </p>
              <Link
                to="/health-faq"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Xem FAQ →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Blog Chia Sẻ Kinh Nghiệm
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Khám phá những bài viết hữu ích từ đội ngũ y tế và cộng đồng phụ huynh
              về cách chăm sóc sức khỏe con em hiệu quả.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Dinh dưỡng học đường"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">15 Tháng 5, 2025</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Dinh Dưỡng Cân Bằng Cho Học Sinh
                </h3>
                <p className="text-gray-600 mb-4">
                  Hướng dẫn cách xây dựng chế độ ăn uống lành mạnh giúp con em
                  phát triển toàn diện cả về thể chất lẫn trí tuệ...
                </p>
                <Link
                  to="/blog/balanced-nutrition"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Đọc thêm →
                </Link>
              </div>
            </article>

            <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Phòng chống bệnh tật"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">12 Tháng 5, 2025</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Phòng Chống Bệnh Mùa Học
                </h3>
                <p className="text-gray-600 mb-4">
                  Những biện pháp phòng ngừa hiệu quả giúp bảo vệ sức khỏe
                  con em trong môi trường học đường đông người...
                </p>
                <Link
                  to="/blog/disease-prevention"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Đọc thêm →
                </Link>
              </div>
            </article>

            <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Sức khỏe tinh thần"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">8 Tháng 5, 2025</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Chăm Sóc Sức Khỏe Tinh Thần
                </h3>
                <p className="text-gray-600 mb-4">
                  Cách nhận biết và hỗ trợ con em vượt qua căng thẳng học tập,
                  xây dựng tinh thần tích cực trong cuộc sống...
                </p>
                <Link
                  to="/blog/mental-health"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Đọc thêm →
                </Link>
              </div>
            </article>
          </div>

          <div className="text-center mt-10">
            <Link
              to="/blog"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition duration-300"
            >
              Xem Tất Cả Bài Viết
            </Link>
          </div>        </div>
      </section>

      {/* Account Registration Notice */}
      <section className="py-12 bg-yellow-50 border-l-4 border-yellow-400">
        <div className="container mx-auto px-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Thông Báo Về Tài Khoản Hệ Thống
              </h3>
              <p className="text-yellow-700 mb-4">
                Để đảm bảo an toàn và bảo mật thông tin, việc tạo tài khoản truy cập hệ thống y tế
                được thực hiện bởi ban quản lý nhà trường. Phụ huynh và học sinh sẽ nhận được
                thông tin tài khoản qua các kênh chính thức của trường.
              </p>
              <div className="bg-white p-4 rounded-md border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">Cách nhận tài khoản:</h4>
                <ul className="text-yellow-700 space-y-1 text-sm">
                  <li>• Liên hệ văn phòng trường: <strong>(024) 1234-5678</strong></li>
                  <li>• Email: <strong>healthcare@lincoln.edu.vn</strong></li>
                  <li>• Hoặc gặp trực tiếp tại phòng y tế trường trong giờ hành chính</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* School Information Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Thông Tin Trường Học
            </h2>            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tìm hiểu thêm về School Medical và cam kết của chúng tôi
              đối với sức khỏe và giáo dục học sinh.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>              <img
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="School Medical Care System"
              className="rounded-lg shadow-xl w-full"
            />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                School Medical - Nơi Phát Triển Toàn Diện
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1 mr-4 flex-shrink-0">
                    <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Đội Ngũ Y Tế Chuyên Nghiệp</h4>
                    <p className="text-gray-600">Bác sĩ và y tá được đào tạo bài bản, có kinh nghiệm lâu năm trong chăm sóc sức khỏe học đường.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1 mr-4 flex-shrink-0">
                    <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Cơ Sở Vật Chất Hiện Đại</h4>
                    <p className="text-gray-600">Phòng y tế được trang bị đầy đủ thiết bị y tế hiện đại và không gian chăm sóc thoải mái.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1 mr-4 flex-shrink-0">
                    <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Hệ Thống Quản Lý Số Hóa</h4>
                    <p className="text-gray-600">Ứng dụng công nghệ tiên tiến trong quản lý hồ sơ sức khỏe và theo dõi tình trạng học sinh.</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Link
                  to="/about"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition duration-300"
                >
                  Tìm Hiểu Thêm Về Trường
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-blue-600 rounded-xl p-8 md:p-12 shadow-xl">            <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-2/3 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold text-white mb-4">
                Truy Cập Hệ Thống Y Tế Trường Học
              </h2>
              <p className="text-xl text-blue-100">
                Đăng nhập để truy cập hồ sơ sức khỏe, theo dõi tình trạng điều trị
                và cập nhật thông tin về các sự kiện y tế tại trường.
                Liên hệ ban quản lý để được cấp tài khoản.
              </p>
            </div>
            <div className="md:w-1/3 text-center">
              <Link
                to="/login"
                className="inline-block bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-8 rounded-md transition duration-300 text-lg"
              >
                Đăng Nhập
              </Link>
            </div>
          </div>          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
