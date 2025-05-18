import React, { useState } from "react";
import { Link } from "react-router-dom";

function MedicationRequest() {
  // Demo data for students
  const students = [
    { id: 1, name: "Emma Johnson", grade: "5th Grade", age: 10 },
    { id: 2, name: "Thomas Johnson", grade: "8th Grade", age: 13 },
    { id: 3, name: "Olivia Smith", grade: "3rd Grade", age: 8 },
  ];
  // Form state
  const [formData, setFormData] = useState({
    studentId: "",
    medicationName: "",
    medicationType: "prescription",
    dosage: "",
    frequency: "",
    startDate: "",
    endDate: "",
    timeOfDay: [],
    instructions: "",
    prescriptionImage: null,
    prescriptionDocuments: [],
    allergies: "",
    sideEffects: "",
    isSelfAdministered: false,
    needsRefrigeration: false,
    pharmacyName: "",
    pharmacyPhone: "",
    physicianName: "",
    physicianPhone: "",
    consentToAdminister: false,
    additionalNotes: "",
  });
  // Form handling
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

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
    } else if (type === "checkbox" && name === "timeOfDay") {
      // Handle multiple checkbox selections for timeOfDay
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
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate the form
    if (
      !formData.studentId ||
      !formData.medicationName ||
      !formData.dosage ||
      !formData.frequency ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.consentToAdminister
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    // For prescription medications, require prescription documentation
    if (
      formData.medicationType === "prescription" &&
      !formData.prescriptionImage &&
      formData.prescriptionDocuments.length === 0
    ) {
      alert(
        "Please upload a prescription document for prescription medications."
      );
      return;
    }

    // In a real app, this would submit to an API
    alert("Medication request submitted successfully!");

    // Reset form or redirect
    // setFormData({ ... }); // Reset form
    // or navigate to medications list
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Request Medication Administration
        </h1>
        <p className="text-gray-600">
          Complete this form to request medication administration at school
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          {/* Student Selection */}
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="studentId"
            >
              Student <span className="text-red-500">*</span>
            </label>
            <select
              id="studentId"
              name="studentId"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.studentId}
              onChange={handleChange}
              required
            >
              <option value="">Select a student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.grade})
                </option>
              ))}
            </select>
          </div>

          {/* Medication Information */}
          <h2 className="text-xl font-bold mb-4 border-b pb-2">
            Medication Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="medicationName"
              >
                Medication Name <span className="text-red-500">*</span>
              </label>
              <input
                id="medicationName"
                name="medicationName"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="e.g., Ibuprofen, Albuterol"
                value={formData.medicationName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="dosage"
              >
                Dosage <span className="text-red-500">*</span>
              </label>
              <input
                id="dosage"
                name="dosage"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="e.g., 200mg, 2 puffs"
                value={formData.dosage}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Medication Type <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-6">
              <div className="flex items-center">
                <input
                  id="prescription"
                  name="medicationType"
                  type="radio"
                  value="prescription"
                  checked={formData.medicationType === "prescription"}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label
                  htmlFor="prescription"
                  className="ml-2 block text-gray-700"
                >
                  Prescription Medication
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="otc"
                  name="medicationType"
                  type="radio"
                  value="otc"
                  checked={formData.medicationType === "otc"}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="otc" className="ml-2 block text-gray-700">
                  Over-the-Counter (OTC)
                </label>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="frequency"
            >
              Frequency <span className="text-red-500">*</span>
            </label>
            <input
              id="frequency"
              name="frequency"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="e.g., Once daily, Every 4-6 hours as needed"
              value={formData.frequency}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Time of Day for Administration{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center">
                <input
                  id="morning"
                  name="timeOfDay"
                  type="checkbox"
                  value="morning"
                  checked={formData.timeOfDay.includes("morning")}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="morning" className="ml-2 block text-gray-700">
                  Morning (8-10 AM)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="midday"
                  name="timeOfDay"
                  type="checkbox"
                  value="midday"
                  checked={formData.timeOfDay.includes("midday")}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="midday" className="ml-2 block text-gray-700">
                  Midday (11 AM-1 PM)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="afternoon"
                  name="timeOfDay"
                  type="checkbox"
                  value="afternoon"
                  checked={formData.timeOfDay.includes("afternoon")}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="afternoon" className="ml-2 block text-gray-700">
                  Afternoon (2-4 PM)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="asNeeded"
                  name="timeOfDay"
                  type="checkbox"
                  value="asNeeded"
                  checked={formData.timeOfDay.includes("asNeeded")}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="asNeeded" className="ml-2 block text-gray-700">
                  As Needed (PRN)
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="startDate"
              >
                Start Date <span className="text-red-500">*</span>
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

            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="endDate"
              >
                End Date <span className="text-red-500">*</span>
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

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="instructions"
            >
              Special Instructions
            </label>
            <textarea
              id="instructions"
              name="instructions"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="3"
              placeholder="e.g., Take with food, Follow with water"
              value={formData.instructions}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Upload Prescription Documents{" "}
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
                    <span>Upload files</span>
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
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, PNG, JPG, DOC up to 10MB
                </p>
              </div>
            </div>

            {/* Display uploaded documents */}
            {formData.prescriptionDocuments.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Uploaded Documents
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

            <p className="text-sm text-gray-500 mt-2">
              {formData.medicationType === "prescription"
                ? "Please upload a clear image of the prescription or doctor's note. Required for all prescription medications."
                : "For over-the-counter medications, a prescription is not required but any relevant documentation can be uploaded."}
            </p>
          </div>
          {/* Health Information Section */}
          <h2 className="text-xl font-bold mb-4 border-b pb-2">
            Health Information
          </h2>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="allergies"
            >
              Known Allergies or Sensitivities
            </label>
            <textarea
              id="allergies"
              name="allergies"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="2"
              placeholder="List any known allergies or drug sensitivities"
              value={formData.allergies}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="sideEffects"
            >
              Possible Side Effects to Watch For
            </label>
            <textarea
              id="sideEffects"
              name="sideEffects"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="2"
              placeholder="List any side effects that the school nurse should monitor for"
              value={formData.sideEffects}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Contact Information */}
          <h2 className="text-xl font-bold mb-4 border-b pb-2">
            Medical Contact Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="physicianName"
              >
                Prescribing Physician
              </label>
              <input
                id="physicianName"
                name="physicianName"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Dr. Name"
                value={formData.physicianName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="physicianPhone"
              >
                Physician Phone
              </label>
              <input
                id="physicianPhone"
                name="physicianPhone"
                type="tel"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="(555) 123-4567"
                value={formData.physicianPhone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="pharmacyName"
              >
                Pharmacy Name
              </label>
              <input
                id="pharmacyName"
                name="pharmacyName"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Pharmacy name"
                value={formData.pharmacyName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="pharmacyPhone"
              >
                Pharmacy Phone
              </label>
              <input
                id="pharmacyPhone"
                name="pharmacyPhone"
                type="tel"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="(555) 123-4567"
                value={formData.pharmacyPhone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Additional Information */}
          <h2 className="text-xl font-bold mb-4 border-b pb-2">
            Additional Information
          </h2>

          <div className="mb-6">
            <div className="flex items-center">
              <input
                id="isSelfAdministered"
                name="isSelfAdministered"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={formData.isSelfAdministered}
                onChange={handleChange}
              />
              <label
                className="ml-2 block text-gray-700"
                htmlFor="isSelfAdministered"
              >
                Student is capable of self-administering this medication
              </label>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center">
              <input
                id="needsRefrigeration"
                name="needsRefrigeration"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={formData.needsRefrigeration}
                onChange={handleChange}
              />
              <label
                className="ml-2 block text-gray-700"
                htmlFor="needsRefrigeration"
              >
                This medication requires refrigeration
              </label>
            </div>
          </div>

          <div className="mb-6">
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
              rows="3"
              placeholder="Any additional information the school nurse should know"
              value={formData.additionalNotes}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Consent */}
          <div className="mb-6 bg-gray-50 p-4 border rounded">
            <div className="flex items-center">
              <input
                id="consentToAdminister"
                name="consentToAdminister"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={formData.consentToAdminister}
                onChange={handleChange}
                required
              />
              <label
                className="ml-2 block text-gray-700"
                htmlFor="consentToAdminister"
              >
                <span className="font-medium">I consent</span> for the school
                nurse or designated personnel to administer the medication as
                directed above. I understand that the school administrator may
                designate other personnel to administer the medication as
                needed.
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-between mt-8">
            <Link
              to="/parent/medications"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded transition duration-150 ease-in-out"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition duration-150 ease-in-out"
            >
              Submit Request
            </button>
          </div>
        </form>
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
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              All medication must be provided in the original labeled container.
              Over-the-counter medication must be in an unopened container. All
              medication requests will be reviewed by the school nurse before
              approval.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedicationRequest;
