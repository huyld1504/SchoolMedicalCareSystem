// filepath: d:\VSCODE\SchoolMedicalCareSystem\client\src\pages\health\HealthRecordView.jsx
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function HealthRecordView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(1);

  // State for student basic information
  const [studentInfo, setStudentInfo] = useState({
    firstName: "",
    dateOfBirth: "",
    gender: "",
    grade: "",
    class: "",
    studentId: "",
    photo: null,
  });

  // State for multiple health records
  const [healthRecords, setHealthRecords] = useState([]);
  const [selectedRecordIndex, setSelectedRecordIndex] = useState(0);

  // Get the currently selected record
  const currentRecord = healthRecords[selectedRecordIndex] || {};
  // Fetch student health record data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Set student basic info
      setStudentInfo({
        firstName: "John Doe",
        dateOfBirth: "2010-05-15",
        gender: "male",
        grade: "10",
        class: "10A",
        studentId: "ST2024001",
      });

      // Set multiple health records
      setHealthRecords([{
        id: "rec1",
        recordDate: "2025-05-15",
        recordType: "Khám sức khỏe hàng năm",
        provider: "Bác sĩ Sarah Johnson",
        bloodType: "A+",
        height: "170",
        weight: "65",
        allergies: ["Đậu phộng", "Bụi"],
        chronicConditions: ["Hen suyễn"],
        visionLeft: "20/20",
        visionRight: "20/20",
        wearGlasses: true,
        hearingLeft: "bình thường",
        hearingRight: "bình thường",
        hearingAid: false,
        emergencyContacts: [
          {
            name: "Mary Doe",
            relationship: "mẹ",
            phone: "555-0123",
            email: "mary.doe@email.com",
          },
        ],
        consentEmergencyTreatment: true,
        consentMedicationAdmin: true,
        consentInformationSharing: true,
        notes: "Khám sức khỏe hàng năm thường kỳ. Học sinh có sức khỏe tốt nói chung.",
      },
      {
        id: "rec2",
        recordDate: "2024-11-10",
        recordType: "Tiêm chủng",
        provider: "Bác sĩ Michael Chen",
        bloodType: "A+",
        height: "168",
        weight: "63",
        allergies: ["Đậu phộng", "Bụi"],
        chronicConditions: ["Hen suyễn"],
        visionLeft: "20/20",
        visionRight: "20/20",
        wearGlasses: true,
        hearingLeft: "bình thường",
        hearingRight: "bình thường",
        hearingAid: false,
        emergencyContacts: [
          {
            name: "Mary Doe",
            relationship: "mẹ",
            phone: "555-0123",
            email: "mary.doe@email.com",
          },
        ],
        consentEmergencyTreatment: true,
        consentMedicationAdmin: true,
        consentInformationSharing: true, vaccinations: ["Vắc xin cúm", "Vắc xin Tdap"],
        notes: "Tất cả vắc xin đã được tiêm thành công, không có phản ứng phụ.",
      },
      {
        id: "rec3",
        recordDate: "2024-07-22",
        recordType: "Khám sức khỏe thể thao",
        provider: "Bác sĩ Lisa Patel",
        bloodType: "A+",
        height: "165",
        weight: "60",
        allergies: ["Đậu phộng", "Bụi"],
        chronicConditions: ["Hen suyễn"],
        visionLeft: "20/20",
        visionRight: "20/20",
        wearGlasses: true,
        hearingLeft: "bình thường",
        hearingRight: "bình thường",
        hearingAid: false,
        emergencyContacts: [
          {
            name: "Mary Doe",
            relationship: "mẹ",
            phone: "555-0123",
            email: "mary.doe@email.com",
          },
        ],
        consentEmergencyTreatment: true,
        consentMedicationAdmin: true,
        consentInformationSharing: true, sportsFitness: {
          cardioEndurance: "Tốt",
          strength: "Trung bình",
          flexibility: "Tốt",
        },
        notes: "Được phép tham gia tất cả hoạt động thể thao. Khuyến nghị sử dụng ống hít trước khi tập thể dục.",
      },
      ]);

      setLoading(false);
    }, 1000);
  }, [id]); const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Thông tin cá nhân
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Tên đầy đủ</p>
            <p className="mt-1">{studentInfo.firstName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Mã học sinh</p>
            <p className="mt-1">{studentInfo.studentId}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Lớp</p>
            <p className="mt-1">{studentInfo.class}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Ngày sinh</p>
            <p className="mt-1">{studentInfo.dateOfBirth}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Giới tính</p>
            <p className="mt-1 capitalize">{studentInfo.gender}</p>
          </div>
        </div>
      </div>
    </div>
  );
  const renderMedicalBackground = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Thông tin y tế
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Nhóm máu</p>
            <p className="mt-1">{currentRecord.bloodType}</p>
          </div>          <div>
            <p className="text-sm font-medium text-gray-500">Chiều cao</p>
            <p className="mt-1">{currentRecord.height} cm</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Cân nặng</p>
            <p className="mt-1">{currentRecord.weight} kg</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Dị ứng</h3>
        <div className="flex flex-wrap gap-2">
          {currentRecord.allergies?.length > 0 ? (
            currentRecord.allergies.map((allergy, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
              >
                {allergy}
              </span>
            ))
          ) : (
            <p className="text-gray-500">Không có dị ứng đã biết</p>
          )}
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Bệnh mạn tính
        </h3>
        <div className="flex flex-wrap gap-2">
          {currentRecord.chronicConditions?.length > 0 ? (
            currentRecord.chronicConditions.map((condition, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
              >
                {condition}
              </span>
            ))) : (
            <p className="text-gray-500">Không có bệnh mạn tính</p>
          )}
        </div>
      </div>

      {currentRecord.notes && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Ghi chú
          </h3>
          <p className="text-gray-700">{currentRecord.notes}</p>
        </div>
      )}
    </div>
  ); const renderVisionHearing = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Thông tin thị lực
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Thị lực (Mắt trái)</p>
            <p className="mt-1">{currentRecord.visionLeft}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Thị lực (Mắt phải)</p>
            <p className="mt-1">{currentRecord.visionRight}</p>
          </div>
        </div>
        <p className="mt-4">
          {currentRecord.wearGlasses
            ? "Đeo kính hoặc kính áp tròng"
            : "Không đeo kính hoặc kính áp tròng"}
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Thông tin thính giác
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Thính giác (Tai trái)</p>
            <p className="mt-1 capitalize">{currentRecord.hearingLeft?.replace("_", " ")}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Thính giác (Tai phải)</p>
            <p className="mt-1 capitalize">{currentRecord.hearingRight?.replace("_", " ")}</p>
          </div>
        </div>
        <p className="mt-4">
          {currentRecord.hearingAid ? "Sử dụng máy trợ thính" : "Không sử dụng máy trợ thính"}
        </p>
      </div>
    </div>
  ); const renderEmergencyContacts = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Liên hệ khẩn cấp
        </h3>
        {currentRecord.emergencyContacts?.map((contact, index) => (
          <div key={index} className="mb-6 last:mb-0">
            <h4 className="font-medium text-gray-900 mb-2">Liên hệ {index + 1}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Tên</p>
                <p className="mt-1">{contact.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Mối quan hệ</p>
                <p className="mt-1 capitalize">{contact.relationship}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Điện thoại</p>
                <p className="mt-1">{contact.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="mt-1">{contact.email}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  const renderConsents = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Trạng thái đồng ý</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <div
              className={`w-4 h-4 rounded mr-2 ${currentRecord.consentEmergencyTreatment ? "bg-green-500" : "bg-red-500"
                }`}
            ></div>            <span className="font-medium">Điều trị y tế khẩn cấp</span>
          </div>
          <div className="flex items-center">
            <div
              className={`w-4 h-4 rounded mr-2 ${currentRecord.consentMedicationAdmin ? "bg-green-500" : "bg-red-500"
                }`}
            ></div>
            <span className="font-medium">Quản lý thuốc</span>
          </div>
          <div className="flex items-center">
            <div
              className={`w-4 h-4 rounded mr-2 ${currentRecord.consentInformationSharing ? "bg-green-500" : "bg-red-500"
                }`}
            ></div>
            <span className="font-medium">Chia sẻ thông tin sức khỏe</span>
          </div>
        </div>
      </div>
    </div>
  ); const tabs = [
    { id: 1, name: "Thông tin cá nhân" },
    { id: 2, name: "Thông tin y tế" },
    { id: 3, name: "Thị lực & Thính giác" },
    { id: 4, name: "Liên hệ khẩn cấp" },
    { id: 5, name: "Đồng ý" },
  ];

  const handlePrint = () => {
    window.print();
  };
  // Render a comprehensive view of the health record
  const renderComprehensiveRecord = (record) => (
    <div className="space-y-6">
      {/* Medical Information */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Thông tin y tế
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Nhóm máu</p>
            <p className="mt-1">{record.bloodType}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Chiều cao</p>
            <p className="mt-1">{record.height} cm</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Cân nặng</p>
            <p className="mt-1">{record.weight} kg</p>
          </div>
        </div>
      </div>

      {/* Allergies */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Dị ứng</h3>
        <div className="flex flex-wrap gap-2">
          {record.allergies?.length > 0 ? (
            record.allergies.map((allergy, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
              >
                {allergy}
              </span>
            ))
          ) : (
            <p className="text-gray-500">Không có dị ứng đã biết</p>
          )}
        </div>
      </div>

      {/* Chronic Conditions */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Bệnh mạn tính
        </h3>
        <div className="flex flex-wrap gap-2">
          {record.chronicConditions?.length > 0 ? (
            record.chronicConditions.map((condition, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
              >
                {condition}
              </span>
            ))
          ) : (
            <p className="text-gray-500">Không có bệnh mạn tính</p>
          )}
        </div>
      </div>
      {/* Vision Information */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Thông tin thị lực
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Thị lực (Mắt trái)</p>
            <p className="mt-1">{record.visionLeft}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Thị lực (Mắt phải)</p>
            <p className="mt-1">{record.visionRight}</p>
          </div>
        </div>
        <p className="mt-4">
          {record.wearGlasses
            ? "Đeo kính hoặc kính áp tròng"
            : "Không đeo kính hoặc kính áp tròng"}
        </p>
      </div>

      {/* Hearing Information */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Thông tin thính giác
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Thính giác (Tai trái)</p>
            <p className="mt-1 capitalize">{record.hearingLeft?.replace("_", " ")}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Thính giác (Tai phải)</p>
            <p className="mt-1 capitalize">{record.hearingRight?.replace("_", " ")}</p>
          </div>
        </div>
        <p className="mt-4">
          {record.hearingAid ? "Sử dụng máy trợ thính" : "Không sử dụng máy trợ thính"}
        </p>
      </div>
      {/* Emergency Contacts */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Liên hệ khẩn cấp
        </h3>
        {record.emergencyContacts?.map((contact, index) => (
          <div key={index} className="mb-6 last:mb-0">
            <h4 className="font-medium text-gray-900 mb-2">Liên hệ {index + 1}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Tên</p>
                <p className="mt-1">{contact.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Mối quan hệ</p>
                <p className="mt-1 capitalize">{contact.relationship}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Điện thoại</p>
                <p className="mt-1">{contact.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="mt-1">{contact.email}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Consent Status */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Trạng thái đồng ý</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <div
              className={`w-4 h-4 rounded mr-2 ${record.consentEmergencyTreatment ? "bg-green-500" : "bg-red-500"
                }`}
            ></div>
            <span className="font-medium">Điều trị y tế khẩn cấp</span>
          </div>
          <div className="flex items-center">
            <div
              className={`w-4 h-4 rounded mr-2 ${record.consentMedicationAdmin ? "bg-green-500" : "bg-red-500"
                }`}
            ></div>
            <span className="font-medium">Quản lý thuốc</span>
          </div>
          <div className="flex items-center">
            <div
              className={`w-4 h-4 rounded mr-2 ${record.consentInformationSharing ? "bg-green-500" : "bg-red-500"
                }`}
            ></div>
            <span className="font-medium">Chia sẻ thông tin sức khỏe</span>
          </div>
        </div>
      </div>
      {/* Record Notes */}
      {record.notes && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Ghi chú
          </h3>
          <p className="text-gray-700">{record.notes}</p>
        </div>
      )}

      {/* Vaccinations (if available) */}
      {record.vaccinations && record.vaccinations.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Tiêm chủng
          </h3>
          <div className="flex flex-wrap gap-2">
            {record.vaccinations.map((vaccination, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {vaccination}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Sports Fitness (if available) */}
      {record.sportsFitness && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Đánh giá thể lực thể thao
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(record.sportsFitness).map(([key, value]) => (
              <div key={key}>
                <p className="text-sm font-medium text-gray-500">
                  {key === 'cardioEndurance' ? 'Sức bền tim mạch' :
                    key === 'strength' ? 'Sức mạnh' :
                      key === 'flexibility' ? 'Tính linh hoạt' :
                        key.charAt(0).toUpperCase() + key.slice(1)}
                </p>
                <p className="mt-1">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );  // Simple record selector to switch between records
  const renderRecordSelector = () => (
    <div className="mb-6">
      <div className="bg-white shadow rounded-lg">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Hồ sơ sức khỏe</h3>
          <div className="flex space-x-2">
            {healthRecords.map((record, index) => (
              <button
                key={record.id}
                onClick={() => setSelectedRecordIndex(index)}
                className={`px-4 py-2 rounded-md ${selectedRecordIndex === index
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
              >
                {new Date(record.recordDate).toLocaleDateString()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (<div className="max-w-4xl mx-auto py-8 px-4 print:p-0">
    <div className="flex justify-between items-center mb-6 print:mb-8">
      <h1 className="text-3xl font-bold">Hồ sơ sức khỏe</h1>
      <div className="space-x-4 print:hidden">
        {currentUser?.role === 'parent' && (
          <button
            onClick={() => navigate(`/parent/health-records/${id}/edit`)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Chỉnh sửa hồ sơ
          </button>
        )}
        {currentUser?.role === 'parent' && (
          <button
            onClick={() => navigate(`/parent/health-records/new?studentId=${id}`)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Thêm hồ sơ
            </span>
          </button>
        )}
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          <span className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            In hồ sơ
          </span>
        </button>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
        >
          Quay lại
        </button>
      </div>
    </div>

    {/* Student Info Card */}
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <div className="flex items-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 mr-4">
          {studentInfo.firstName.charAt(0)}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{studentInfo.firstName}</h2>
          <div className="flex text-sm text-gray-500 mt-1">
            <p className="mr-4">ID: {studentInfo.studentId}</p>
            <p className="mr-4">Class: {studentInfo.class}</p>
            <p>DOB: {new Date(studentInfo.dateOfBirth).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>

    {/* Record Selector */}
    {renderRecordSelector()}

    {/* Selected Record Details */}
    {currentRecord && (
      <div className="bg-white shadow rounded-lg mb-6">
        {/* Record Header */}
        <div className="bg-blue-50 p-4 border-b border-blue-100 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-blue-800">
              {currentRecord.recordType}
            </h3>              <p className="text-sm text-gray-600 mt-1">
              Ngày: {new Date(currentRecord.recordDate).toLocaleDateString()} | Nhà cung cấp: {currentRecord.provider}
            </p>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setSelectedRecordIndex(Math.max(0, selectedRecordIndex - 1))}
              disabled={selectedRecordIndex === 0}
              className={`p-2 rounded-full mr-2 ${selectedRecordIndex === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:bg-blue-100"
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={() => setSelectedRecordIndex(Math.min(healthRecords.length - 1, selectedRecordIndex + 1))}
              disabled={selectedRecordIndex === healthRecords.length - 1}
              className={`p-2 rounded-full ${selectedRecordIndex === healthRecords.length - 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:bg-blue-100"
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">            {/* Personal Information Card */}
          <div className="bg-gray-50 p-5 rounded-lg mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Thông tin cá nhân
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Tên đầy đủ</p>
                <p className="mt-1">{studentInfo.firstName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Mã học sinh</p>
                <p className="mt-1">{studentInfo.studentId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Lớp</p>
                <p className="mt-1">{studentInfo.class}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Ngày sinh</p>
                <p className="mt-1">{studentInfo.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Giới tính</p>
                <p className="mt-1 capitalize">{studentInfo.gender}</p>
              </div>
            </div>
          </div>

          {/* Display the comprehensive record view */}
          {renderComprehensiveRecord(currentRecord)}
        </div>
      </div>
    )}

    <style type="text/css" media="print">{`
        @page { size: auto; margin: 20mm; }
        body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        .print\\:hidden { display: none !important; }
        .print\\:shadow-none { box-shadow: none !important; }
        .print\\:p-0 { padding: 0 !important; }
        .print\\:mb-8 { margin-bottom: 2rem !important; }
      `}</style>
  </div>
  );
}

export default HealthRecordView;
