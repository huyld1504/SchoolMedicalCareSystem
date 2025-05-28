import React, { useState } from "react";
import { Link } from "react-router-dom";

function HealthCheckCampaigns() {  // Dữ liệu demo cho các chiến dịch khám sức khỏe
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: "Khám sàng lọc thị lực và thính lực hàng năm",
      description: "Kiểm tra thị lực và thính lực định kỳ cho tất cả học sinh",
      targetGroup: "Tất cả học sinh",
      status: "Active",
      startDate: "2023-10-15",
      endDate: "2023-11-15",
      location: "Nhà thi đấu trường học",
      organizer: "Phòng Y tế Trường học",
      screeningTypes: ["Kiểm tra thị lực", "Kiểm tra thính lực"],
      consentRequired: true,
      consentDeadline: "2023-10-10",
      totalStudents: 250,
      consentsReceived: 220,
      checkupsCompleted: 150,
      // Thêm dữ liệu lịch trình theo ngày
      schedule: [
        {
          date: "2023-10-15",
          timeSlots: [{
            time: "9:00 SA - 11:00 SA",
            location: "Khu A nhà thi đấu",
            group: "Lớp 1",
            staffAssigned: "Bác sĩ Johnson",
          },
          {
            time: "1:00 CH - 3:00 CH",
            location: "Khu A nhà thi đấu",
            group: "Lớp 2",
            staffAssigned: "Bác sĩ Smith",
          },
          ],
        },
        {
          date: "2023-10-16",
          timeSlots: [{
            time: "9:00 SA - 11:00 SA",
            location: "Khu B nhà thi đấu",
            group: "Lớp 3",
            staffAssigned: "Bác sĩ Johnson",
          },
          {
            time: "1:00 CH - 3:00 CH",
            location: "Khu B nhà thi đấu",
            group: "Lớp 4",
            staffAssigned: "Bác sĩ Smith",
          },
          ],
        },
        {
          date: "2023-10-17",
          timeSlots: [{
            time: "9:00 SA - 11:00 SA",
            location: "Khu A nhà thi đấu",
            group: "Lớp 5",
            staffAssigned: "Bác sĩ Johnson",
          },
          {
            time: "1:00 CH - 3:00 CH",
            location: "Khu A nhà thi đấu",
            group: "Lớp 6",
            staffAssigned: "Bác sĩ Wilson",
          },
          ],
        },
      ],      // Thêm dữ liệu kết quả theo ngày
      dailyResults: [
        {
          date: "2023-10-15",
          completed: 60,
          scheduled: 65,
          issuesDetected: 5,
          notes: "5 học sinh được giới thiệu đi kiểm tra thị lực thêm",
        },
        {
          date: "2023-10-16",
          completed: 55,
          scheduled: 60,
          issuesDetected: 3,
          notes: "2 học sinh được giới thiệu đi khám thính học, 1 học sinh kiểm tra thị lực bổ sung",
        },
        {
          date: "2023-10-17",
          completed: 35,
          scheduled: 60,
          issuesDetected: 2,
          notes: "2 học sinh được giới thiệu kiểm tra thị lực bổ sung",
        },
      ],
    }, {
      id: 2,
      name: "Khám sàng lọc răng miệng",
      description: "Khám răng miệng cơ bản và giáo dục vệ sinh răng miệng",
      targetGroup: "Học sinh tiểu học",
      status: "Upcoming",
      startDate: "2023-12-01",
      endDate: "2023-12-10",
      location: "Phòng y tế trường học",
      organizer: "Hiệp hội Nha khoa Thành phố",
      screeningTypes: ["Khám răng miệng", "Giáo dục răng miệng"],
      consentRequired: true,
      consentDeadline: "2023-11-25",
      totalStudents: 120,
      consentsReceived: 85,
      checkupsCompleted: 0,
    },
    {
      id: 3,
      name: "Đánh giá tăng trưởng và chỉ số BMI",
      description: "Đo chiều cao, cân nặng và tính chỉ số BMI",
      targetGroup: "Tất cả học sinh",
      status: "Completed",
      startDate: "2023-02-05",
      endDate: "2023-02-20",
      location: "Phòng Giáo dục Thể chất",
      organizer: "Phòng Y tế Trường học",
      screeningTypes: ["Đo chiều cao & cân nặng", "Tính chỉ số BMI"],
      consentRequired: false,
      consentDeadline: null,
      totalStudents: 250,
      consentsReceived: 250,
      checkupsCompleted: 245,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [submittedConsentIds, setSubmittedConsentIds] = useState([]);

  // Filter campaigns based on search term and status
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.targetGroup.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && campaign.status === "Active") ||
      (filterStatus === "upcoming" && campaign.status === "Upcoming") ||
      (filterStatus === "completed" && campaign.status === "Completed");

    return matchesSearch && matchesStatus;
  });  // Format date function
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };
  // Translate status to Vietnamese
  const _translateStatus = (status) => {
    switch (status) {
      case "Active":
        return "Đang hoạt động";
      case "Upcoming":
        return "Sắp diễn ra";
      case "Completed":
        return "Đã hoàn thành";
      default:
        return status;
    }
  };

  // Xử lý hiển thị lịch trình
  const handleViewSchedule = (campaign) => {
    setSelectedCampaign(campaign);
    setShowScheduleModal(true);
  };

  // Xử lý hiển thị kết quả
  const handleViewResults = (campaign) => {
    setSelectedCampaign(campaign);
    setShowResultsModal(true);
  };

  // Xử lý submit consent form
  const handleSubmitConsent = (campaignId) => {
    // Cập nhật danh sách ID đã submit consent
    setSubmittedConsentIds([...submittedConsentIds, campaignId]);

    // Cập nhật số lượng consents received
    setCampaigns(
      campaigns.map((campaign) =>
        campaign.id === campaignId
          ? {
            ...campaign,
            consentsReceived: campaign.consentsReceived + 1,
          }
          : campaign
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">      <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">Các chiến dịch khám sức khỏe</h1>
      <p className="text-gray-600">
        Xem và phản hồi các đợt khám sàng lọc sức khỏe tại trường
      </p>
    </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <label htmlFor="search" className="sr-only">
              Tìm kiếm
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
                placeholder="Tìm kiếm chiến dịch khám sức khỏe"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="status" className="sr-only">
              Lọc theo trạng thái
            </label>
            <select
              id="status"
              name="status"
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tất cả chiến dịch</option>
              <option value="active">Đang hoạt động</option>
              <option value="upcoming">Sắp diễn ra</option>
              <option value="completed">Đã hoàn thành</option>
            </select>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      {filteredCampaigns.length > 0 ? (
        <div className="space-y-6">
          {filteredCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              {/* Campaign Header */}
              <div
                className={`px-6 py-4 border-l-4 ${campaign.status === "Active"
                  ? "border-green-500 bg-green-50"
                  : campaign.status === "Upcoming"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-500 bg-gray-50"
                  }`}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <h2 className="text-xl font-bold">{campaign.name}</h2>
                    <p className="text-gray-600">{campaign.description}</p>
                  </div>
                  <div className="mt-2 md:mt-0">                    <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${campaign.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : campaign.status === "Upcoming"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {_translateStatus(campaign.status)}
                  </span>
                  </div>
                </div>
              </div>

              {/* Campaign Details */}
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">                  <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Nhóm đối tượng
                  </h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {campaign.targetGroup}
                  </p>
                </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Loại khám sức khỏe
                    </h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {campaign.screeningTypes.join(", ")}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Thời gian chiến dịch
                    </h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatDate(campaign.startDate)} -{" "}
                      {formatDate(campaign.endDate)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Địa điểm
                    </h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {campaign.location}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Đơn vị tổ chức
                    </h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {campaign.organizer}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Cần đồng ý
                    </h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {campaign.consentRequired ? (
                        <span>
                          Có (Hạn cuối: {formatDate(campaign.consentDeadline)})
                        </span>
                      ) : (
                        "Không"
                      )}
                    </p>
                  </div>
                </div>

                {/* Campaign Actions - Cải thiện layout */}
                <div className="mt-6 flex flex-wrap justify-end gap-2">
                  {campaign.status === "Active" && campaign.consentRequired && (
                    submittedConsentIds.includes(campaign.id) ? (
                      <button
                        disabled
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 opacity-75 cursor-not-allowed"
                      >
                        <svg
                          className="-ml-1 mr-2 h-5 w-5"
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
                        Đã nộp đơn
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSubmitConsent(campaign.id)}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Nộp giấy đồng ý
                      </button>
                    )
                  )}

                 


                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Không tìm thấy chiến dịch khám sức khỏe nào
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== "all"
              ? "Hãy thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc."
              : "Hiện tại không có chiến dịch khám sức khỏe nào được lên kế hoạch."}
          </p>
        </div>
      )}

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
          <div className="ml-3">            <p className="text-sm text-blue-700">
            Khám sàng lọc sức khỏe định kỳ giúp phát hiện sớm các vấn đề sức khỏe tiềm ẩn
            và đảm bảo sức khỏe của học sinh. Vui lòng nộp giấy đồng ý trước hạn cuối
            để đảm bảo con em bạn có thể tham gia.
          </p>
          </div>
        </div>
      </div>

      {/* Schedule Modal - Cải thiện vị trí */}
      {showScheduleModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col relative mr-0 ml-auto my-8">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">              <h3 className="text-lg font-medium text-gray-900">
              {selectedCampaign.name} - Lịch trình
            </h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg
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

            <div className="p-6 overflow-auto flex-1">
              <div className="space-y-6">
                {selectedCampaign.schedule.map((day) => (
                  <div key={day.date} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-lg mb-3">
                      {formatDate(day.date)}
                    </h4>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>                            <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Thời gian
                          </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Nhóm
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Địa điểm
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Nhân viên
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {day.timeSlots.map((slot, index) => (
                            <tr
                              key={index}
                              className={
                                index % 2 === 0 ? "bg-white" : "bg-gray-50"
                              }
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {slot.time}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {slot.group}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {slot.location}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {slot.staffAssigned}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">              <button
              onClick={() => setShowScheduleModal(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Đóng
            </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Modal - Cải thiện vị trí */}
      {showResultsModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col relative mr-0 ml-auto my-8">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">              <h3 className="text-lg font-medium text-gray-900">
              {selectedCampaign.name} - Kết quả hàng ngày
            </h3>
              <button
                onClick={() => setShowResultsModal(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg
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

            <div className="p-6 overflow-auto flex-1">
              <div className="space-y-8">
                {selectedCampaign.dailyResults.map((result) => (
                  <div key={result.date} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-lg mb-3">
                      {formatDate(result.date)}
                    </h4>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">                        <span className="text-sm font-medium text-gray-700">
                        Tiến độ
                      </span>
                        <span className="text-sm font-medium text-gray-700">
                          {result.completed} / {result.scheduled} học sinh (
                          {Math.round((result.completed / result.scheduled) * 100)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-600 h-2.5 rounded-full"
                          style={{
                            width: `${Math.round(
                              (result.completed / result.scheduled) *
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="mt-4">                      <h5 className="text-sm font-medium text-gray-700 mb-2">
                      Tóm tắt
                    </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <div className="text-2xl font-bold text-blue-600">
                            {result.completed}
                          </div>                          <div className="text-xs text-gray-500">
                            Lượt khám hoàn thành
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <div className="text-2xl font-bold text-yellow-600">
                            {result.issuesDetected}
                          </div>
                          <div className="text-xs text-gray-500">
                            Vấn đề phát hiện
                          </div>
                        </div>
                      </div>

                      {result.notes && (
                        <div className="mt-4">                          <h5 className="text-sm font-medium text-gray-700 mb-1">
                          Ghi chú
                        </h5>
                          <p className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200">
                            {result.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">              <button
              onClick={() => setShowResultsModal(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Đóng
            </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HealthCheckCampaigns;
