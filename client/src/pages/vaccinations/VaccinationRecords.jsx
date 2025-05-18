import React, { useState } from "react";
import { Link } from "react-router-dom";

function VaccinationRecords() {
  // Demo data for students
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Emma Johnson",
      grade: "5th Grade",
      age: 10,
      photo: null, // would be an image URL in a real app
    },
    {
      id: 2,
      name: "Thomas Johnson",
      grade: "8th Grade",
      age: 13,
      photo: null,
    },
  ]);

  // Demo data for vaccination records
  const [records, setRecords] = useState([
    {
      id: 1,
      studentId: 1,
      vaccineName: "Influenza Vaccine (Seasonal)",
      dateAdministered: "2023-09-15",
      lotNumber: "FL2023-456",
      expirationDate: "2024-05-30",
      administeredBy: "Nurse Sarah Wilson",
      site: "Left deltoid",
      notes: "",
      manufacturer: "Influenza Biologics Inc.",
      nextDoseDate: null,
    },
    {
      id: 2,
      studentId: 1,
      vaccineName: "Tdap (Tetanus, Diphtheria, Pertussis)",
      dateAdministered: "2022-03-10",
      lotNumber: "TD785-221",
      expirationDate: "2023-10-15",
      administeredBy: "Dr. James Carter",
      site: "Right deltoid",
      notes: "",
      manufacturer: "Immunize Corp",
      nextDoseDate: "2032-03-10",
    },
    {
      id: 3,
      studentId: 1,
      vaccineName: "MMR (Measles, Mumps, Rubella)",
      dateAdministered: "2018-06-22",
      lotNumber: "MMR456-18",
      expirationDate: "2019-12-31",
      administeredBy: "Dr. Maria Sanchez",
      site: "Left deltoid",
      notes: "",
      manufacturer: "VacciGen Laboratories",
      nextDoseDate: null,
    },
    {
      id: 4,
      studentId: 2,
      vaccineName: "Influenza Vaccine (Seasonal)",
      dateAdministered: "2023-09-17",
      lotNumber: "FL2023-458",
      expirationDate: "2024-05-30",
      administeredBy: "Nurse Sarah Wilson",
      site: "Left deltoid",
      notes: "Student reported mild soreness at injection site",
      manufacturer: "Influenza Biologics Inc.",
      nextDoseDate: null,
    },
    {
      id: 5,
      studentId: 2,
      vaccineName: "Tdap (Tetanus, Diphtheria, Pertussis)",
      dateAdministered: "2020-04-25",
      lotNumber: "TD785-180",
      expirationDate: "2022-01-15",
      administeredBy: "Dr. Robert Chen",
      site: "Right deltoid",
      notes: "",
      manufacturer: "Immunize Corp",
      nextDoseDate: "2030-04-25",
    },
    {
      id: 6,
      studentId: 2,
      vaccineName: "Hepatitis B",
      dateAdministered: "2020-04-25",
      lotNumber: "HB221-19",
      expirationDate: "2022-01-15",
      administeredBy: "Dr. Robert Chen",
      site: "Left deltoid",
      notes: "",
      manufacturer: "BioShield Medical",
      nextDoseDate: null,
    },
  ]);

  const [activeStudentId, setActiveStudentId] = useState(students[0].id);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRecordDetails, setShowRecordDetails] = useState(null);

  // Get records for the active student
  const getStudentRecords = () => {
    return records
      .filter((record) => record.studentId === activeStudentId)
      .filter((record) =>
        record.vaccineName.toLowerCase().includes(searchTerm.toLowerCase())
      );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get active student
  const getActiveStudent = () => {
    return students.find((student) => student.id === activeStudentId);
  };

  // Get vaccination record by ID
  const getRecordById = (id) => {
    return records.find((record) => record.id === id);
  };

  // Download vaccination record as PDF (mock function)
  const downloadVaccinationRecord = () => {
    alert(
      "In a real application, this would generate and download a PDF of the vaccination records."
    );
  };

  // Share vaccination record (mock function)
  const shareVaccinationRecord = () => {
    alert(
      "In a real application, this would allow sharing the vaccination records via email or other methods."
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Vaccination Records</h1>
        <p className="text-gray-600">
          View your children's vaccination history
        </p>
      </div>

      {/* Student Selection (if multiple students) */}
      {students.length > 1 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Select Student</h2>
          <div className="flex flex-wrap gap-4">
            {students.map((student) => (
              <button
                key={student.id}
                className={`px-4 py-2 rounded-full ${
                  activeStudentId === student.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
                onClick={() => {
                  setActiveStudentId(student.id);
                  setShowRecordDetails(null);
                }}
              >
                {student.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Student Info and Actions */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                <span className="text-gray-600 font-medium text-xl">
                  {getActiveStudent().name.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold">{getActiveStudent().name}</h2>
                <p className="text-sm text-gray-600">
                  {getActiveStudent().grade} | {getActiveStudent().age} years
                  old
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={downloadVaccinationRecord}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded inline-flex items-center"
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  ></path>
                </svg>
                Download Records
              </button>
              <button
                onClick={shareVaccinationRecord}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded inline-flex items-center"
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
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  ></path>
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Records List and Details */}
        <div className="flex flex-col md:flex-row">
          {/* Records List */}
          <div
            className={`w-full ${
              showRecordDetails ? "md:w-1/3" : "md:w-full"
            } border-r`}
          >
            {/* Search Bar */}
            <div className="p-4 border-b">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search vaccines"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Records List */}
            <div className="divide-y divide-gray-200">
              {getStudentRecords().length > 0 ? (
                getStudentRecords().map((record) => (
                  <button
                    key={record.id}
                    className={`w-full text-left p-4 hover:bg-gray-50 focus:outline-none ${
                      showRecordDetails === record.id ? "bg-blue-50" : ""
                    }`}
                    onClick={() => setShowRecordDetails(record.id)}
                  >
                    <h3 className="font-medium text-gray-900">
                      {record.vaccineName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Administered: {formatDate(record.dateAdministered)}
                    </p>
                    {record.nextDoseDate && (
                      <p className="text-xs text-blue-600 mt-1">
                        Next dose: {formatDate(record.nextDoseDate)}
                      </p>
                    )}
                  </button>
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No vaccination records found</p>
                  {searchTerm && (
                    <button
                      className="mt-2 text-blue-600 hover:text-blue-800"
                      onClick={() => setSearchTerm("")}
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Record Details */}
          {showRecordDetails ? (
            <div className="w-full md:w-2/3 p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold">
                  {getRecordById(showRecordDetails).vaccineName}
                </h2>
                <button
                  className="text-gray-400 hover:text-gray-600 md:hidden"
                  onClick={() => setShowRecordDetails(null)}
                >
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Date Administered
                  </h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(
                      getRecordById(showRecordDetails).dateAdministered
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Administered By
                  </h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {getRecordById(showRecordDetails).administeredBy}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Manufacturer
                  </h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {getRecordById(showRecordDetails).manufacturer}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Lot Number
                  </h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {getRecordById(showRecordDetails).lotNumber}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Expiration Date
                  </h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(
                      getRecordById(showRecordDetails).expirationDate
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Injection Site
                  </h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {getRecordById(showRecordDetails).site}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500">
                    Next Dose
                  </h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {getRecordById(showRecordDetails).nextDoseDate
                      ? formatDate(
                          getRecordById(showRecordDetails).nextDoseDate
                        )
                      : "No additional doses required"}
                  </p>
                </div>
                {getRecordById(showRecordDetails).notes && (
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {getRecordById(showRecordDetails).notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-md">
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
                      This record is maintained by the school health office. If
                      you need an official copy for other purposes, please use
                      the Download Records button.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full md:w-2/3 hidden md:flex items-center justify-center p-10">
              <div className="text-center">
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Select a vaccination record
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Choose a record from the list to view details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Vaccinations & Reminders */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold">
            Upcoming Vaccinations & Reminders
          </h2>
        </div>
        <div className="p-6">
          {records.some(
            (record) =>
              record.studentId === activeStudentId && record.nextDoseDate
          ) ? (
            <div className="space-y-4">
              {records
                .filter(
                  (record) =>
                    record.studentId === activeStudentId && record.nextDoseDate
                )
                .map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between border-b pb-4"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {record.vaccineName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Next dose: {formatDate(record.nextDoseDate)}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        new Date(record.nextDoseDate) <=
                        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {new Date(record.nextDoseDate) <=
                      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                        ? "Due Soon"
                        : "Scheduled"}
                    </span>
                  </div>
                ))}
              <p className="text-sm text-gray-500 mt-4">
                You will receive reminders as these dates approach. Contact the
                school nurse if you have questions.
              </p>
            </div>
          ) : (
            <div className="text-center py-6">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No upcoming vaccinations
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                There are no scheduled vaccinations for{" "}
                {getActiveStudent().name} at this time
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
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
              Keeping vaccinations up to date is an important part of your
              child's health. If you need to update your child's vaccination
              records, please contact the school nurse's office or upload
              documentation through the Health Records section.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VaccinationRecords;
