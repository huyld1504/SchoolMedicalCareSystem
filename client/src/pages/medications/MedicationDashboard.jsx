import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function MedicationDashboard() {
  // Add navigate function from react-router
  const navigate = useNavigate();

  const [currentDate] = useState(
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );

  // Demo data for today's medication schedule
  const [medicationsToday, setMedicationsToday] = useState([
    {
      id: 1,
      studentName: "Emma Johnson",
      studentId: "S10045",
      grade: "5th Grade",
      medication: "Ibuprofen",
      dosage: "200mg",
      time: "12:00 PM",
      status: "pending",
      instructions: "For headache or fever above 100F",
    },
    {
      id: 2,
      studentName: "Thomas Johnson",
      studentId: "S10046",
      grade: "8th Grade",
      medication: "Albuterol",
      dosage: "90mcg, 2 puffs",
      time: "10:30 AM",
      status: "administered",
      administeredAt: "10:32 AM",
      administeredBy: "Nurse Sarah",
      notes: "Before PE class",
      instructions: "For asthma symptoms. May take before exercise.",
    },
    {
      id: 3,
      studentName: "Olivia Smith",
      studentId: "S10058",
      grade: "3rd Grade",
      medication: "Cetirizine",
      dosage: "5mg",
      time: "09:00 AM",
      status: "administered",
      administeredAt: "09:05 AM",
      administeredBy: "Nurse Sarah",
      notes: "",
      instructions: "For seasonal allergies. Take in the morning.",
    },
    {
      id: 4,
      studentName: "Michael Brown",
      studentId: "S10062",
      grade: "7th Grade",
      medication: "Methylphenidate",
      dosage: "10mg",
      time: "12:30 PM",
      status: "pending",
      instructions: "Take with lunch",
    },
    {
      id: 5,
      studentName: "Sophia Davis",
      studentId: "S10078",
      grade: "4th Grade",
      medication: "Insulin",
      dosage: "As per glucose reading",
      time: "11:45 AM",
      status: "pending",
      instructions: "Check blood sugar before administration",
    },
  ]);

  // Stats counters
  const stats = {
    total: medicationsToday.length,
    administered: medicationsToday.filter(
      (med) => med.status === "administered"
    ).length,
    pending: medicationsToday.filter((med) => med.status === "pending").length,
    missed: medicationsToday.filter((med) => med.status === "missed").length,
  };

  // Filter state
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTime, setFilterTime] = useState("all");

  // Filtered medications
  const filteredMedications = medicationsToday.filter((med) => {
    const statusMatch = filterStatus === "all" || med.status === filterStatus;

    let timeMatch = true;
    if (filterTime === "morning") {
      const hour = parseInt(med.time.split(":")[0]);
      const isPM = med.time.includes("PM");
      timeMatch = !isPM && hour < 12;
    } else if (filterTime === "midday") {
      const hour = parseInt(med.time.split(":")[0]);
      const isPM = med.time.includes("PM");
      timeMatch = (isPM && hour < 2) || (!isPM && hour === 12);
    } else if (filterTime === "afternoon") {
      const hour = parseInt(med.time.split(":")[0]);
      const isPM = med.time.includes("PM");
      timeMatch = isPM && hour >= 2;
    }

    return statusMatch && timeMatch;
  });
  // The handleAdminister functionality is now moved to MedicationAdministrationRecord component

  // Mark medication as skipped/missed
  const handleSkip = (id, reason) => {
    try {
      const now = new Date();
      const currentTime = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      // In a real app, this would include authentication to know who recorded it
      const nurseUser = "Nurse Sarah";

      setMedicationsToday(
        (prevMeds) =>
          prevMeds.map((med) =>
            med.id === id
              ? {
                ...med,
                status: "missed",
                administeredAt: currentTime,
                administeredBy: nurseUser,
                notes: reason || "No reason provided",
              }
              : med
          ));

      // Optional: Show success message
      alert("Thuốc đã được đánh dấu bỏ qua thành công");
    } catch (error) {
      console.error("Error skipping medication:", error);
      alert("Lỗi khi bỏ qua thuốc. Vui lòng thử lại.");
    }
  };

  // Custom function to handle medication administration directly from the dashboard
  const handleAdministerDirectly = (medicationId) => {
    try {
      // Use React Router's navigate function instead of window.location
      navigate(`/nurse/medications/administer/${medicationId}`);
    } catch (error) {
      console.error("Navigation error:", error);

      // Fallback to window.location if navigate fails
      try {
        window.location.href = `/nurse/medications/administer/${medicationId}`;
      } catch (fallbackError) {
        console.error("Fallback navigation failed:", fallbackError); alert(
          "Không thể điều hướng đến trang cấp thuốc. Vui lòng thử lại."
        );
      }
    }
  };

  // Add state for the details modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);

  // Function to open the details modal
  const openDetailsModal = (medication) => {
    setSelectedMedication(medication);
    setShowDetailsModal(true);
  };

  // Function to close the details modal
  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedMedication(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Bảng Điều Khiển Thuốc</h1>
          <p className="text-gray-600">{currentDate}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/nurse/medications/approval"
            className="flex items-center bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded transition duration-150 ease-in-out"
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>            Xem Lại Yêu Cầu
          </Link>
          <Link
            to="/nurse/medications/inventory"
            className="flex items-center bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded transition duration-150 ease-in-out"
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 002-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            Kho Thuốc
          </Link>{" "}
          <Link
            to="/nurse/medications/reports"
            className="flex items-center bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded transition duration-150 ease-in-out"
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z"
                clipRule="evenodd"
              />
            </svg>
            Báo Cáo
          </Link>
          <Link
            to="/nurse/medications/batch"
            className="flex items-center bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded transition duration-150 ease-in-out"
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Quản Lý Hàng Loạt
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center">
            <div>              <p className="text-sm font-medium text-gray-500">
              Tổng Liều Hôm Nay
            </p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg
                className="h-6 w-6 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Đã Cấp</p>
              <p className="text-3xl font-bold text-green-600">
                {stats.administered}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg
                className="h-6 w-6 text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Chờ Cấp</p>
              <p className="text-3xl font-bold text-blue-600">
                {stats.pending}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg
                className="h-6 w-6 text-blue-600"
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
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Bỏ Lỡ</p>
              <p className="text-3xl font-bold text-red-600">{stats.missed}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <svg
                className="h-6 w-6 text-red-600"
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
            </div>
          </div>
        </div>
      </div>

      {/* Filter controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6 bg-white rounded-lg shadow p-4">
        <div>
          <label
            htmlFor="filterStatus"
            className="block text-sm font-medium text-gray-700 mb-1"
          >            Lọc theo Trạng Thái:
          </label>
          <select
            id="filterStatus"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất Cả Trạng Thái</option>
            <option value="pending">Chờ Cấp</option>
            <option value="administered">Đã Cấp</option>
            <option value="missed">Bỏ Lỡ</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="filterTime"
            className="block text-sm font-medium text-gray-700 mb-1"
          >            Lọc theo Thời Gian:
          </label>
          <select
            id="filterTime"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={filterTime}
            onChange={(e) => setFilterTime(e.target.value)}
          >
            <option value="all">Tất Cả Thời Gian</option>
            <option value="morning">Buổi Sáng (Trước 12h)</option>
            <option value="midday">Buổi Trưa (12h-14h)</option>
            <option value="afternoon">Buổi Chiều (Sau 14h)</option>
          </select>
        </div>
      </div>

      {/* Medications Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>              <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >                Học Sinh
            </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Thuốc
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Thời Gian
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Trạng Thái
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Hành Động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMedications.length > 0 ? (
              filteredMedications.map((medication) => (
                <tr
                  key={medication.id}
                  className={
                    medication.status === "pending" ? "bg-white" : "bg-gray-50"
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {medication.studentName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {medication.grade} | ID: {medication.studentId}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {medication.medication}
                      </div>
                      <div className="text-sm text-gray-500">
                        {medication.dosage}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {medication.instructions}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {medication.time}
                    </div>
                    {medication.administeredAt && (
                      <div className="text-xs text-gray-500">
                        Đã Cấp: {medication.administeredAt}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${medication.status === "administered"
                          ? "bg-green-100 text-green-800"
                          : medication.status === "missed"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                    >                    {medication.status === "administered"
                      ? "Đã Cấp"
                      : medication.status === "pending"
                        ? "Chờ Cấp"
                        : "Bỏ Lỡ"}
                    </span>
                    {medication.notes && (
                      <div className="text-xs text-gray-500 mt-1">
                        Ghi Chú: {medication.notes}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {medication.status === "pending" ? (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleAdministerDirectly(medication.id)}
                          className="text-green-600 hover:text-green-900 flex items-center"
                        >
                          <svg
                            className="h-4 w-4 mr-1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>                          Ghi Nhận Cấp Thuốc
                        </button>
                        <button
                          onClick={() => {
                            const reason = window.prompt(
                              "Nhập lý do bỏ qua thuốc:"
                            );
                            if (reason !== null) {
                              handleSkip(medication.id, reason);
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Bỏ Qua
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => openDetailsModal(medication)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Xem Chi Tiết
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  Không tìm thấy thuốc nào với bộ lọc đã chọn.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Upcoming Schedule Summary */}
      {/* <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Upcoming Medication Schedule
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-700 mb-2">
              Morning (8-11 AM)
            </h3>
            <p className="text-3xl font-bold text-blue-600 mb-1">3</p>
            <p className="text-sm text-gray-500">2 administered, 1 pending</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-700 mb-2">
              Midday (11 AM-2 PM)
            </h3>
            <p className="text-3xl font-bold text-blue-600 mb-1">5</p>
            <p className="text-sm text-gray-500">1 administered, 4 pending</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-700 mb-2">
              Afternoon (2-4 PM)
            </h3>
            <p className="text-3xl font-bold text-blue-600 mb-1">2</p>
            <p className="text-sm text-gray-500">0 administered, 2 pending</p>
          </div>
        </div>
      </div> */}

      {/* Reports Overview */}
      {/* <div className="mt-8 bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Medication Reports Overview
          </h2>
          <Link
            to="/nurse/medications/reports"
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            View Detailed Reports
            <svg
              className="ml-1 w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-700 mb-2">Compliance Rate</h3>
            <div className="flex items-end">
              <p className="text-3xl font-bold text-green-600 mr-2">92%</p>
              <span className="text-sm text-gray-500 mb-1">Last 7 days</span>
            </div>
            <div className="mt-2 h-3 relative max-w-xl rounded-full overflow-hidden">
              <div className="w-full h-full bg-gray-200 absolute"></div>
              <div
                className="h-full bg-green-500 absolute"
                style={{ width: "92%" }}
              ></div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-700 mb-2">
              Medication Trends
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Most Administered:</p>
                <p className="font-medium">Ibuprofen (28%)</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Highest Compliance:</p>
                <p className="font-medium">Albuterol (96%)</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Most Missed:</p>
                <p className="font-medium">Methylphenidate (15%)</p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-700 mb-2">Inventory Status</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Low Stock:</p>
                <p className="font-medium text-amber-600">3 medications</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Expiring Soon:</p>
                <p className="font-medium text-red-600">2 medications</p>
              </div>
              <Link
                to="/nurse/medications/inventory"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Check Inventory
              </Link>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-700 mb-2">Student Focus</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Most Medications:</p>
                <p className="font-medium">Thomas Johnson (3)</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Missed Doses:</p>
                <p className="font-medium">Michael Brown (2)</p>
              </div>
              <Link
                to="/nurse/medications/reports"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Student Reports
              </Link>
            </div>
          </div>
        </div>
      </div> */}

      {/* Helper Info */}
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
          <div className="ml-3">            <p className="text-sm text-blue-700">
            Nhớ ghi chép bất kỳ tác dụng phụ nào quan sát được sau khi cấp thuốc.
            Nếu học sinh từ chối uống thuốc, hãy sử dụng nút Bỏ Qua và ghi rõ lý do.
          </p>
          </div>
        </div>
      </div>

      {/* Medication Details Modal */}
      {showDetailsModal && selectedMedication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">                <h2 className="text-2xl font-bold text-gray-800">
                Chi Tiết Hồ Sơ Thuốc
              </h2>
                <button
                  onClick={closeDetailsModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
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

              {/* Student Information */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <svg
                      className="h-6 w-6 text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">
                      {selectedMedication.studentName}
                    </h3>
                    <p className="text-gray-600">
                      {selectedMedication.grade} • ID: {selectedMedication.studentId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Medication Information */}
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>                  <h4 className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                  Thuốc
                </h4>
                  <p className="font-medium text-lg">
                    {selectedMedication.medication}
                  </p>
                  <p className="text-gray-600">{selectedMedication.dosage}</p>
                </div>

                <div>                  <h4 className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                  Trạng Thái
                </h4>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedMedication.status === "administered"
                        ? "bg-green-100 text-green-800"
                        : selectedMedication.status === "missed"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                  >                    {selectedMedication.status === "administered"
                    ? "Đã Cấp"
                    : selectedMedication.status === "pending"
                      ? "Chờ Cấp"
                      : "Bỏ Lỡ"}
                  </span>
                </div>

                <div>                  <h4 className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                  Giờ Định Sẵn
                </h4>
                  <p className="font-medium">{selectedMedication.time}</p>
                </div>

                {selectedMedication.administeredAt && (
                  <div>                    <h4 className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                    Đã Cấp Lúc
                  </h4>
                    <p className="font-medium">{selectedMedication.administeredAt}</p>
                  </div>
                )}

                {selectedMedication.administeredBy && (
                  <div>                    <h4 className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                    Được Cấp Bởi
                  </h4>
                    <p className="font-medium">{selectedMedication.administeredBy}</p>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="mb-6">                <h4 className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                Hướng Dẫn
              </h4>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-700">
                    {selectedMedication.instructions}
                  </p>
                </div>
              </div>

              {/* Notes */}
              {selectedMedication.notes && (
                <div className="mb-6">                  <h4 className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                  Ghi Chú Cấp Thuốc
                </h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-700">{selectedMedication.notes}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={closeDetailsModal}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded mr-2"
                >                  Đóng
                </button>
                <Link
                  to={`/nurse/medications/history/${selectedMedication.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                >
                  Lịch Sử Đầy Đủ
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicationDashboard;
