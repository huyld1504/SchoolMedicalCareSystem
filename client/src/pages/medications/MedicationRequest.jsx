import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function MedicationRequest() {
  // Demo data for students
  const students = [
    { id: 1, name: "Emma Johnson", grade: "5th Grade", age: 10 },
    { id: 2, name: "Thomas Johnson", grade: "8th Grade", age: 13 },
    { id: 3, name: "Olivia Smith", grade: "3rd Grade", age: 8 },
  ];
  // Get selected student from localStorage if available
  useEffect(() => {
    const selectedStudentId = localStorage.getItem('selectedStudentId');
    if (selectedStudentId) {
      // Convert to same type as student.id might be (string or number)
      const studentId = selectedStudentId;
      setFormData(prev => ({
        ...prev,
        studentId
      }));

      // Lock the student selection since it came from a previous selection
      setIsStudentLocked(true);

      // Clear the localStorage after using it
      localStorage.removeItem('selectedStudentId');
      localStorage.removeItem('selectedStudentName');
      localStorage.removeItem('selectedStudentGrade');
    }
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    studentId: "",
    medications: [
      {
        id: 1,
        medicationName: "",
        medicationType: "prescription",
        dosage: "",
        frequency: "",
        timeOfDay: [],
        instructions: ""
      }
    ],
    startDate: "",
    endDate: "",
    prescriptionImage: null,
    prescriptionDocuments: [],
    allergies: "",
    sideEffects: "",
    isSelfAdministered: false,
    needsRefrigeration: false,
    consentToAdminister: false,
    additionalNotes: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isStudentLocked, setIsStudentLocked] = useState(false);

  // Form handling
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    // Clear validation errors when user starts typing
    if (validationErrors.consent && name === 'consentToAdminister') {
      setValidationErrors(prev => ({ ...prev, consent: null }));
    }

    // Lock student selection once a student is chosen
    if (name === 'studentId' && value && !isStudentLocked) {
      setIsStudentLocked(true);
    }

    if (type === "file") {
      if (name === "prescriptionDocuments") {
        // Handle multiple file upload for documents
        const fileList = Array.from(files);
        setFormData((prev) => ({
          ...prev,
          [name]: [...prev.prescriptionDocuments, ...fileList],
        }));
      } else {
        // Single file for prescriptionImage
        setFormData((prev) => ({
          ...prev,
          [name]: files[0],
        }));
      }
    } else if (name.startsWith("medications[")) {
      // Handle medication fields with format: medications[index].fieldName
      const regex = /medications\[(\d+)\]\.(.+)/;
      const matches = name.match(regex);

      if (matches) {
        const index = parseInt(matches[1]);
        const fieldName = matches[2];

        setFormData((prev) => {
          const updatedMedications = [...prev.medications];

          if (fieldName === "timeOfDay") {
            // Handle checkbox array for timeOfDay
            const currentTimes = updatedMedications[index].timeOfDay || [];
            if (checked) {
              updatedMedications[index] = {
                ...updatedMedications[index],
                timeOfDay: [...currentTimes, value]
              };
            } else {
              updatedMedications[index] = {
                ...updatedMedications[index],
                timeOfDay: currentTimes.filter(time => time !== value)
              };
            }
          } else {
            // Handle regular field updates
            updatedMedications[index] = {
              ...updatedMedications[index],
              [fieldName]: type === "checkbox" ? checked : value
            };
          }

          return {
            ...prev,
            medications: updatedMedications
          };
        });
      }
    } else if (type === "checkbox" && name === "timeOfDay") {
      // Handle multiple checkbox selections for timeOfDay (legacy support)
      const updatedTimes = [...formData.timeOfDay];
      if (checked) {
        updatedTimes.push(value);
      } else {
        const index = updatedTimes.indexOf(value);
        if (index > -1) {
          updatedTimes.splice(index, 1);
        }
      }
      setFormData((prev) => ({
        ...prev,
        timeOfDay: updatedTimes,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };
  // Remove a document from the uploaded list
  const handleRemoveDocument = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      prescriptionDocuments: prev.prescriptionDocuments.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  // Add a new medication to the list
  const handleAddMedication = () => {
    setFormData((prev) => ({
      ...prev,
      medications: [
        ...prev.medications,
        {
          id: prev.medications.length + 1,
          medicationName: "",
          medicationType: "prescription",
          dosage: "",
          frequency: "",
          timeOfDay: [],
          instructions: ""
        }
      ]
    }));
  };
  // Remove a medication from the list
  const handleRemoveMedication = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Function to unlock student selection
  const handleUnlockStudent = () => {
    setIsStudentLocked(false);
  }; const handleSubmit = (e) => {
    e.preventDefault();

    // Clear previous validation errors
    setValidationErrors({});      // Check consent first (most important validation)
    if (!formData.consentToAdminister) {
      setValidationErrors({ consent: "Cần có sự đồng ý để gửi yêu cầu thuốc" });
      alert("⚠️ CẦN SỰ ĐỒNG Ý\n\nBạn phải đồng ý cho nhà trường cấp thuốc cho con của bạn. Vui lòng đánh dấu vào ô đồng ý ở cuối biểu mẫu trước khi gửi yêu cầu của bạn.");
      // Scroll to consent section
      const consentElement = document.getElementById('consentToAdminister');
      if (consentElement) {
        consentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        consentElement.focus();
      }
      return;
    }    // Validate other required fields
    if (
      !formData.studentId ||
      !formData.startDate ||
      !formData.endDate
    ) {
      alert("Vui lòng điền vào tất cả các trường bắt buộc (Học sinh, Ngày bắt đầu, Ngày kết thúc).");
      return;
    }    // Validate medications
    if (formData.medications.length === 0) {
      alert("Vui lòng thêm ít nhất một loại thuốc.");
      return;
    }    // Check each medication
    const invalidMedications = formData.medications.filter(
      med => !med.medicationName || !med.dosage || med.timeOfDay.length === 0
    );

    if (invalidMedications.length > 0) {
      alert("Vui lòng hoàn thành tất cả các trường bắt buộc cho mỗi loại thuốc.");
      return;
    }    // For prescription medications, require prescription documentation
    const hasPrescriptionMeds = formData.medications.some(med => med.medicationType === "prescription");
    if (
      hasPrescriptionMeds &&
      !formData.prescriptionImage &&
      formData.prescriptionDocuments.length === 0
    ) {
      alert(
        "Vui lòng tải lên tài liệu đơn thuốc cho các thuốc kê đơn."
      );
      return;
    }    // In a real app, this would submit to an API
    alert("Yêu cầu thuốc đã được gửi thành công!");

    // Reset form or redirect
    // setFormData({ ... }); // Reset form
    // or navigate to medications list
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">        <h1 className="text-3xl font-bold mb-2">
        Yêu cầu cấp thuốc tại trường
      </h1>
        <p className="text-gray-600">
          Hoàn thành biểu mẫu này để yêu cầu cấp thuốc tại trường
        </p>
      </div>      <div className="bg-white rounded-lg shadow p-6">
        {/* Important Notice */}
        <div className="mb-6 bg-amber-50 border-l-4 border-amber-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">              <p className="text-sm text-amber-700">
              <strong>Quan trọng:</strong> Cần có sự đồng ý của phụ huynh/người giám hộ để gửi yêu cầu thuốc này.
              Vui lòng đảm bảo hoàn thành tất cả các trường bắt buộc và đồng ý ở cuối biểu mẫu này.
            </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>          {/* Student Selection */}
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="studentId"
            >
              Học sinh <span className="text-red-500">*</span>
            </label>

            {isStudentLocked && formData.studentId ? (
              <div className="flex items-center justify-between p-3 border rounded bg-green-50 border-green-200">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <div className="font-medium text-green-800">
                      {students.find(s => s.id.toString() === formData.studentId.toString())?.name}
                      ({students.find(s => s.id.toString() === formData.studentId.toString())?.grade})
                    </div>
                    <div className="text-sm text-green-600">Học sinh đã được chọn và khóa</div>
                  </div>
                </div>
                {/* <button
                  type="button"
                  onClick={handleUnlockStudent}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
                  Thay đổi
                </button> */}
              </div>
            ) : (
              <select
                id="studentId"
                name="studentId"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formData.studentId}
                onChange={handleChange}
                required
              >
                <option value="">Chọn học sinh</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.grade})
                  </option>
                ))}
              </select>
            )}

            {formData.studentId && !isStudentLocked && (
              <div className="mt-2 text-sm text-blue-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Học sinh sẽ được khóa sau khi bạn chọn để tránh thay đổi nhầm lẫn
              </div>
            )}
          </div>{/* Medication Information */}
          <div className="flex justify-between items-center border-b pb-2 mb-4">            <h2 className="text-xl font-bold">Thông tin thuốc</h2>
            <button
              type="button"
              onClick={handleAddMedication}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Thêm thuốc
            </button>
          </div>

          {formData.medications.map((medication, index) => (
            <div key={medication.id} className="mb-8 p-4 border rounded-lg bg-gray-50 relative">
              {formData.medications.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveMedication(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  aria-label="Remove medication"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              )}

              <div className="text-lg font-semibold mb-3 text-blue-700">Thuốc #{index + 1}</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>                  <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor={`medications[${index}].medicationName`}
                >
                  Tên thuốc <span className="text-red-500">*</span>
                </label>
                  <input
                    id={`medications[${index}].medicationName`}
                    name={`medications[${index}].medicationName`}
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="VD: Ibuprofen, Albuterol"
                    value={medication.medicationName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>                  <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor={`medications[${index}].dosage`}
                >
                  Liều lượng <span className="text-red-500">*</span>
                </label>
                  <input
                    id={`medications[${index}].dosage`}
                    name={`medications[${index}].dosage`}
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="VD: 200mg, 2 nhát"
                    value={medication.dosage}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-6">                <label className="block text-gray-700 text-sm font-bold mb-2">
                Loại thuốc <span className="text-red-500">*</span>
              </label>
                <div className="flex space-x-6">
                  <div className="flex items-center">
                    <input
                      id={`medications[${index}].medicationType-prescription`}
                      name={`medications[${index}].medicationType`}
                      type="radio"
                      value="prescription"
                      checked={medication.medicationType === "prescription"}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />                    <label
                      htmlFor={`medications[${index}].medicationType-prescription`}
                      className="ml-2 block text-gray-700"
                    >
                      Thuốc kê đơn
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id={`medications[${index}].medicationType-otc`}
                      name={`medications[${index}].medicationType`}
                      type="radio"
                      value="otc"
                      checked={medication.medicationType === "otc"}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />                    <label htmlFor={`medications[${index}].medicationType-otc`} className="ml-2 block text-gray-700">
                      Thuốc không kê đơn (OTC)
                    </label>
                  </div>
                </div>
              </div>



              <div className="mb-6">                <label className="block text-gray-700 text-sm font-bold mb-2">
                Thời gian uống thuốc trong ngày <span className="text-red-500">*</span>
              </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="flex items-center">
                    <input
                      id={`medications[${index}].timeOfDay-morning`}
                      name={`medications[${index}].timeOfDay`}
                      type="checkbox"
                      value="morning"
                      checked={medication.timeOfDay?.includes("morning")}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />                    <label htmlFor={`medications[${index}].timeOfDay-morning`} className="ml-2 block text-gray-700">
                      Sáng
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id={`medications[${index}].timeOfDay-midday`}
                      name={`medications[${index}].timeOfDay`}
                      type="checkbox"
                      value="midday"
                      checked={medication.timeOfDay?.includes("midday")}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`medications[${index}].timeOfDay-midday`} className="ml-2 block text-gray-700">
                      Trưa
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id={`medications[${index}].timeOfDay-afternoon`}
                      name={`medications[${index}].timeOfDay`}
                      type="checkbox"
                      value="afternoon"
                      checked={medication.timeOfDay?.includes("afternoon")}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`medications[${index}].timeOfDay-afternoon`} className="ml-2 block text-gray-700">
                      Chiều
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id={`medications[${index}].timeOfDay-asNeeded`}
                      name={`medications[${index}].timeOfDay`}
                      type="checkbox"
                      value="asNeeded"
                      checked={medication.timeOfDay?.includes("asNeeded")}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`medications[${index}].timeOfDay-asNeeded`} className="ml-2 block text-gray-700">
                      Khi cần thiết
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`medications[${index}].instructions`}
                >
                  Hướng dẫn đặc biệt
                </label>
                <textarea
                  id={`medications[${index}].instructions`}
                  name={`medications[${index}].instructions`}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="2"
                  placeholder="VD: Uống sau bữa ăn, uống kèm nước"
                  value={medication.instructions}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          ))}          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>              <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="startDate"
            >
              Ngày bắt đầu <span className="text-red-500">*</span>
            </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div>              <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="endDate"
            >
              Ngày kết thúc <span className="text-red-500">*</span>
            </label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mb-6">            <label className="block text-gray-700 text-sm font-bold mb-2">
            Tải lên Tài liệu Đơn thuốc{" "}
            {formData.medicationType === "prescription" && (
              <span className="text-red-500">*</span>
            )}
          </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="prescriptionDocuments"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Tải lên tệp</span>
                    <input
                      id="prescriptionDocuments"
                      name="prescriptionDocuments"
                      type="file"
                      className="sr-only"
                      multiple
                      onChange={handleChange}
                      accept="image/*,.pdf,.doc,.docx"
                    />
                  </label>
                  <p className="pl-1">hoặc kéo và thả</p>
                </div>                <p className="text-xs text-gray-500">
                  PDF, PNG, JPG, DOC tối đa 10MB
                </p>
              </div>
            </div>

            {/* Display uploaded documents */}
            {formData.prescriptionDocuments.length > 0 && (
              <div className="mt-4">                <h3 className="text-sm font-medium text-gray-700 mb-2">
                Tài liệu đã tải lên
              </h3>
                <ul className="border rounded-md divide-y divide-gray-200">
                  {formData.prescriptionDocuments.map((file, index) => (
                    <li
                      key={index}
                      className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                    >
                      <div className="w-0 flex-1 flex items-center">
                        <svg
                          className="flex-shrink-0 h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 002 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="ml-2 flex-1 w-0 truncate">
                          {file.name} ({formatFileSize(file.size)})
                        </span>
                      </div>
                      <div className="ml-4 flex-shrink-0">                        <button
                        type="button"
                        className="font-medium text-red-600 hover:text-red-500"
                        onClick={() => handleRemoveDocument(index)}
                      >
                        Xóa
                      </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}            <p className="text-sm text-gray-500 mt-2">
              {formData.medicationType === "prescription"
                ? "Vui lòng tải lên hình ảnh rõ ràng của đơn thuốc hoặc giấy chỉ định của bác sĩ. Bắt buộc đối với tất cả thuốc kê đơn."
                : "Đối với thuốc không kê đơn, đơn thuốc không bắt buộc nhưng có thể tải lên bất kỳ tài liệu liên quan nào."}
            </p>
          </div>
          {/* Health Information Section */}




          <div className="mb-6">            <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="sideEffects"
          >
            Tác dụng phụ có thể xảy ra cần theo dõi
          </label>
            <textarea
              id="sideEffects"
              name="sideEffects"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="2"
              placeholder="Liệt kê bất kỳ tác dụng phụ nào mà y tá trường cần theo dõi"
              value={formData.sideEffects}
              onChange={handleChange}
            ></textarea>          </div>

          {/* Additional Information */}





          <div className="mb-6">            <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="additionalNotes"
          >
            Ghi chú bổ sung
          </label>
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="3"
              placeholder="Bất kỳ thông tin bổ sung nào mà y tá trường cần biết"
              value={formData.additionalNotes}
              onChange={handleChange}
            ></textarea>
          </div>          {/* Consent */}
          <div className="mb-6 bg-red-50 border-2 border-red-200 p-6 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <div className="ml-3 flex-1">                <h3 className="text-lg font-bold text-red-800 mb-3">
                BẮT BUỘC: Sự Đồng Ý của Phụ huynh/Người Giám hộ
              </h3>
                <div className="flex items-start">
                  <input
                    id="consentToAdminister"
                    name="consentToAdminister"
                    type="checkbox"
                    className="h-5 w-5 text-red-600 focus:ring-red-500 border-red-300 rounded mt-1"
                    checked={formData.consentToAdminister}
                    onChange={handleChange}
                    required
                  />
                  <label
                    className="ml-3 block text-gray-800 leading-relaxed"
                    htmlFor="consentToAdminister"
                  >                    <span className="font-bold text-red-800">Tôi đồng ý</span> cho y tá trường
                    hoặc nhân viên được chỉ định cấp thuốc được liệt kê ở trên cho con tôi theo
                    chỉ dẫn. Tôi hiểu rằng:
                    <ul className="list-disc list-inside mt-2 ml-4 space-y-1 text-sm text-gray-700">
                      <li>Quản trị viên trường có thể chỉ định nhân viên có trình độ khác để cấp thuốc</li>
                      <li>Tất cả thuốc phải được cung cấp trong hộp đựng gốc có nhãn</li>
                      <li>Tôi có trách nhiệm đảm bảo cung cấp đủ thuốc</li>
                      <li>Sự đồng ý này có hiệu lực cho các ngày được chỉ định ở trên</li>
                    </ul>
                  </label>
                </div>
                {!formData.consentToAdminister && (
                  <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded">                    <p className="text-sm font-medium text-red-800">
                    ⚠️ Cần có sự đồng ý để gửi yêu cầu thuốc này. Vui lòng đánh dấu vào ô trên để đồng ý.
                  </p>
                  </div>
                )}
              </div>
            </div>
          </div>          {/* Submit Buttons */}
          <div className="flex items-center justify-between mt-8">
            <Link
              to="/parent/medications"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded transition duration-150 ease-in-out"
            >
              Hủy
            </Link>
            <div className="flex flex-col items-end">
              <button
                type="submit"
                disabled={!formData.consentToAdminister}
                className={`font-medium py-2 px-6 rounded transition duration-150 ease-in-out ${formData.consentToAdminister
                  ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`} title={!formData.consentToAdminister ? "Vui lòng đồng ý trước khi gửi" : "Gửi yêu cầu thuốc"}
              >
                Gửi Yêu Cầu
              </button>
              {!formData.consentToAdminister && (<p className="text-xs text-red-600 mt-1 font-medium">
                Cần có sự đồng ý để gửi
              </p>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Help Info */}      <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4">
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
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Tất cả thuốc phải được cung cấp trong hộp đựng có nhãn gốc.
              Thuốc không kê đơn phải ở trong hộp chưa mở.
              Tất cả các yêu cầu thuốc sẽ được y tá trường xem xét trước khi phê duyệt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedicationRequest;
