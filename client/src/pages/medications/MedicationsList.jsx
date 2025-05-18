import React, { useState } from "react";
import { Link } from "react-router-dom";

function MedicationsList() {
  // Demo data for medications
  const [medications, setMedications] = useState([
    {
      id: 1,
      studentName: "Emma Johnson",
      medication: "Ibuprofen",
      dosage: "200mg",
      frequency: "As needed",
      startDate: "2023-05-01",
      endDate: "2023-05-30",
      status: "Active",
      instructions: "For headache or fever above 100F",
    },
    {
      id: 2,
      studentName: "Thomas Johnson",
      medication: "Albuterol",
      dosage: "90mcg",
      frequency: "2 puffs every 4-6 hours",
      startDate: "2023-01-15",
      endDate: "2023-12-31",
      status: "Active",
      instructions: "For asthma symptoms. May take before exercise.",
    },
    {
      id: 3,
      studentName: "Olivia Smith",
      medication: "Cetirizine",
      dosage: "5mg",
      frequency: "Once daily",
      startDate: "2023-04-10",
      endDate: "2023-06-10",
      status: "Active",
      instructions: "For seasonal allergies. Take in the morning.",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Filter medications based on search term and status
  const filteredMedications = medications.filter((med) => {
    const matchesSearch =
      med.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.medication.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && med.status === "Active") ||
      (filterStatus === "completed" && med.status === "Completed") ||
      (filterStatus === "pending" && med.status === "Pending");

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Medications</h1>
          <p className="text-gray-600">
            Manage your children's medication schedules
          </p>
        </div>
        <Link
          to="/parent/medications/request"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out"
        >
          Request Medication
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <label htmlFor="search" className="sr-only">
              Search
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
                placeholder="Search by student name or medication"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="status" className="sr-only">
              Filter by Status
            </label>
            <select
              id="status"
              name="status"
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Medications</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending Approval</option>
            </select>
          </div>
        </div>
      </div>

      {/* Medications List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredMedications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Student
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Medication
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Dosage & Frequency
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date Range
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMedications.map((med) => (
                  <tr key={med.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {med.studentName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {med.studentName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {med.medication}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{med.dosage}</div>
                      <div className="text-sm text-gray-500">
                        {med.frequency}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {med.startDate} to {med.endDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          med.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : med.status === "Completed"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {med.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() =>
                          alert(
                            `View details for ${med.medication} for ${med.studentName}`
                          )
                        }
                      >
                        View
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900"
                        onClick={() =>
                          alert(`Edit ${med.medication} for ${med.studentName}`)
                        }
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10">
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
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No medications found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by requesting a new medication."}
            </p>
            <div className="mt-6">
              <Link
                to="/parent/medications/request"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Request Medication
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
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              All medication requests must be approved by the school nurse.
              Please ensure to provide accurate dosage information and
              instructions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedicationsList;
