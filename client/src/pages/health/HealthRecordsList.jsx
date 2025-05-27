import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function HealthRecordsList() {
  const navigate = useNavigate();
  // Dữ liệu mẫu cho danh sách hồ sơ sức khỏe
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Emma Johnson",
      grade: "Lớp 5",
      age: 10,
      healthStatus: "Hoàn thành",
      lastUpdated: "2025-05-20",
      alerts: 0,
      records: [
        {
          id: 101,
          type: "Khám sức khỏe toàn diện hàng năm",
          date: "2025-05-20",
          status: "Hoàn thành",
          summary: "Đánh giá sức khỏe toàn diện - Kết quả tốt, phát triển bình thường",
          provider: "Bác sĩ James Wilson",
          details: {
            height: "142 cm",
            weight: "35 kg",
            bmi: "17.3",
            bloodPressure: "110/70",
            generalHealth: "Tốt",
            vaccinations: "Đã cập nhật",
            nutrition: "Cân bằng"
          }
        },
        {
          id: 102,
          type: "Khám sức khỏe học đường",
          date: "2024-10-15",
          status: "Hoàn thành",
          summary: "Kiểm tra sức khỏe học kỳ đầu - Tình trạng tốt",
          provider: "Y tá trường Barbara Thompson",
          details: {
            height: "140 cm",
            weight: "34 kg",
            vision: "20/20",
            hearing: "Bình thường",
            recommendations: "Tiếp tục kế hoạch dinh dưỡng hiện tại"
          }
        },
        {
          id: 103,
          type: "Khám răng miệng",
          date: "2024-03-10",
          status: "Hoàn thành",
          summary: "Khám răng miệng hàng năm - Không có sâu răng",
          provider: "Bác sĩ Sarah Chen, Nha sĩ",
          details: {
            teethCondition: "Tuyệt vời",
            oralHygiene: "Tốt",
            treatment: "Làm sạch răng định kỳ",
            nextVisit: "Tháng 3 năm 2026"
          }
        }
      ]
    },
    {
      id: 2,
      name: "Thomas Johnson",
      grade: "Lớp 8",
      age: 13,
      healthStatus: "Chưa hoàn thành",
      lastUpdated: "2025-05-03",
      alerts: 2,
      records: [
        {
          id: 201,
          type: "Khám sức khỏe thể thao",
          date: "2025-05-03",
          status: "Chưa hoàn thành",
          summary: "Đánh giá toàn diện cho hoạt động thể thao",
          provider: "Bác sĩ Michael Anderson, Y học thể thao",
          details: {
            height: "165 cm",
            weight: "55 kg",
            bloodPressure: "115/75",
            heartRate: "72 nhịp/phút",
            cardioHealth: "Tốt",
            muscularStrength: "Trung bình",
            flexibility: "Cần cải thiện",
            notes: "Khuyến nghị thêm bài tập kéo giãn để cải thiện độ dẻo dai",
            pendingTests: "Thử nghiệm căng thẳng tim"
          }
        },
        {
          id: 202,
          type: "Đánh giá dị ứng",
          date: "2024-11-15",
          status: "Hoàn thành",
          summary: "Đánh giá và kế hoạch điều trị dị ứng theo mùa",
          provider: "Bác sĩ Lisa Wong, Chuyên khoa dị ứng",
          details: {
            allergens: "Phấn hoa, ve bụi",
            symptoms: "Hắt hơi, mắt ngứa, nghẹt mũi",
            severity: "Vừa phải",
            treatment: "Thuốc kháng histamine hàng ngày vào mùa xuân và thu",
            followUp: "Lên lịch khám nếu triệu chứng trầm trọng hơn"
          }
        },
        {
          id: 203,
          type: "Sàng lọc thị lực",
          date: "2024-06-22",
          status: "Hoàn thành",
          summary: "Kiểm tra thị lực hàng năm - Phát hiện loạn thị nhẹ",
          provider: "Bác sĩ Robert Miller, Nhãn khoa",
          details: {
            visionRight: "20/30",
            visionLeft: "20/25",
            colorPerception: "Bình thường",
            prescription: "Kính chỉnh nhẹ cho loạn thị",
            recommendations: "Đeo kính khi đọc và nhìn màn hình"
          }
        }
      ]
    },
    {
      id: 3,
      name: "Olivia Smith",
      grade: "Lớp 3",
      age: 8,
      healthStatus: "Hoàn thành",
      lastUpdated: "2025-05-10",
      alerts: 1,
      records: [
        {
          id: 301,
          type: "Khám sức khỏe hàng năm",
          date: "2025-05-10",
          status: "Hoàn thành",
          summary: "Đánh giá sức khỏe toàn diện - Cần theo dõi tình trạng dị ứng",
          provider: "Bác sĩ James Wilson",
          details: {
            height: "128 cm",
            weight: "27 kg",
            bmi: "16.5",
            bloodPressure: "100/65",
            generalHealth: "Tốt",
            allergies: "Dị ứng bụi và phấn hoa",
            immunization: "Hoàn thành",
            notes: "Giữ môi trường sống sạch sẽ, giảm thiểu tiếp xúc với chất gây dị ứng"
          }
        },
        {
          id: 302,
          type: "Đánh giá dị ứng",
          date: "2025-03-01",
          status: "Hoàn thành",
          summary: "Đánh giá và quản lý dị ứng theo mùa",
          provider: "Bác sĩ Emily Chen, Chuyên khoa dị ứng",
          details: {
            allergens: "Bụi nhà, phấn hoa, lông thú cưng",
            severity: "Nhẹ đến vừa phải",
            symptoms: "Hắt hơi, sổ mũi, mắt ngứa",
            treatment: "Thuốc kháng histamine, tránh tiếp xúc với chất gây dị ứng",
            progress: "Tình trạng cải thiện so với lần khám trước"
          }
        },
        {
          id: 303,
          type: "Tư vấn dinh dưỡng",
          date: "2024-09-15",
          status: "Hoàn thành",
          summary: "Đánh giá chế độ ăn uống và khuyến nghị",
          provider: "Chị Jennifer Lopez, Chuyên viên dinh dưỡng",
          details: {
            currentDiet: "Hơi kén ăn, tránh rau xanh",
            nutritionalStatus: "Đủ nhưng cần cải thiện",
            recommendations: "Tăng lượng rau xanh, đảm bảo đủ protein",
            vitamins: "Khuyến nghị vitamin tổng hợp hàng ngày",
            followUp: "3 tháng"
          }
        }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  // Lọc học sinh dựa trên từ khóa tìm kiếm và trạng thái
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "complete" && student.healthStatus === "Hoàn thành") ||
      (filterStatus === "incomplete" &&
        student.healthStatus === "Chưa hoàn thành") ||
      (filterStatus === "alerts" && student.alerts > 0);

    return matchesSearch && matchesStatus;
  });

  // Điều hướng đến trang chi tiết hồ sơ sức khỏe học sinh
  const navigateToStudentRecord = (studentId) => {
    navigate(`/parent/health-records/${studentId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">        <div>
        <h1 className="text-3xl font-bold mb-2">Hồ sơ sức khỏe</h1>
        <p className="text-gray-600">
          Quản lý thông tin sức khỏe của con em bạn
        </p>
      </div>
        <Link
          to="/parent/health-records/new"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out"
        >
          Thêm hồ sơ mới
        </Link>
      </div>      {/* Bộ lọc và tìm kiếm */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <label htmlFor="search" className="sr-only">
              Tìm kiếm
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                id="search"
                name="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tìm kiếm theo tên học sinh"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="status" className="sr-only">
              Lọc theo trạng thái
            </label>
            <select
              id="status"
              name="status"
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tất cả hồ sơ</option>
              <option value="complete">Hoàn thành</option>
              <option value="incomplete">Chưa hoàn thành</option>
              <option value="alerts">Có cảnh báo</option>
            </select>
          </div>
        </div>
      </div>      {/* Danh sách hồ sơ - Thiết kế dạng thẻ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.length > 0 ? (
          <>
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                onClick={() => navigateToStudentRecord(student.id)}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <span className="text-blue-600 font-medium text-lg">
                        {student.name.charAt(0)}
                      </span>
                    </div>                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-500">{student.grade} · {student.age} tuổi</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-600 mr-2">Trạng thái:</span>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${student.healthStatus === "Hoàn thành"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        {student.healthStatus}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Cập nhật: {new Date(student.lastUpdated).toLocaleDateString('vi-VN')}
                    </div>
                  </div>

                  {student.alerts > 0 && (
                    <div className="mt-3 bg-red-50 rounded-md p-2 flex items-center">
                      <svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>                      <span className="text-sm text-red-600 font-medium">
                        {student.alerts} cảnh báo cần chú ý
                      </span>
                    </div>
                  )}
                  <div className="mt-4 border-t pt-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Hồ sơ mới nhất:</span> {student.records[0].type}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {student.records[0].summary}
                    </p>
                  </div>

                  <div className="mt-4 text-right">
                    <span className="inline-flex items-center text-blue-600 text-sm font-medium">
                      Xem tất cả hồ sơ
                      <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="col-span-full text-center py-10 bg-white rounded-lg shadow">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Không tìm thấy hồ sơ sức khỏe
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterStatus !== "all"
                ? "Thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc của bạn."
                : "Bắt đầu bằng cách tạo hồ sơ sức khỏe mới."}
            </p>
            <div className="mt-6">
              <Link
                to="/parent/health-records/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Thêm hồ sơ mới
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Help Info */}
      <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Hồ sơ sức khỏe đầy đủ giúp y tá trường có thể chăm sóc phù hợp
              cho con em bạn. Vui lòng cập nhật thông tin này thường xuyên.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HealthRecordsList;
