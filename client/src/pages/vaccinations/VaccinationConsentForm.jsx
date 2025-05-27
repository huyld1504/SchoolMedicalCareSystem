import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";

function VaccinationConsentForm() {
  const { id } = useParams();
  // Demo campaign data
  const campaign = {
    id: parseInt(id),
    name: "Tiêm chủng cúm hàng năm",
    description: "Tiêm chủng cúm hàng năm cho tất cả học sinh và nhân viên",
    vaccine: "Vaccine cúm (theo mùa)",
    vaccineDetails: {
      manufacturer: "Influenza Biologics Inc.",
      formulation: "Quadrivalent",
      lotNumber: "FL2023-456",
      dosage: "0.5ml",
      administrationRoute: "Tiêm bắp",
    },
    consentDeadline: "2023-08-25",
  };

  // Demo students data
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Emma Johnson",
      grade: "5th Grade",
      age: 10,
      hasConsent: null,
      medicalHistory: {
        allergies: [],
        previousReactions: false,
        currentMedications: [],
        medicalConditions: [],
      },
    },
    {
      id: 2,
      name: "Thomas Johnson",
      grade: "8th Grade",
      age: 13,
      hasConsent: null,
      medicalHistory: {
        allergies: ["Penicillin"],
        previousReactions: false,
        currentMedications: ["Albuterol (as needed)"],
        medicalConditions: ["Mild asthma"],
      },
    },
  ]);

  const [activeStudent, setActiveStudent] = useState(students[0]);
  const [consentForm, setConsentForm] = useState({
    id: students[0].id,
    consent: null,
    allergies: students[0].medicalHistory.allergies.join(", "),
    previousReactions: students[0].medicalHistory.previousReactions,
    hadVaccineBefore: false,
    recentIllness: false,
    recentIllnessDescription: "",
    currentMedications:
      students[0].medicalHistory.currentMedications.join(", "),
    medicalConditions: students[0].medicalHistory.medicalConditions.join(", "),
    additionalNotes: "",
    parentName: "",
    relationshipToStudent: "",
    phoneNumber: "",
    email: "",
    agreeToTerms: false,
  });

  // Form change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConsentForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Student change handler
  const handleStudentChange = (student) => {
    setActiveStudent(student);
    setConsentForm({
      id: student.id,
      consent: student.hasConsent,
      allergies: student.medicalHistory.allergies.join(", "),
      previousReactions: student.medicalHistory.previousReactions,
      hadVaccineBefore: false,
      recentIllness: false,
      recentIllnessDescription: "",
      currentMedications: student.medicalHistory.currentMedications.join(", "),
      medicalConditions: student.medicalHistory.medicalConditions.join(", "),
      additionalNotes: "",
      parentName: "",
      relationshipToStudent: "",
      phoneNumber: "",
      email: "",
      agreeToTerms: false,
    });
  };

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault(); if (consentForm.consent === null) {
      alert("Vui lòng cho biết bạn đồng ý hay từ chối việc tiêm chủng");
      return;
    }

    if (consentForm.consent && !consentForm.agreeToTerms) {
      alert("Vui lòng đồng ý với các điều khoản để cung cấp sự đồng ý");
      return;
    }

    // Update the student's consent status
    const updatedStudents = students.map((student) => {
      if (student.id === activeStudent.id) {
        return {
          ...student,
          hasConsent: consentForm.consent,
        };
      }
      return student;
    });

    setStudents(updatedStudents); alert(
      `Đơn đồng ý ${consentForm.consent ? "đã được chấp thuận" : "đã bị từ chối"} cho ${activeStudent.name
      }`
    );

    // In a real app, this would send the data to a backend
  };

  // Check if deadline has passed
  const isDeadlinePassed = () => {
    const deadline = new Date(campaign.consentDeadline);
    const today = new Date();
    return today > deadline;
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/parent/vaccinations"
          className="text-blue-600 hover:text-blue-800 inline-flex items-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>          Quay lại Chiến dịch
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Đơn đồng ý tiêm chủng</h1>
        <p className="text-gray-600">{campaign.name}</p>
      </div>

      {/* Campaign Information */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8 border border-blue-100">
        <h2 className="text-xl font-bold mb-2">Thông tin chiến dịch</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Tiêm chủng</p>
            <p className="font-medium">{campaign.vaccine}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">
              Hạn chót đồng ý
            </p>
            <p className="font-medium">
              {formatDate(campaign.consentDeadline)}
              {isDeadlinePassed() && (
                <span className="text-red-600 ml-2">(Đã quá hạn)</span>
              )}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-500">Description</p>
          <p>{campaign.description}</p>
        </div>
      </div>      {/* Student Selection */}
      {students.length > 1 && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">Chọn học sinh</h2>
          <div className="flex flex-wrap gap-4">
            {students.map((student) => (
              <button
                key={student.id}
                className={`px-4 py-2 rounded-full ${activeStudent.id === student.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  }`}
                onClick={() => handleStudentChange(student)}
              >
                {student.name}
                {student.hasConsent !== null && (
                  <span
                    className={`ml-2 inline-block w-3 h-3 rounded-full ${student.hasConsent ? "bg-green-500" : "bg-red-500"
                      }`}
                  ></span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Consent Form */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isDeadlinePassed() ? (
          <div className="p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>            <h3 className="mt-2 text-lg font-medium text-gray-900">
              Hạn chót đồng ý đã qua
            </h3>
            <p className="mt-1 text-gray-500">
              Hạn chót nộp đơn đồng ý là{" "}
              {formatDate(campaign.consentDeadline)}. Vui lòng liên hệ với
              y tá trường học nếu bạn vẫn muốn đưa ra sự đồng ý.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{activeStudent.name}</h2>                  <p className="text-sm text-gray-600">
                    {activeStudent.grade} | {activeStudent.age} tuổi
                  </p>
                </div>
                {activeStudent.hasConsent !== null && (
                  <div
                    className={`px-4 py-1 rounded-full text-sm font-medium ${activeStudent.hasConsent
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                      }`}
                  >
                    {activeStudent.hasConsent
                      ? "Đã đồng ý"
                      : "Đã từ chối"}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">              {/* Vaccine Information */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4 border-b pb-2">
                  Thông tin vaccine
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Nhà sản xuất
                    </p>
                    <p>{campaign.vaccineDetails.manufacturer}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Thành phần
                    </p>
                    <p>{campaign.vaccineDetails.formulation}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Số lô
                    </p>
                    <p>{campaign.vaccineDetails.lotNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Liều lượng</p>
                    <p>{campaign.vaccineDetails.dosage}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">
                      Cách tiêm
                    </p>
                    <p>{campaign.vaccineDetails.administrationRoute}</p>
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4 border-b pb-2">
                  Tiền sử bệnh
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Học sinh có dị ứng gì đã biết không?
                  </label>
                  <textarea
                    name="allergies"
                    rows="2"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Liệt kê các dị ứng hoặc viết 'Không'"
                    value={consentForm.allergies}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="mb-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="previousReactions"
                        name="previousReactions"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        checked={consentForm.previousReactions}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="previousReactions"
                        className="font-medium text-gray-700"
                      >
                        Học sinh đã từng có phản ứng phụ với bất kỳ
                        vaccine nào trước đây không?
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="hadVaccineBefore"
                        name="hadVaccineBefore"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        checked={consentForm.hadVaccineBefore}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="hadVaccineBefore"
                        className="font-medium text-gray-700"
                      >
                        Học sinh đã được tiêm vaccine này trước đây chưa?
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-start mb-1">
                    <div className="flex items-center h-5">
                      <input
                        id="recentIllness"
                        name="recentIllness"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        checked={consentForm.recentIllness}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="ml-3 text-sm">                      <label
                      htmlFor="recentIllness"
                      className="font-medium text-gray-700"
                    >
                      Học sinh có bị ốm trong 14 ngày qua không?
                    </label>
                    </div>
                  </div>

                  {consentForm.recentIllness && (
                    <textarea
                      name="recentIllnessDescription"
                      rows="2"
                      className="mt-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Vui lòng mô tả tình trạng bệnh gần đây"
                      value={consentForm.recentIllnessDescription}
                      onChange={handleChange}
                    ></textarea>
                  )}
                </div>                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thuốc đang sử dụng
                  </label>
                  <textarea
                    name="currentMedications"
                    rows="2"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Liệt kê các loại thuốc học sinh đang dùng hoặc viết 'Không'"
                    value={consentForm.currentMedications}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tình trạng sức khỏe
                  </label>
                  <textarea
                    name="medicalConditions"
                    rows="2"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Liệt kê các tình trạng sức khỏe liên quan hoặc viết 'Không'"
                    value={consentForm.medicalConditions}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú hoặc mối quan tâm bổ sung
                  </label>
                  <textarea
                    name="additionalNotes"
                    rows="3"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Bất kỳ thông tin bổ sung nào mà y tá trường học nên biết"
                    value={consentForm.additionalNotes}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>              {/* Consent Decision */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4 border-b pb-2">
                  Quyết định đồng ý
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="consent-yes"
                      name="consent"
                      type="radio"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      checked={consentForm.consent === true}
                      onChange={() =>
                        setConsentForm((prev) => ({ ...prev, consent: true }))
                      }
                    />
                    <label
                      htmlFor="consent-yes"
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      TÔI ĐỒNG Ý cho con tôi được tiêm vaccine này
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="consent-no"
                      name="consent"
                      type="radio"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      checked={consentForm.consent === false}
                      onChange={() =>
                        setConsentForm((prev) => ({ ...prev, consent: false }))
                      }
                    />
                    <label
                      htmlFor="consent-no"
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      TÔI KHÔNG ĐỒNG Ý cho con tôi được tiêm vaccine này
                    </label>
                  </div>
                </div>
              </div>              {/* Parent/Guardian Information */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4 border-b pb-2">
                  Thông tin phụ huynh/người giám hộ
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="parentName"
                    >
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="parentName"
                      id="parentName"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Họ và tên phụ huynh/người giám hộ"
                      value={consentForm.parentName}
                      onChange={handleChange}
                      required={consentForm.consent}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="relationshipToStudent"
                    >
                      Mối quan hệ với học sinh{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="relationshipToStudent"
                      id="relationshipToStudent"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="vd: Bố/Mẹ, Người giám hộ"
                      value={consentForm.relationshipToStudent}
                      onChange={handleChange}
                      required={consentForm.consent}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="phoneNumber"
                    >
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      id="phoneNumber"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Số điện thoại liên hệ"
                      value={consentForm.phoneNumber}
                      onChange={handleChange}
                      required={consentForm.consent}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="email"
                    >
                      Địa chỉ email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Địa chỉ email"
                      value={consentForm.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Agreement */}
              {consentForm.consent && (
                <div className="mb-8 p-4 bg-gray-50 rounded-md">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="agreeToTerms"
                        name="agreeToTerms"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        checked={consentForm.agreeToTerms}
                        onChange={handleChange}
                        required={consentForm.consent}
                      />
                    </div>                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="agreeToTerms"
                        className="font-medium text-gray-700"
                      >
                        Tôi xác nhận rằng tôi là phụ huynh/người giám hộ hợp pháp của
                        học sinh được nêu tên ở trên. Tôi đã đọc hoặc được giải thích
                        thông tin được cung cấp về vaccine này. Tôi đã có cơ hội đặt
                        câu hỏi và đã được trả lời một cách thỏa đáng. Tôi hiểu những
                        lợi ích và rủi ro của việc tiêm chủng và tôi yêu cầu vaccine
                        được tiêm cho học sinh nêu tên ở trên mà tôi được ủy quyền
                        đưa ra yêu cầu này.
                      </label>
                    </div>
                  </div>
                </div>
              )}              {/* Submit Buttons */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Link
                  to="/parent/vaccinations"
                  className="bg-gray-200 hover:bg-gray-300 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Hủy
                </Link>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Gửi đơn
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Quyết định đồng ý của bạn rất quan trọng. Vui lòng hoàn thành đơn này trước{" "}
              {formatDate(campaign.consentDeadline)}. Nếu bạn có câu hỏi
              về vaccine này, vui lòng liên hệ với y tá trường học.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VaccinationConsentForm;
