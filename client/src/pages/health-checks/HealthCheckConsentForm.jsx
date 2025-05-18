import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";

function HealthCheckConsentForm() {
  const { id } = useParams();

  // Demo campaign data
  const campaign = {
    id: parseInt(id) || 1,
    name: "Annual Vision & Hearing Screening",
    description: "Routine vision and hearing tests for all students",
    date: "2023-06-10",
    examiner: "School Health Department",
    procedures: [
      "Visual acuity test using Snellen chart",
      "Color vision assessment",
      "Audiometry hearing test",
      "Balance and coordination assessment",
    ],
  };

  // Demo student data
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Emma Johnson",
      grade: "5th Grade",
      age: 10,
      class: "5A",
      gender: "Female",
      dateOfBirth: "2013-05-15",
      selected: false,
    },
    {
      id: 2,
      name: "Thomas Johnson",
      grade: "8th Grade",
      age: 13,
      class: "8C",
      gender: "Male",
      dateOfBirth: "2010-02-22",
      selected: false,
    },
    {
      id: 3,
      name: "Olivia Smith",
      grade: "3rd Grade",
      age: 8,
      class: "3B",
      gender: "Female",
      dateOfBirth: "2015-09-10",
      selected: false,
    },
  ]);

  // Form state
  const [formData, setFormData] = useState({
    allergies: "",
    medicalConditions: "",
    currentMedications: "",
    previousScreeningIssues: "",
    additionalNotes: "",
    consentToScreening: false,
    consentToTreatment: false,
    consentToShareResults: false,
    documents: [], // Mảng chứa các tài liệu được tải lên
  });

  // Handling student selection
  const handleStudentSelect = (id) => {
    setStudents(
      students.map((student) =>
        student.id === id
          ? { ...student, selected: !student.selected }
          : student
      )
    );
  };

  // Form handling
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      // Xử lý nhiều file được tải lên
      const fileList = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, ...fileList],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Xử lý xóa tài liệu
  const handleRemoveDocument = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate - at least one student must be selected
    const selectedStudents = students.filter((student) => student.selected);
    if (selectedStudents.length === 0) {
      alert("Please select at least one child for the health check.");
      return;
    }

    // Validate - consent must be given
    if (!formData.consentToScreening) {
      alert("You must consent to the health screening to proceed.");
      return;
    }

    // In a real app, this would submit the consent form to an API
    alert("Health check consent submitted successfully!");
  };

  // Định dạng kích thước file
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Health Check Consent Form</h1>
          <p className="text-gray-600">
            Please review and submit this consent form for the upcoming health
            check
          </p>
        </div>
        <Link
          to="/parent/health-checks"
          className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded transition duration-150 ease-in-out"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 111.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Health Checks
        </Link>
      </div>

      {/* Campaign Info Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{campaign.name}</h2>
          <img
            src="/src/assets/logo.svg"
            alt="School Medical System"
            className="h-10"
          />
        </div>
        <p className="mb-4">{campaign.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Date</p>
            <p>{campaign.date}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Conducted By</p>
            <p>{campaign.examiner}</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium text-gray-500 mb-2">
            Procedures Included
          </p>
          <ul className="list-disc pl-5">
            {campaign.procedures.map((procedure, index) => (
              <li key={index} className="text-gray-700">
                {procedure}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Select Children Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">
            Select Children for Health Check
          </h2>
          <p className="mb-4 text-gray-600">
            Please select the children you want to consent for this health
            check.
          </p>

          <div className="space-y-4">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center p-4 border rounded hover:bg-gray-50"
              >
                <input
                  id={`student-${student.id}`}
                  type="checkbox"
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={student.selected}
                  onChange={() => handleStudentSelect(student.id)}
                />
                <label
                  htmlFor={`student-${student.id}`}
                  className="ml-3 flex flex-col cursor-pointer"
                >
                  <span className="text-gray-900 font-medium">
                    {student.name}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {student.grade} | {student.gender} | DOB:{" "}
                    {student.dateOfBirth}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Medical Information */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">
            Relevant Medical Information
          </h2>
          <p className="mb-4 text-gray-600">
            Please provide any relevant medical information that may be
            important for the health check.
          </p>

          <div className="space-y-4">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="allergies"
              >
                Allergies
              </label>
              <textarea
                id="allergies"
                name="allergies"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="2"
                placeholder="List any allergies your child(ren) may have"
                value={formData.allergies}
                onChange={handleChange}
              ></textarea>
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="medicalConditions"
              >
                Medical Conditions
              </label>
              <textarea
                id="medicalConditions"
                name="medicalConditions"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="2"
                placeholder="List any medical conditions your child(ren) may have"
                value={formData.medicalConditions}
                onChange={handleChange}
              ></textarea>
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="currentMedications"
              >
                Current Medications
              </label>
              <textarea
                id="currentMedications"
                name="currentMedications"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="2"
                placeholder="List any medications your child(ren) are currently taking"
                value={formData.currentMedications}
                onChange={handleChange}
              ></textarea>
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="previousScreeningIssues"
              >
                Previous Screening Issues
              </label>
              <textarea
                id="previousScreeningIssues"
                name="previousScreeningIssues"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="2"
                placeholder="List any relevant previous health screening issues or follow-ups"
                value={formData.previousScreeningIssues}
                onChange={handleChange}
              ></textarea>
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="additionalNotes"
              >
                Additional Notes
              </label>
              <textarea
                id="additionalNotes"
                name="additionalNotes"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="2"
                placeholder="Any additional information we should know"
                value={formData.additionalNotes}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Thêm phần tải lên tài liệu */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">
            Upload Medical Documents (Optional)
          </h2>
          <p className="mb-4 text-gray-600">
            You can upload any relevant medical documents for your child(ren)
            that may assist in the health check.
          </p>

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
                  htmlFor="documentUpload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="documentUpload"
                    name="documentUpload"
                    type="file"
                    className="sr-only"
                    multiple
                    onChange={handleChange}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PDF, PNG, JPG, DOCX up to 10MB
              </p>
            </div>
          </div>

          {/* Hiển thị danh sách tài liệu đã tải lên */}
          {formData.documents.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Uploaded Documents
              </h3>
              <ul className="border rounded-md divide-y divide-gray-200">
                {formData.documents.map((file, index) => (
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
                    <div className="ml-4 flex-shrink-0">
                      <button
                        type="button"
                        className="font-medium text-red-600 hover:text-red-500"
                        onClick={() => handleRemoveDocument(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Consent Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Consent</h2>

          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="consentToScreening"
                  name="consentToScreening"
                  type="checkbox"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  checked={formData.consentToScreening}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="consentToScreening"
                  className="font-medium text-gray-700"
                >
                  I consent for my child(ren) to participate in the health
                  screening
                </label>
                <p className="text-gray-500">
                  I understand that this screening includes vision, hearing, and
                  other tests as specified above.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="consentToTreatment"
                  name="consentToTreatment"
                  type="checkbox"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  checked={formData.consentToTreatment}
                  onChange={handleChange}
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="consentToTreatment"
                  className="font-medium text-gray-700"
                >
                  I consent for first aid or emergency treatment if needed
                </label>
                <p className="text-gray-500">
                  I authorize the school nurse to provide first aid or emergency
                  treatment if necessary during the screening.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="consentToShareResults"
                  name="consentToShareResults"
                  type="checkbox"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  checked={formData.consentToShareResults}
                  onChange={handleChange}
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="consentToShareResults"
                  className="font-medium text-gray-700"
                >
                  I consent for results to be shared with relevant school staff
                </label>
                <p className="text-gray-500">
                  I authorize the school to share the screening results with
                  teachers and staff as needed for my child's educational
                  support.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-between mt-8">
          <Link
            to="/parent/health-checks"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded transition duration-150 ease-in-out"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition duration-150 ease-in-out"
          >
            Submit Consent Form
          </button>
        </div>
      </form>

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
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              If you have any questions about this health check, please contact
              the school nurse at nurse@school.edu or call (555) 123-4567.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HealthCheckConsentForm;
