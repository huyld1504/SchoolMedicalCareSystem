import React, { useState } from "react";

function MedicationAdministration() {
  // Demo data for medication administration
  const [medications, setMedications] = useState([
    {
      id: 1,
      studentName: "Emma Johnson",
      studentId: "S10045",
      grade: "5th Grade",
      medication: "Ibuprofen",
      dosage: "200mg",
      instructions: "For headache or fever above 100F",
      time: "12:00 PM",
      status: "Pending",
      consentToAdminister: true,
      startDate: "2023-05-01",
      endDate: "2023-06-01",
      history: [
        {
          date: "2023-05-10",
          time: "12:05 PM",
          administered: true,
          notes: "Student reported headache",
        },
        { date: "2023-05-09", time: "12:00 PM", administered: true, notes: "" },
        {
          date: "2023-05-08",
          time: "12:10 PM",
          administered: false,
          notes: "Student absent",
        },
      ],
    },
    {
      id: 2,
      studentName: "Thomas Johnson",
      studentId: "S10046",
      grade: "8th Grade",
      medication: "Albuterol",
      dosage: "90mcg, 2 puffs",
      instructions: "For asthma symptoms. May take before exercise.",
      time: "10:30 AM",
      status: "Pending",
      consentToAdminister: true,
      startDate: "2023-05-01",
      endDate: "2023-08-31",
      history: [
        {
          date: "2023-05-10",
          time: "10:32 AM",
          administered: true,
          notes: "Before PE class",
        },
        {
          date: "2023-05-09",
          time: "10:30 AM",
          administered: true,
          notes: "Before PE class",
        },
        {
          date: "2023-05-08",
          time: "10:31 AM",
          administered: true,
          notes: "Before PE class",
        },
      ],
    },
    {
      id: 3,
      studentName: "Olivia Smith",
      studentId: "S10058",
      grade: "3rd Grade",
      medication: "Cetirizine",
      dosage: "5mg",
      instructions: "For seasonal allergies. Take in the morning.",
      time: "09:00 AM",
      status: "Administered",
      consentToAdminister: true,
      startDate: "2023-04-15",
      endDate: "2023-06-15",
      history: [
        { date: "2023-05-11", time: "09:05 AM", administered: true, notes: "" },
        {
          date: "2023-05-10",
          time: "09:02 AM",
          administered: true,
          notes: "Student reported itchy eyes",
        },
        { date: "2023-05-09", time: "09:00 AM", administered: true, notes: "" },
      ],
    },
    {
      id: 4,
      studentName: "Michael Brown",
      studentId: "S10062",
      grade: "7th Grade",
      medication: "Methylphenidate",
      dosage: "10mg",
      instructions: "Take with food.",
      time: "12:00 PM",
      status: "Pending",
      consentToAdminister: false,
      startDate: "2023-05-01",
      endDate: "2023-12-31",
      history: [
        { date: "2023-05-10", time: "12:01 PM", administered: true, notes: "" },
        { date: "2023-05-09", time: "12:00 PM", administered: true, notes: "" },
        { date: "2023-05-08", time: "12:03 PM", administered: true, notes: "" },
      ],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedicationId, setSelectedMedicationId] = useState(null);
  const [selectedTab, setSelectedTab] = useState("pending");
  const [administrationNotes, setAdministrationNotes] = useState("");
  const [currentDate] = useState(new Date().toISOString().split("T")[0]);
  const [currentTime] = useState(
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  // Get medication by ID
  const getSelectedMedication = () => {
    return medications.find((med) => med.id === selectedMedicationId) || null;
  };

  // Filter medications based on search term and status tab
  const filteredMedications = medications.filter((med) => {
    const matchesSearch =
      med.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.medication.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab =
      (selectedTab === "pending" && med.status === "Pending") ||
      (selectedTab === "administered" && med.status === "Administered") ||
      selectedTab === "all";

    return matchesSearch && matchesTab;
  });

  // Handle administration of medication
  const handleAdministerMedication = (id, wasAdministered) => {
    const updatedMedications = medications.map((med) => {
      if (med.id === id) {
        // Add to history
        const updatedHistory = [
          {
            date: currentDate,
            time: currentTime,
            administered: wasAdministered,
            notes: administrationNotes,
          },
          ...med.history,
        ];

        return {
          ...med,
          status: wasAdministered ? "Administered" : "Skipped",
          history: updatedHistory,
        };
      }
      return med;
    });

    setMedications(updatedMedications);
    setSelectedMedicationId(null);
    setAdministrationNotes("");
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Medication Administration</h1>
        <p className="text-gray-600">
          Administer and track student medications
        </p>
      </div>

      {/* Search and Filter Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
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
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by student name, ID, or medication"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex border-b">
          <button
            className={`py-3 px-6 font-medium text-sm focus:outline-none ${selectedTab === "pending"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
              }`}
            onClick={() => setSelectedTab("pending")}
          >
            Pending Today
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm focus:outline-none ${selectedTab === "administered"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
              }`}
            onClick={() => setSelectedTab("administered")}
          >
            Administered Today
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm focus:outline-none ${selectedTab === "all"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
              }`}
            onClick={() => setSelectedTab("all")}
          >
            All Medications
          </button>
        </div>
      </div>

      {/* Medication List and Detail View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Medications List */}
        <div className="md:col-span-1 bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="font-bold text-lg">
              Medications{" "}
              {selectedTab === "pending"
                ? "to Administer"
                : selectedTab === "administered"
                  ? "Administered"
                  : ""}
            </h2>
            <p className="text-sm text-gray-500">
              {formatDate(currentDate)} ({filteredMedications.length}{" "}
              {filteredMedications.length === 1 ? "medication" : "medications"})
            </p>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredMedications.length > 0 ? (
              filteredMedications.map((med) => (
                <button
                  key={med.id}
                  className={`w-full text-left p-4 hover:bg-gray-50 focus:outline-none ${selectedMedicationId === med.id ? "bg-blue-50" : ""
                    }`}
                  onClick={() => setSelectedMedicationId(med.id)}
                >
                  <div className="flex items-center">
                    <span
                      className={`w-3 h-3 rounded-full mr-3 ${med.status === "Administered"
                          ? "bg-green-500"
                          : med.status === "Skipped"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                        }`}
                    ></span>
                    <div>
                      <h3 className="font-medium">{med.studentName}</h3>
                      <p className="text-sm text-gray-500">
                        {med.medication}, {med.time}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500">No medications found</p>
              </div>
            )}
          </div>
        </div>

        {/* Medication Details */}
        <div className="md:col-span-2 bg-white rounded-lg shadow">
          {selectedMedicationId ? (
            <div>
              <div className="p-6 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold">
                      {getSelectedMedication().studentName}
                    </h2>
                    <p className="text-gray-500">
                      ID: {getSelectedMedication().studentId} |{" "}
                      {getSelectedMedication().grade}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getSelectedMedication().status === "Administered"
                        ? "bg-green-100 text-green-800"
                        : getSelectedMedication().status === "Skipped"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                  >
                    {getSelectedMedication().status}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">
                    Medication Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Medication
                      </p>
                      <p className="font-medium">
                        {getSelectedMedication().medication}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Dosage
                      </p>
                      <p className="font-medium">
                        {getSelectedMedication().dosage}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Scheduled Time
                      </p>
                      <p className="font-medium">
                        {getSelectedMedication().time}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Instructions
                      </p>
                      <p className="font-medium">                        {getSelectedMedication().instructions}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Consent to Administer
                      </p>
                      <p className="font-medium">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getSelectedMedication().consentToAdminister
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                            }`}
                        >
                          {getSelectedMedication().consentToAdminister
                            ? "Consent Provided"
                            : "No Consent"}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Start Date
                      </p>
                      <p className="font-medium">
                        {getSelectedMedication().startDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        End Date
                      </p>
                      <p className="font-medium">
                        {getSelectedMedication().endDate}
                      </p>
                    </div>
                  </div>
                </div>

                {getSelectedMedication().status === "Pending" && (
                  <div className="mb-6 p-4 border rounded bg-gray-50">
                    <h3 className="text-md font-medium mb-3">
                      Administration Notes
                    </h3>
                    <textarea
                      className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      rows="2"
                      placeholder="Enter any notes about this administration (optional)"
                      value={administrationNotes}
                      onChange={(e) => setAdministrationNotes(e.target.value)}
                    ></textarea>
                    <div className="mt-4 flex space-x-2">
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
                        onClick={() =>
                          handleAdministerMedication(selectedMedicationId, true)
                        }
                      >
                        Mark as Administered
                      </button>
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded"
                        onClick={() =>
                          handleAdministerMedication(
                            selectedMedicationId,
                            false
                          )
                        }
                      >
                        Mark as Skipped
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Administration History
                  </h3>
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-medium text-gray-500"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-medium text-gray-500"
                          >
                            Time
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-medium text-gray-500"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-medium text-gray-500"
                          >
                            Notes
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {getSelectedMedication().history.map(
                          (record, index) => (
                            <tr key={index}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                                {formatDate(record.date)}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {record.time}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${record.administered
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                    }`}
                                >
                                  {record.administered
                                    ? "Administered"
                                    : "Skipped"}
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {record.notes || "—"}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full p-10">
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
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Select a medication
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Choose a medication from the list to view details and
                  administer
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MedicationAdministration;
