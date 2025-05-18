import React, { useState } from "react";
import { Link } from "react-router-dom";

function MedicationApproval() {
  // Demo data for medication requests
  const [medicationRequests, setMedicationRequests] = useState([
    {
      id: 1,
      studentName: "Emma Johnson",
      studentId: "S10045",
      grade: "5th Grade",
      medication: "Ibuprofen",
      dosage: "200mg",
      frequency: "As needed",
      timeOfDay: ["asNeeded"],
      startDate: "2023-05-01",
      endDate: "2023-05-30",
      instructions: "For headache or fever above 100F",
      prescriptionUploaded: true,
      requestDate: "2023-04-28",
      status: "pending",
      parentName: "Sarah Johnson",
      parentPhone: "(555) 123-4567",
    },
    {
      id: 2,
      studentName: "Thomas Johnson",
      studentId: "S10046",
      grade: "8th Grade",
      medication: "Albuterol",
      dosage: "90mcg, 2 puffs",
      frequency: "Every 4-6 hours",
      timeOfDay: ["morning", "afternoon"],
      startDate: "2023-05-15",
      endDate: "2023-12-31",
      instructions: "For asthma symptoms. May take before exercise.",
      prescriptionUploaded: true,
      requestDate: "2023-05-10",
      status: "pending",
      parentName: "Sarah Johnson",
      parentPhone: "(555) 123-4567",
    },
    {
      id: 3,
      studentName: "Olivia Smith",
      studentId: "S10058",
      grade: "3rd Grade",
      medication: "Cetirizine",
      dosage: "5mg",
      frequency: "Once daily",
      timeOfDay: ["morning"],
      startDate: "2023-04-10",
      endDate: "2023-06-10",
      instructions: "For seasonal allergies. Take in the morning.",
      prescriptionUploaded: false,
      requestDate: "2023-04-05",
      status: "pending",
      parentName: "Michael Smith",
      parentPhone: "(555) 987-6543",
    },
  ]);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterStatus, setFilterStatus] = useState("pending");

  // Filter requests based on status
  const filteredRequests = medicationRequests.filter(
    (request) => filterStatus === "all" || request.status === filterStatus
  );

  // View request details
  const handleViewRequest = (id) => {
    const request = medicationRequests.find((req) => req.id === id);
    setSelectedRequest(request);
  };

  // Approve medication request
  const handleApproveRequest = (id) => {
    setMedicationRequests(
      medicationRequests.map((request) =>
        request.id === id ? { ...request, status: "approved" } : request
      )
    );

    // Update selected request if it's currently being viewed
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest({ ...selectedRequest, status: "approved" });
    }

    alert("Medication request approved successfully.");
  };

  // Deny medication request
  const handleDenyRequest = (id, reason) => {
    setMedicationRequests(
      medicationRequests.map((request) =>
        request.id === id
          ? { ...request, status: "denied", denialReason: reason }
          : request
      )
    );

    // Update selected request if it's currently being viewed
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest({
        ...selectedRequest,
        status: "denied",
        denialReason: reason,
      });
    }

    alert("Medication request denied.");
  };

  // Request additional information
  const handleRequestInfo = (id, message) => {
    setMedicationRequests(
      medicationRequests.map((request) =>
        request.id === id
          ? { ...request, status: "info-requested", infoRequest: message }
          : request
      )
    );

    // Update selected request if it's currently being viewed
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest({
        ...selectedRequest,
        status: "info-requested",
        infoRequest: message,
      });
    }

    alert("Additional information has been requested from the parent.");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Medication Request Approval</h1>
        <p className="text-gray-600">
          Review and approve medication administration requests from parents
        </p>
      </div>

      {/* Filter controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div>
          <label
            htmlFor="filterStatus"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Filter by Status:
          </label>
          <select
            id="filterStatus"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="denied">Denied</option>
            <option value="info-requested">Information Requested</option>
          </select>
        </div>

        <div className="ml-auto">
          <Link
            to="/nurse/medications/admin"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="-ml-1 mr-2 h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
            </svg>
            Medication Administration
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Requests List */}
        <div className="lg:w-1/2">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <li
                    key={request.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${
                      selectedRequest && selectedRequest.id === request.id
                        ? "bg-blue-50"
                        : ""
                    }`}
                    onClick={() => handleViewRequest(request.id)}
                  >
                    <div className="flex justify-between">
                      <p className="font-medium text-gray-900">
                        {request.studentName}
                      </p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          request.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : request.status === "denied"
                            ? "bg-red-100 text-red-800"
                            : request.status === "info-requested"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {request.status === "info-requested"
                          ? "Info Requested"
                          : request.status.charAt(0).toUpperCase() +
                            request.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {request.medication}, {request.dosage}
                    </p>
                    <div className="mt-2 flex justify-between text-sm">
                      <p className="text-gray-500">
                        Requested: {request.requestDate}
                      </p>
                      <p className="text-gray-500">Grade: {request.grade}</p>
                    </div>
                  </li>
                ))
              ) : (
                <li className="p-4 text-center text-gray-500">
                  No medication requests found with the selected filter.
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Request Details */}
        <div className="lg:w-1/2">
          {selectedRequest ? (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  {selectedRequest.studentName}
                </h2>
                <p className="text-sm text-gray-600">
                  {selectedRequest.grade} | Student ID:{" "}
                  {selectedRequest.studentId}
                </p>
              </div>

              <div className="px-6 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Medication
                    </p>
                    <p className="mt-1">{selectedRequest.medication}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Dosage</p>
                    <p className="mt-1">{selectedRequest.dosage}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Frequency
                    </p>
                    <p className="mt-1">{selectedRequest.frequency}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Time of Day
                    </p>
                    <p className="mt-1">
                      {selectedRequest.timeOfDay
                        .map((time) => {
                          const times = {
                            morning: "Morning",
                            midday: "Midday",
                            afternoon: "Afternoon",
                            asNeeded: "As Needed",
                          };
                          return times[time] || time;
                        })
                        .join(", ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Start Date
                    </p>
                    <p className="mt-1">{selectedRequest.startDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      End Date
                    </p>
                    <p className="mt-1">{selectedRequest.endDate}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500">
                    Special Instructions
                  </p>
                  <p className="mt-1 text-gray-900">
                    {selectedRequest.instructions || "None provided"}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500">
                    Prescription Documentation
                  </p>
                  <div className="mt-1">
                    {selectedRequest.prescriptionUploaded ? (
                      <div className="flex items-center">
                        <svg
                          className="h-5 w-5 text-green-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <p className="ml-2 text-green-600">
                          Prescription uploaded
                        </p>
                        <button className="ml-4 text-blue-600 hover:text-blue-800 text-sm">
                          View Prescription
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <svg
                          className="h-5 w-5 text-yellow-500"
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
                        <p className="ml-2 text-yellow-600">
                          No prescription uploaded
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500">
                    Parent Contact
                  </p>
                  <p className="mt-1">
                    {selectedRequest.parentName} | {selectedRequest.parentPhone}
                  </p>
                </div>

                {selectedRequest.status === "denied" && (
                  <div className="mb-4 bg-red-50 p-3 rounded">
                    <p className="text-sm font-medium text-red-800">
                      Denial Reason:
                    </p>
                    <p className="mt-1 text-red-700">
                      {selectedRequest.denialReason || "No reason provided"}
                    </p>
                  </div>
                )}

                {selectedRequest.status === "info-requested" && (
                  <div className="mb-4 bg-yellow-50 p-3 rounded">
                    <p className="text-sm font-medium text-yellow-800">
                      Information Requested:
                    </p>
                    <p className="mt-1 text-yellow-700">
                      {selectedRequest.infoRequest ||
                        "No specific information requested"}
                    </p>
                  </div>
                )}
              </div>

              {selectedRequest.status === "pending" && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleApproveRequest(selectedRequest.id)}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <svg
                        className="-ml-1 mr-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Approve
                    </button>

                    <button
                      onClick={() => {
                        const reason = prompt(
                          "Please enter a reason for denying this medication request:"
                        );
                        if (reason)
                          handleDenyRequest(selectedRequest.id, reason);
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <svg
                        className="-ml-1 mr-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Deny
                    </button>

                    <button
                      onClick={() => {
                        const message = prompt(
                          "What additional information do you need from the parent?"
                        );
                        if (message)
                          handleRequestInfo(selectedRequest.id, message);
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg
                        className="-ml-1 mr-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Request Info
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No request selected
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Select a medication request to view details.
              </p>
            </div>
          )}
        </div>
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
              Review medication requests carefully. Verify that prescriptions
              are valid and appropriate for school administration. Contact the
              parent or healthcare provider if you need additional information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedicationApproval;
