import React, { useState } from "react";
import { Link } from "react-router-dom";

function MedicationApproval() {
  // Add state variables for prescription modal
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [currentPrescriptionImage, setCurrentPrescriptionImage] = useState("");

  // Demo data for medication requests
  const [medicationRequests, setMedicationRequests] = useState([{
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
    // Add a sample prescription image URL
    prescriptionImage: "https://i.imgur.com/7lXEIII.jpg",
    requestDate: "2023-04-28",
    status: "pending",
    parentName: "Sarah Johnson",
    parentPhone: "(555) 123-4567",
    consentToAdminister: true,
  }, {
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
    // Add a different sample prescription image
    prescriptionImage: "https://i.imgur.com/X5Nzn8I.jpg",
    requestDate: "2023-05-10",
    status: "pending",
    parentName: "Sarah Johnson",
    parentPhone: "(555) 123-4567",
    consentToAdminister: true,
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
    // Find the request to approve
    const requestToApprove = medicationRequests.find(req => req.id === id);    // Check if consent was provided
    if (requestToApprove && !requestToApprove.consentToAdminister) {
      alert("Lỗi: Không thể phê duyệt yêu cầu thuốc mà không có sự đồng ý của phụ huynh. Vui lòng yêu cầu sự đồng ý từ phụ huynh trước.");
      return;
    }

    setMedicationRequests(
      medicationRequests.map((request) =>
        request.id === id ? { ...request, status: "approved" } : request
      )
    );

    // Update selected request if it's currently being viewed
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest({ ...selectedRequest, status: "approved" });
    }

    alert("Yêu cầu thuốc đã được phê duyệt thành công.");
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

    alert("Yêu cầu thuốc đã bị từ chối.");
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

    alert("Thông tin bổ sung đã được yêu cầu từ phụ huynh.");
  };

  // Open prescription modal
  const handleOpenPrescription = (image) => {
    setCurrentPrescriptionImage(image);
    setShowPrescriptionModal(true);
  };

  // Close prescription modal
  const handleClosePrescription = () => {
    setCurrentPrescriptionImage("");
    setShowPrescriptionModal(false);
  };

  // Add this function to handle viewing prescriptions
  const handleViewPrescription = (imageUrl) => {
    setCurrentPrescriptionImage(imageUrl);
    setShowPrescriptionModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Phê duyệt Yêu cầu Thuốc</h1>
        <p className="text-gray-600">
          Xem xét và phê duyệt các yêu cầu cấp phát thuốc từ phụ huynh
        </p>
      </div>

      {/* Filter controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6">        <div>
          <label
            htmlFor="filterStatus"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Lọc theo Trạng thái:
          </label>
          <select
            id="filterStatus"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả Yêu cầu</option>
            <option value="pending">Chờ xử lý</option>
            <option value="approved">Đã phê duyệt</option>
            <option value="denied">Đã từ chối</option>
            <option value="info-requested">Yêu cầu Thông tin</option>
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
            Cấp phát Thuốc
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
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedRequest && selectedRequest.id === request.id
                        ? "bg-blue-50"
                        : ""
                      }`}
                    onClick={() => handleViewRequest(request.id)}
                  >                    <div className="flex justify-between">
                      <p className="font-medium text-gray-900">
                        {request.studentName}
                      </p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${request.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : request.status === "denied"
                              ? "bg-red-100 text-red-800"
                              : request.status === "info-requested"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                      >                        {request.status === "info-requested"
                          ? "Yêu cầu Thông tin"
                          : request.status === "pending"
                          ? "Chờ xử lý"
                          : request.status === "approved"
                          ? "Đã phê duyệt"
                          : request.status === "denied"
                          ? "Đã từ chối"
                          : request.status.charAt(0).toUpperCase() +
                          request.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">
                        {request.medication}, {request.dosage}
                      </p>
                      {request.consentToAdminister !== undefined && (
                        <span                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${request.consentToAdminister
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                            }`}
                          title={request.consentToAdminister ? "Phụ huynh đã đồng ý" : "Không có sự đồng ý của phụ huynh"}
                        >
                          {request.consentToAdminister ? "Đồng ý ✓" : "Không đồng ý ✗"}
                        </span>
                      )}
                    </div>                    <div className="mt-2 flex justify-between text-sm">
                      <p className="text-gray-500">
                        Yêu cầu: {request.requestDate}
                      </p>
                      <p className="text-gray-500">Lớp: {request.grade}</p>
                    </div>
                  </li>
                ))
              ) : (                <li className="p-4 text-center text-gray-500">
                  Không tìm thấy yêu cầu thuốc nào với bộ lọc đã chọn.
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
                </h2>                <p className="text-sm text-gray-600">
                  {selectedRequest.grade} | ID Học sinh:{" "}
                  {selectedRequest.studentId}
                </p>
              </div>

              <div className="px-6 py-4">                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Thuốc
                    </p>
                    <p className="mt-1">{selectedRequest.medication}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Liều lượng</p>
                    <p className="mt-1">{selectedRequest.dosage}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Tần suất
                    </p>
                    <p className="mt-1">{selectedRequest.frequency}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Thời gian trong Ngày
                    </p>
                    <p className="mt-1">
                      {selectedRequest.timeOfDay
                        .map((time) => {
                          const times = {
                            morning: "Sáng",
                            midday: "Trưa",
                            afternoon: "Chiều",
                            asNeeded: "Khi cần thiết",
                          };
                          return times[time] || time;
                        })
                        .join(", ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Ngày bắt đầu
                    </p>
                    <p className="mt-1">{selectedRequest.startDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Ngày kết thúc
                    </p>
                    <p className="mt-1">{selectedRequest.endDate}</p>
                  </div>
                </div>                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500">
                    Hướng dẫn Đặc biệt
                  </p>
                  <p className="mt-1 text-gray-900">
                    {selectedRequest.instructions || "Không có hướng dẫn"}
                  </p>
                </div>                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500">
                    Tài liệu Đơn thuốc
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
                          Đã tải lên đơn thuốc
                        </p>
                        <button
                          className="ml-4 text-blue-600 hover:text-blue-800 text-sm"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering parent click handlers
                            handleViewPrescription(selectedRequest.prescriptionImage);
                          }}
                        >
                          Xem Đơn thuốc
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
                        </svg>                        <p className="ml-2 text-yellow-600">
                          Chưa tải lên đơn thuốc
                        </p>
                      </div>
                    )}
                  </div>
                </div>                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500">
                    Liên hệ Phụ huynh
                  </p>
                  <p className="mt-1">
                    {selectedRequest.parentName} | {selectedRequest.parentPhone}
                  </p>
                </div>                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500">
                    Sự đồng ý của Phụ huynh
                  </p>
                  <div className="mt-1 flex items-center">
                    {selectedRequest.consentToAdminister ? (
                      <>
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
                        <span className="ml-2 text-green-600 font-medium">
                          Đã đồng ý
                        </span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="h-5 w-5 text-red-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="ml-2 text-red-600 font-medium">
                          Chưa đồng ý
                        </span>
                      </>
                    )}
                  </div>
                </div>                {selectedRequest.status === "denied" && (
                  <div className="mb-4 bg-red-50 p-3 rounded">
                    <p className="text-sm font-medium text-red-800">
                      Lý do Từ chối:
                    </p>
                    <p className="mt-1 text-red-700">
                      {selectedRequest.denialReason || "Không có lý do được cung cấp"}
                    </p>
                  </div>
                )}

                {selectedRequest.status === "info-requested" && (
                  <div className="mb-4 bg-yellow-50 p-3 rounded">
                    <p className="text-sm font-medium text-yellow-800">
                      Thông tin được Yêu cầu:
                    </p>
                    <p className="mt-1 text-yellow-700">
                      {selectedRequest.infoRequest ||
                        "Không có thông tin cụ thể được yêu cầu"}
                    </p>
                  </div>
                )}
              </div>

              {selectedRequest.status === "pending" && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex flex-wrap gap-3">                    <button
                    onClick={() => handleApproveRequest(selectedRequest.id)}
                    disabled={!selectedRequest.consentToAdminister}
                    className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${selectedRequest.consentToAdminister
                        ? "border-transparent text-white bg-green-600 hover:bg-green-700"
                        : "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                    title={!selectedRequest.consentToAdminister ? "Không thể phê duyệt mà không có sự đồng ý của phụ huynh" : "Phê duyệt yêu cầu thuốc"}
                  >
                    {selectedRequest.consentToAdminister ? (
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
                    ) : (
                      <svg
                        className="-ml-1 mr-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M13 16.5a1 1 0 01-.78.419l-3.22.21a1 1 0 01-1.1-.76L7.5 12.55a1 1 0 01.76-1.19L11.5 11a1 1 0 011.19.76l.5 3a1 1 0 01-.19 1.74z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M8.7 7.3a1 1 0 11-1.4 1.4 1 1 0 011.4-1.4z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5 10a5 5 0 1110 0 5 5 0 01-10 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {selectedRequest.consentToAdminister ? "Phê duyệt" : "Cần Đồng ý"}
                  </button>

                    <button                      onClick={() => {
                        const reason = prompt(
                          "Vui lòng nhập lý do từ chối yêu cầu thuốc này:"
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
                      Từ chối
                    </button>

                    <button                      onClick={() => {
                        const message = prompt(
                          "Bạn cần thông tin bổ sung gì từ phụ huynh?"
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
                      Yêu cầu Thông tin
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
              </svg>              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Chưa chọn yêu cầu
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Chọn một yêu cầu thuốc để xem chi tiết.
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
          <div className="ml-3">            <p className="text-sm text-blue-700">
              Xem xét yêu cầu thuốc một cách cẩn thận. Xác minh rằng đơn thuốc
              là hợp lệ và phù hợp để cấp phát tại trường. Liên hệ với
              phụ huynh hoặc nhà cung cấp dịch vụ chăm sóc sức khỏe nếu bạn cần thông tin bổ sung.
            </p>
          </div>
        </div>
      </div>

      {/* Prescription Modal */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Tài liệu Đơn thuốc</h3>
              <button
                onClick={() => setShowPrescriptionModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 flex-1 overflow-auto">
              {currentPrescriptionImage ? (
                <img
                  src={currentPrescriptionImage}
                  alt="Đơn thuốc"
                  className="w-full h-auto object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    // Fallback to a sample prescription image if URL fails
                    e.target.src = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUSExMWFhUXGBgYFxgYFxgXGBgYGhgYGBgYFxoYHSggHRolHRcYITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGy0lICYtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAKgBLAMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAFAAIDBAYBBwj/xABHEAACAQIEAwUEBwUGBAYDAAABAhEAAwQSITEFQVEGEyJhcTKBkaEUI0JSscHRB3KC4fAzYpKisvEkQ1NjFRZUc8LSJDVF/8QAGgEAAgMBAQAAAAAAAAAAAAAAAwQBAgUABv/EADIRAAICAQMCBAQFBAMBAAAAAAABAhEDEiExBEETIlFhcYGR8BShsdHhIzLB8UJSU2L/2gAMAwEAAhEDEQA/AEKY4r7RYeppriWOP3x8anayOhPwojw/h1p7SW2VSWA0JI+cwazF1UE95I0nglJVVlRceehKjzim3L9xupHrWlXgjASPCT0UfpUeO4atm3nMQJAO/wCNWXV45cMrLgmt2gDb4oyaOu3KdD+VDbHGXt+GYiiFjHKCNPiQPxrR4Zwu1fUvklgfaULv1mP51z6tKWnGn8yPw1rVkb+RTwvGbTkFxk/h8Pzo3h8VbcQriR0O9Zri3B1tDMp7xiR4eXvnSk2HNu3lXKSNBoD1+VOY02tsiFnUXTZrS9RtQS5xK4htBnBYEN7Rk6eFhtAgj3VQxGIu2wYdbiaSVaCR1IP41b6SalcrKvqox2ovf+Lj/wCmxHpHr6109p7Q+yCR1Gh/GgOHxl5ySGFsE/31+MD50Qwh0E6k786nNhUFa5FeNnnk/tRcuY62BqTI6Df5VXfFg6A0nu28U+yum+9MOLY5rbBVQHMOvuoUenyThfy/kOsfU4MUvL9Qet0fd+VPF8fcPwqL6UvQ/AfrUtnEW2OhHy/Wi+E0WEsck7aLI9KxGlcS2p2A+FS28OJ3mnxiT9gBTm+Wc1tRyp626ky/Cu+FduB+FWURR9kVLZaCELvZAQrBnMKfnTu6bpp50UrgSufho+gthIIwp6N8KZCdGFE+5peEcxTdA3UBS7YB2MUwOfOnuN8SfjUT221BHLao3XJDqXJZyU4U22ND769xxUgkJ06nmaaXcQBOvSPumoQy9KcGBp1CbZOtnVpZolQRrUKnL4YMmOcDY1KHqyYOULJVYUiajVqeGohmS5pUzNXtXs6ywK2PSucQEof3vwFdw2x9akxFvOhX01rMzL+tdGjhfkiXrKrt86j+igc6ltmKkCzSFhuPLgqZ9aIXOCpcTK6giIPpFVboA2NGcLdlDTw7hnFMLZLOCcsFspIMgDSDMEaiRQZuDW7SOzNcYlQSCcqanZQQIgHf3UWwHEe+LqVyFYkSYkGNgRIO9UMJgmxSXLNx80GQRpIMgj0I2p3Jillg4y4CN1OLvgp4fAm4wtq5RW09AmuvvozwfguS81stmKbZxGb";
                  }}
                />
              ) : (
                <div className="text-center text-gray-500">
                  <p>Không có hình ảnh đơn thuốc.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicationApproval;
