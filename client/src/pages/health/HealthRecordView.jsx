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
    setTimeout(() => {      // Set student basic info
      setStudentInfo({
        firstName: "Emma Johnson",
        dateOfBirth: "2015-01-20",
        gender: "male",
        grade: "5",
        class: "5A",
        studentId: "ST2024001",
      });      // Set multiple health records
      setHealthRecords([{
        id: "rec1",
        recordDate: "2025-05-15",
        recordType: "Khám sức khỏe hàng năm",
        provider: "Bác sĩ Nguyễn Thị Hương",
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
            name: "Nguyễn Thị Lan",
            relationship: "mẹ",
            phone: "555-0123",
            email: "lan.nguyen@email.com",
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
        provider: "Bác sĩ Trần Minh Đức",
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
            name: "Nguyễn Thị Lan",
            relationship: "mẹ",
            phone: "555-0123",
            email: "lan.nguyen@email.com",
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
            name: "Nguyễn Thị Lan",
            relationship: "mẹ",
            phone: "555-0123",
            email: "lan.nguyen@email.com",
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
      <div className="flex items-center justify-between border-b border-gray-200 py-3">
        <h3 className="text-lg font-medium text-gray-900">Hồ sơ sức khỏe</h3>
        <div className="flex space-x-2">
          {healthRecords.map((record, index) => (
            <button
              key={record.id}
              onClick={() => setSelectedRecordIndex(index)}
              className={`px-3 py-1 rounded-md text-sm ${
                selectedRecordIndex === index
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
  );
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  return (
    <div className="max-w-5xl mx-auto py-4 px-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Hồ sơ sức khỏe</h1>
        <div className="flex space-x-2">
          {currentUser?.role === 'parent' && (
            <>
              <button
                onClick={() => navigate(`/parent/health-records/${id}/edit`)}
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Chỉnh sửa
              </button>
              <button
                onClick={() => navigate(`/parent/health-records/new?studentId=${id}`)}
                className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Thêm mới
              </button>
            </>
          )}
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            In
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-1.5 text-gray-700 bg-gray-100 text-sm rounded hover:bg-gray-200"
          >
            Quay lại
          </button>
        </div>
      </div>    {/* Student Basic Info */}
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 mr-3">
          {studentInfo.firstName.charAt(0)}
        </div>
        <div>
          <h2 className="font-semibold text-gray-900">{studentInfo.firstName}</h2>
          <div className="flex text-sm text-gray-600 space-x-3">
            <span>ID: {studentInfo.studentId}</span>
            <span>•</span>
            <span>Lớp: {studentInfo.class}</span>
            <span>•</span>
            <span>NS: {new Date(studentInfo.dateOfBirth).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>

    {/* Record Selector */}
    {renderRecordSelector()}

    {/* Selected Record Details */}    {currentRecord && (
      <div className="bg-white rounded-lg mb-4">
        {/* Record Header */}
        <div className="bg-blue-50 p-3 border-b flex justify-between items-center">
          <div>
            <h3 className="text-base font-medium text-blue-800">
              {currentRecord.recordType}
            </h3>
            <p className="text-sm text-gray-600">
              Ngày: {new Date(currentRecord.recordDate).toLocaleDateString()} | Bác sĩ: {currentRecord.provider}
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setSelectedRecordIndex(Math.max(0, selectedRecordIndex - 1))}
              disabled={selectedRecordIndex === 0}
              className={`p-1.5 rounded ${
                selectedRecordIndex === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:bg-blue-100"
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={() => setSelectedRecordIndex(Math.min(healthRecords.length - 1, selectedRecordIndex + 1))}
              disabled={selectedRecordIndex === healthRecords.length - 1}
              className={`p-1.5 rounded ${
                selectedRecordIndex === healthRecords.length - 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:bg-blue-100"
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Chiều cao</p>
              <p className="text-lg font-medium">{currentRecord.height} cm</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Cân nặng</p>
              <p className="text-lg font-medium">{currentRecord.weight} kg</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Nhóm máu</p>
              <p className="text-lg font-medium">{currentRecord.bloodType}</p>
            </div>
          </div>          {/* Medical Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Allergies */}
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="text-sm font-medium mb-2">Dị ứng</h4>
                <div className="flex flex-wrap gap-1">
                  {currentRecord.allergies?.length > 0 ? (
                    currentRecord.allergies.map((allergy, index) => (
                      <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                        {allergy}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">Không có dị ứng</span>
                  )}
                </div>
              </div>

              {/* Vision */}
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="text-sm font-medium mb-2">Thị lực</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Mắt trái</p>
                    <p className="text-sm">{currentRecord.visionLeft}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Mắt phải</p>
                    <p className="text-sm">{currentRecord.visionRight}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {currentRecord.wearGlasses ? "Không đeo kính" : "Có đeo kính"}
                </p>
              </div>

              {/* Vaccinations */}
              {currentRecord.vaccinations && (
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="text-sm font-medium mb-2">Tiêm chủng</h4>
                  <div className="flex flex-wrap gap-1">
                    {currentRecord.vaccinations.map((vac, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {vac}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Chronic Conditions */}
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="text-sm font-medium mb-2">Bệnh mạn tính</h4>
                <div className="flex flex-wrap gap-1">
                  {currentRecord.chronicConditions?.length > 0 ? (
                    currentRecord.chronicConditions.map((condition, index) => (
                      <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        {condition}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">Không có bệnh mạn tính</span>
                  )}
                </div>
              </div>

              {/* Hearing */}
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="text-sm font-medium mb-2">Thính lực</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Tai trái</p>
                    <p className="text-sm">{currentRecord.hearingLeft}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Tai phải</p>
                    <p className="text-sm">{currentRecord.hearingRight}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {currentRecord.hearingAid ? "Có dùng thiết bị trợ thính" : "Không dùng thiết bị trợ thính"}
                </p>
              </div>

              {/* Sports Fitness */}
              {currentRecord.sportsFitness && (
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="text-sm font-medium mb-2">Đánh giá thể lực</h4>
                  <div className="grid gap-2">
                    {Object.entries(currentRecord.sportsFitness).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-xs text-gray-500">
                          {key === 'cardioEndurance' ? 'Sức bền' :
                           key === 'strength' ? 'Sức mạnh' : 'Linh hoạt'}
                        </span>
                        <span className="text-sm">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>          {/* Notes */}
          {currentRecord.notes && (
            <div className="mt-4 bg-gray-50 p-3 rounded">
              <h4 className="text-sm font-medium mb-2">Ghi chú</h4>
              <p className="text-sm text-gray-700">{currentRecord.notes}</p>
            </div>
          )}

          {/* Emergency Contacts */}
          <div className="mt-4 bg-gray-50 p-3 rounded">
            <h4 className="text-sm font-medium mb-3">Liên hệ phụ huynh</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentRecord.emergencyContacts?.map((contact, index) => (
                <div key={index} className="bg-white p-3 rounded border border-gray-200">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{contact.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{contact.relationship}</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-xs flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {contact.phone}
                        </p>
                        <p className="text-xs flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {contact.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
  );
}

export default HealthRecordView;
