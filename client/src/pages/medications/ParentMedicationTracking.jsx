import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function ParentMedicationTracking() {
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
      lastAdministered: "2023-05-10 12:05 PM",
      remainingDoses: 5,
      instructions: "For headache or fever above 100F",
      administrationHistory: [
        {
          date: "2023-05-10",
          time: "12:05 PM",
          administered: true,
          notes: "Student reported headache",
        },
        {
          date: "2023-05-07",
          time: "11:30 AM",
          administered: true,
          notes: "Student reported headache before lunch",
        },
        {
          date: "2023-05-04",
          time: "02:15 PM",
          administered: true,
          notes: "Fever 100.2F",
        },
      ],
    },
    {
      id: 2,
      studentName: "Thomas Johnson",
      medication: "Albuterol",
      dosage: "90mcg, 2 puffs",
      frequency: "Every 4-6 hours as needed",
      startDate: "2023-01-15",
      endDate: "2023-12-31",
      status: "Low Supply",
      lastAdministered: "2023-05-10 10:32 AM",
      remainingDoses: 2,
      instructions: "For asthma symptoms. May take before exercise.",
      administrationHistory: [
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
      medication: "Cetirizine",
      dosage: "5mg",
      frequency: "Once daily",
      startDate: "2023-04-10",
      endDate: "2023-06-10",
      status: "Pending Approval",
      lastAdministered: null,
      remainingDoses: 30,
      instructions: "For seasonal allergies. Take in the morning.",
      administrationHistory: [],
    },
  ]);

  const [selectedMedication, setSelectedMedication] = useState(null);
  const [showRenew, setShowRenew] = useState(false);

  // Filter states
  const [filterStudent, setFilterStudent] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // New state for notifications
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Get unique students for filter
  const students = [...new Set(medications.map((med) => med.studentName))];

  // Filter medications
  const filteredMedications = medications.filter((med) => {
    const matchesStudent =
      filterStudent === "all" || med.studentName === filterStudent;
    const matchesStatus = filterStatus === "all" || med.status === filterStatus;

    return matchesStudent && matchesStatus;
  });

  // View medication details
  const handleViewMedication = (id) => {
    const medication = medications.find((med) => med.id === id);
    setSelectedMedication(medication);
  };

  // Request medication refill
  const handleRefillRequest = (id) => {
    // In a real app, this would send a request to the server
    alert("Refill request sent to the school nurse.");
  };

  // Cancel medication
  const handleCancelMedication = (id) => {
    if (
      window.confirm(
        "Are you sure you want to cancel this medication administration request?"
      )
    ) {
      // In a real app, this would send a request to the server
      setMedications(
        medications.map((med) =>
          med.id === id ? { ...med, status: "Cancelled" } : med
        )
      );

      // Update selected medication if it's currently being viewed
      if (selectedMedication && selectedMedication.id === id) {
        setSelectedMedication({ ...selectedMedication, status: "Cancelled" });
      }

      alert("Medication administration has been cancelled.");
    }
  };

  // Function to check for medication notifications
  useEffect(() => {
    const notificationsList = [];

    // Check for low supply medications
    medications.forEach((med) => {
      if (med.remainingDoses <= 3 && med.status !== "Cancelled") {
        notificationsList.push({
          id: `${med.id}-supply`,
          type: "warning",
          title: "Low Medication Supply",
          message: `${med.studentName}'s ${med.medication} is running low (${med.remainingDoses} doses left). Please send a refill.`,
          date: new Date().toLocaleDateString(),
          read: false,
          action: "refill",
          medicationId: med.id,
        });
      }

      // Check for medications about to expire (within 7 days)
      if (med.status !== "Cancelled") {
        const endDate = new Date(med.endDate);
        const today = new Date();
        const daysUntilExpiry = Math.floor(
          (endDate - today) / (1000 * 60 * 60 * 24)
        );

        if (daysUntilExpiry >= 0 && daysUntilExpiry <= 7) {
          notificationsList.push({
            id: `${med.id}-expiry`,
            type: "info",
            title: "Medication Expiring Soon",
            message: `${med.studentName}'s ${med.medication} will expire in ${daysUntilExpiry} days. Consider renewing if needed.`,
            date: new Date().toLocaleDateString(),
            read: false,
            action: "renew",
            medicationId: med.id,
          });
        }
      }
    });

    setNotifications(notificationsList);
  }, [medications]);

  // Mark notification as read
  const handleReadNotification = (notificationId) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Handle notification action
  const handleNotificationAction = (action, medicationId) => {
    if (action === "refill") {
      handleRefillRequest(medicationId);
    } else if (action === "renew") {
      const medication = medications.find((med) => med.id === medicationId);
      if (medication) {
        setSelectedMedication(medication);
        setShowRenew(true);
      }
    }

    // Mark notification as read
    const notificationId = notifications.find(
      (n) => n.medicationId === medicationId && n.action === action
    )?.id;

    if (notificationId) {
      handleReadNotification(notificationId);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {" "}
      <div className="mb-6 flex justify-between items-center">        <div>
        <h1 className="text-3xl font-bold mb-2">Thuốc của con em</h1>
        <p className="text-gray-600">
          Theo dõi và quản lý thuốc được uống tại trường
        </p>
      </div>
        <div className="flex items-center gap-3">
          {/* Notifications bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 relative"
            >
              <svg
                className="h-6 w-6 text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>

              {/* Notification count badge */}
              {notifications.filter((n) => !n.read).length > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.filter((n) => !n.read).length}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">                    <h3 className="font-medium text-gray-900">Thông báo</h3>
                    {notifications.filter((n) => !n.read).length > 0 && (
                      <button
                        onClick={() => {
                          setNotifications(
                            notifications.map((n) => ({ ...n, read: true }))
                          );
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Đánh dấu tất cả đã đọc
                      </button>
                    )}
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 ${!notification.read ? "bg-blue-50" : ""
                          }`}
                      >
                        <div className="flex items-start">
                          <div
                            className={`flex-shrink-0 rounded-full p-1 ${notification.type === "warning"
                                ? "bg-yellow-100"
                                : "bg-blue-100"
                              }`}
                          >
                            <svg
                              className={`h-5 w-5 ${notification.type === "warning"
                                  ? "text-yellow-600"
                                  : "text-blue-600"
                                }`}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              {notification.type === "warning" ? (
                                <path
                                  fillRule="evenodd"
                                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              ) : (
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1H9z"
                                  clipRule="evenodd"
                                />
                              )}
                            </svg>
                          </div>

                          <div className="ml-3 w-full">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              {notification.message}
                            </p>

                            <div className="mt-2 flex justify-between items-center">
                              <p className="text-xs text-gray-500">
                                {notification.date}
                              </p>

                              <button
                                onClick={() =>
                                  handleNotificationAction(
                                    notification.action,
                                    notification.medicationId
                                  )
                                }
                                className={`px-3 py-1 text-xs font-medium rounded-md ${notification.action === "refill"
                                    ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                    : "bg-green-100 text-green-800 hover:bg-green-200"
                                  }`}
                              >                                {notification.action === "refill"
                                ? "Yêu cầu bổ sung"
                                : "Gia hạn"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (<div className="p-4 text-center text-gray-500">
                    Không có thông báo nào vào lúc này
                  </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <Link
            to="/parent/medications/request"
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out"
          >
            <svg
              className="w-5 h-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Yêu cầu thuốc mới
          </Link>
        </div>
      </div>
      {/* Filter controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label
            htmlFor="filterStudent"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Lọc theo trẻ:
          </label>
          <select
            id="filterStudent"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={filterStudent}
            onChange={(e) => setFilterStudent(e.target.value)}
          >
            <option value="all">Tất cả trẻ em</option>
            {students.map((student, index) => (
              <option key={index} value={student}>
                {student}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="filterStatus"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Lọc theo trạng thái:
          </label>
          <select
            id="filterStatus"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >            <option value="all">Tất cả trạng thái</option>
            <option value="Active">Đang hoạt động</option>
            <option value="Low Supply">Sắp hết</option>
            <option value="Expired">Đã hết hạn</option>
            <option value="Pending Approval">Chờ phê duyệt</option>
            <option value="Cancelled">Đã hủy</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Medications List */}
        <div className="lg:w-1/2">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {filteredMedications.length > 0 ? (
                filteredMedications.map((medication) => (
                  <li
                    key={medication.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedMedication &&
                        selectedMedication.id === medication.id
                        ? "bg-blue-50"
                        : ""
                      }`}
                    onClick={() => handleViewMedication(medication.id)}
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {medication.studentName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {medication.medication}, {medication.dosage}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${medication.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : medication.status === "Low Supply"
                              ? "bg-yellow-100 text-yellow-800"
                              : medication.status === "Expired"
                                ? "bg-red-100 text-red-800"
                                : medication.status === "Cancelled"
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-blue-100 text-blue-800"
                          }`}
                      >
                        {medication.status}
                      </span>
                    </div>

                    <div className="mt-2 text-sm">
                      <div className="flex justify-between">                        <span className="text-gray-500">
                        Tần suất: {medication.frequency}
                      </span>
                        {medication.remainingDoses !== null && (
                          <span
                            className={`font-medium ${medication.remainingDoses <= 3
                                ? "text-red-600"
                                : "text-gray-600"
                              }`}
                          >
                            {medication.remainingDoses} liều còn lại
                          </span>
                        )}
                      </div>
                      {medication.lastAdministered && (
                        <p className="text-gray-500 mt-1">
                          Uống lần cuối: {medication.lastAdministered}
                        </p>
                      )}
                    </div>
                  </li>
                ))
              ) : (<li className="p-4 text-center text-gray-500">
                Không tìm thấy thuốc nào với bộ lọc đã chọn.
              </li>
              )}
            </ul>
          </div>
        </div>

        {/* Medication Details */}
        <div className="lg:w-1/2">
          {selectedMedication ? (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  {selectedMedication.medication}
                </h2>                <p className="text-sm text-gray-600">
                  Cho: {selectedMedication.studentName}
                </p>
              </div>

              <div className="px-6 py-4">
                {/* Current Status Banner */}
                <div
                  className={`rounded-md p-3 mb-4 ${selectedMedication.status === "Active"
                      ? "bg-green-50 border border-green-200"
                      : selectedMedication.status === "Low Supply"
                        ? "bg-yellow-50 border border-yellow-200"
                        : selectedMedication.status === "Expired"
                          ? "bg-red-50 border border-red-200"
                          : selectedMedication.status === "Cancelled"
                            ? "bg-gray-50 border border-gray-200"
                            : "bg-blue-50 border border-blue-200"
                    }`}
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className={`h-5 w-5 ${selectedMedication.status === "Active"
                            ? "text-green-400"
                            : selectedMedication.status === "Low Supply"
                              ? "text-yellow-400"
                              : selectedMedication.status === "Expired"
                                ? "text-red-400"
                                : selectedMedication.status === "Cancelled"
                                  ? "text-gray-400"
                                  : "text-blue-400"
                          }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        {selectedMedication.status === "Active" ? (
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        ) : selectedMedication.status === "Low Supply" ? (
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        ) : (
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        )}
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3
                        className={`text-sm font-medium ${selectedMedication.status === "Active"
                            ? "text-green-800"
                            : selectedMedication.status === "Low Supply"
                              ? "text-yellow-800"
                              : selectedMedication.status === "Expired"
                                ? "text-red-800"
                                : selectedMedication.status === "Cancelled"
                                  ? "text-gray-800"
                                  : "text-blue-800"
                          }`}
                      >
                        Status: {selectedMedication.status === "Active" ? "Đang hoạt động" :
                          selectedMedication.status === "Low Supply" ? "Sắp hết" :
                            selectedMedication.status === "Expired" ? "Đã hết hạn" :
                              selectedMedication.status === "Cancelled" ? "Đã hủy" :
                                selectedMedication.status === "Pending Approval" ? "Chờ phê duyệt" : selectedMedication.status}
                      </h3>
                      <div
                        className={`mt-2 text-sm ${selectedMedication.status === "Active"
                            ? "text-green-700"
                            : selectedMedication.status === "Low Supply"
                              ? "text-yellow-700"
                              : selectedMedication.status === "Expired"
                                ? "text-red-700"
                                : selectedMedication.status === "Cancelled"
                                  ? "text-gray-700"
                                  : "text-blue-700"
                          }`}
                      >                        {selectedMedication.status === "Low Supply" && (
                        <p>
                          Thuốc của con bạn sắp hết. Vui lòng gửi thuốc bổ sung
                          cho y tá trường sớm.
                        </p>
                      )}
                        {selectedMedication.status === "Pending Approval" && (
                          <p>
                            Yêu cầu thuốc này đang chờ phê duyệt từ
                            y tá trường.
                          </p>
                        )}
                        {selectedMedication.status === "Expired" && (
                          <p>
                            Thuốc này đã hết hạn. Vui lòng gửi yêu cầu thuốc mới
                            với đơn thuốc hiện tại.
                          </p>
                        )}
                        {selectedMedication.status === "Cancelled" && (
                          <p>
                            Việc sử dụng thuốc này đã bị hủy.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medication Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Dosage</p>
                    <p className="mt-1">{selectedMedication.dosage}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Frequency
                    </p>
                    <p className="mt-1">{selectedMedication.frequency}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Start Date
                    </p>
                    <p className="mt-1">{selectedMedication.startDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      End Date
                    </p>
                    <p className="mt-1">{selectedMedication.endDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Remaining Supply
                    </p>
                    <p
                      className={`mt-1 ${selectedMedication.remainingDoses <= 3
                          ? "text-red-600 font-medium"
                          : ""
                        }`}
                    >
                      {selectedMedication.remainingDoses !== null
                        ? `${selectedMedication.remainingDoses} doses`
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Last Administered
                    </p>
                    <p className="mt-1">
                      {selectedMedication.lastAdministered ||
                        "Not yet administered"}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-500">
                    Instructions
                  </p>
                  <p className="mt-1 text-gray-900">
                    {selectedMedication.instructions}
                  </p>
                </div>

                {/* Administration History */}
                {selectedMedication.administrationHistory.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-md font-semibold mb-3">
                      Recent Administration History
                    </h3>
                    <div className="bg-gray-50 rounded-md overflow-hidden">
                      <ul className="divide-y divide-gray-200">
                        {selectedMedication.administrationHistory.map(
                          (entry, index) => (
                            <li key={index} className="p-3">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium">
                                  {entry.date}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {entry.time}
                                </span>
                              </div>
                              {entry.notes && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {entry.notes}
                                </p>
                              )}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Renewal form appears conditionally */}
                {showRenew && selectedMedication.status !== "Cancelled" && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                    <h3 className="text-md font-semibold mb-3">
                      Renew Medication
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New Start Date
                        </label>
                        <input
                          type="date"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New End Date
                        </label>
                        <input
                          type="date"
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload New Prescription
                      </label>
                      <input
                        type="file"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setShowRenew(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
                        Submit Renewal
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-wrap gap-3">
                  {selectedMedication.status === "Low Supply" && (
                    <button
                      onClick={() => handleRefillRequest(selectedMedication.id)}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg
                        className="-ml-1 mr-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Request Refill
                    </button>
                  )}

                  {selectedMedication.status !== "Cancelled" &&
                    selectedMedication.status !== "Pending Approval" && (
                      <button
                        onClick={() => setShowRenew(!showRenew)}
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
                            d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {showRenew ? "Hide Renewal Form" : "Renew Medication"}
                      </button>
                    )}

                  {selectedMedication.status === "Active" && (
                    <Link
                      to={`/parent/medications/${selectedMedication.id}/schedule`}
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
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      View Schedule
                    </Link>
                  )}

                  {selectedMedication.status !== "Cancelled" && (
                    <button
                      onClick={() =>
                        handleCancelMedication(selectedMedication.id)
                      }
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <svg
                        className="-ml-1 mr-2 h-5 w-5 text-red-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Cancel Medication
                    </button>
                  )}
                </div>
              </div>
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
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No medication selected
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Select a medication from the list to view details, or request a
                new medication.
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Medication Info */}
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
              Please send medication refills to the school at least one week
              before your child runs out. All medications must be in their
              original containers with valid prescription labels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParentMedicationTracking;
