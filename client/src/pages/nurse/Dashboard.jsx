import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

function NurseDashboard() {
  const { currentUser } = useAuth();
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [hiddenTasks, setHiddenTasks] = useState([]);

  // Sample data for school nurse dashboard
  const todayStats = {
    visitCount: 15,
    medicationAdmins: 28,
    pendingRequests: 3,
    absentStudents: 12,
  };
  const recentIncidents = [
    {
      id: 1,
      studentName: "Mia Chen",
      grade: "Lớp 3",
      issue: "Chấn thương nhẹ (trầy xước đầu gối)",
      time: "10:15 AM",
      status: "Đã điều trị",
    },
    {
      id: 2,
      studentName: "James Rodriguez",
      grade: "Lớp 7",
      issue: "Sốt (100.4°F)",
      time: "9:30 AM",
      status: "Cho về nhà",
    },
    {
      id: 3,
      studentName: "Sarah Kim",
      grade: "Lớp 4",
      issue: "Đau đầu",
      time: "11:20 AM",
      status: "Đang nghỉ ngơi",
    },
  ];
  const upcomingTasks = [
    {
      id: 1,
      task: "Cấp thuốc cho Lucas White",
      time: "12:30 PM",
      priority: "Cao",
    },
    {
      id: 2,
      task: "Khám thị lực cho lớp 5",
      time: "1:00 PM",
      priority: "Trung bình",
    },
    {
      id: 3,
      task: "Xem xét các mẫu đơn thuốc mới",
      time: "3:00 PM",
      priority: "Trung bình",
    },
    {
      id: 4,
      task: "Chuẩn bị vật tư phòng tiêm chủng",
      time: "4:00 PM",
      priority: "Cao",
    },
  ]; const stockAlerts = [
    { id: 1, item: "Băng dán", status: "Sắp hết", level: "15%", current: 15, total: 100, unit: "hộp" },
    { id: 2, item: "Ibuprofen", status: "Sắp hết", level: "20%", current: 20, total: 100, unit: "viên" },
    { id: 3, item: "Túi chườm lạnh", status: "Đủ", level: "60%", current: 60, total: 100, unit: "túi" },
  ];
  // Full schedule data
  const fullSchedule = [
    {
      id: 1,
      task: "Cấp thuốc cho Lucas White",
      time: "12:30 PM",
      priority: "Cao",
      date: "Hôm nay",
    },
    {
      id: 2,
      task: "Khám thị lực cho lớp 5",
      time: "1:00 PM",
      priority: "Trung bình",
      date: "Hôm nay",
    },
    {
      id: 3,
      task: "Xem xét các mẫu đơn thuốc mới",
      time: "3:00 PM",
      priority: "Trung bình",
      date: "Hôm nay",
    },
    {
      id: 4,
      task: "Chuẩn bị vật tư phòng tiêm chủng",
      time: "4:00 PM",
      priority: "Cao",
      date: "Hôm nay",
    },
    {
      id: 5,
      task: "Họp y tế hàng tuần với hiệu trưởng",
      time: "9:00 AM",
      priority: "Trung bình",
      date: "Ngày mai",
    },
    {
      id: 6,
      task: "Khám răng cho lớp 3",
      time: "10:30 AM",
      priority: "Trung bình",
      date: "Ngày mai",
    },
    {
      id: 7,
      task: "Cập nhật hồ sơ sức khỏe học sinh",
      time: "1:00 PM",
      priority: "Cao",
      date: "23 tháng 5, 2025",
    },
    {
      id: 8,
      task: "Gia hạn chứng chỉ CPR hàng năm",
      time: "9:00 AM",
      priority: "Cao",
      date: "24 tháng 5, 2025",
    },
  ];

  // Function to toggle task completion status
  const toggleTaskCompletion = (taskId) => {
    setCompletedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  // Function to hide a task
  const hideTask = (taskId) => {
    setHiddenTasks((prev) => [...prev, taskId]);
  };

  // Function to close the schedule modal
  const closeFullSchedule = () => {
    setShowFullSchedule(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bảng điều khiển Y tá</h1>
        <p className="text-gray-600">Chào mừng trở lại, {currentUser?.name}</p>
      </div>
      {/* Statistics Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm uppercase font-semibold">
            Clinic Visits Today
          </h3>
          <div className="flex items-center mt-2">
            <div className="text-3xl font-bold">{todayStats.visitCount}</div>
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              +3 from yesterday
            </span>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm uppercase font-semibold">
            Medications Administered
          </h3>
          <div className="flex items-center mt-2">
            <div className="text-3xl font-bold">
              {todayStats.medicationAdmins}
            </div>
            <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              On track
            </span>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm uppercase font-semibold">
            Pending Requests
          </h3>
          <div className="flex items-center mt-2">
            <div className="text-3xl font-bold">
              {todayStats.pendingRequests}
            </div>
            <Link
              to="/nurse/medications/approval"
              className="ml-2 text-yellow-800 text-sm underline"
            >
              Review now
            </Link>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm uppercase font-semibold">
            Absent Students
          </h3>
          <div className="flex items-center mt-2">
            <div className="text-3xl font-bold">
              {todayStats.absentStudents}
            </div>
            <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              3 due to illness
            </span>
          </div>
        </div>
      </div> */}

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        {/* Recent Incidents - Full width */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col h-[600px]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Sự cố gần đây</h2>
          </div>
          <div className="overflow-y-auto flex-1">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Học sinh
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Vấn đề
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Thời gian
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentIncidents.map((incident) => (
                    <tr key={incident.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {incident.studentName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {incident.grade}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {incident.issue}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {incident.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${incident.status === "Đã điều trị"
                            ? "bg-green-100 text-green-800"
                            : incident.status === "Cho về nhà"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {incident.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/nurse/events/new"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out mr-2"
            >
              Ghi lại sự cố mới
            </Link>
            <Link
              to="/nurse/events"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out"
            >
              Xem danh sách sự kiện
            </Link>
          </div>
        </div>
      </div>

      {/* Upcoming Tasks */}
      {/* <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Nhiệm vụ sắp tới</h2>
          <ul className="divide-y divide-gray-200">
            {upcomingTasks.map((task) => (
              <li key={task.id} className="py-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">{task.time}</span>
                </div>
                <p className="mt-1">{task.task}</p>
              </li>
            ))}
          </ul>          <button
            onClick={() => setShowFullSchedule(true)}
            className="block w-full mt-4 text-center text-blue-600 hover:text-blue-800"
          >
            Xem lịch trình đầy đủ →
          </button>
        </div> */}
      {/* Full Schedule Modal */}
      {showFullSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Lịch trình đầy đủ</h2>
                <button
                  onClick={closeFullSchedule}
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

              <div className="divide-y divide-gray-200">
                {Object.entries(
                  fullSchedule
                    .filter((task) => !hiddenTasks.includes(task.id))
                    .reduce((acc, task) => {
                      if (!acc[task.date]) acc[task.date] = [];
                      acc[task.date].push(task);
                      return acc;
                    }, {})
                ).map(([date, tasks]) => (
                  <div key={date} className="py-4">
                    <h3 className="font-semibold text-lg mb-2">{date}</h3>
                    <ul className="space-y-3">
                      {tasks.map((task) => (
                        <li
                          key={task.id}
                          className={`bg-gray-50 p-3 rounded-lg ${completedTasks.includes(task.id) ? "bg-green-50" : ""
                            }`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={completedTasks.includes(task.id)}
                                onChange={() => toggleTaskCompletion(task.id)}
                                className="h-4 w-4 text-blue-600 rounded border-gray-300 mr-3"
                              />
                              <span
                                className={`font-medium ${completedTasks.includes(task.id)
                                  ? "line-through text-gray-500"
                                  : ""
                                  }`}
                              >
                                {task.time}
                              </span>
                            </div>
                            <button
                              onClick={() => hideTask(task.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
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
                          <p
                            className={`mt-1 pl-7 ${completedTasks.includes(task.id)
                              ? "line-through text-gray-500"
                              : ""
                              }`}
                          >
                            {task.task}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeFullSchedule}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Hành động nhanh</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Convert anchor tags to Link components */}
            <Link
              to="/nurse/medications/dashboard"
              className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
            >
              <h3 className="font-medium">Bảng điều khiển thuốc</h3>
              <p className="text-sm text-gray-600 mt-1">
                Xem và quản lý tất cả thuốc
              </p>
            </Link>
            <Link
              to="/nurse/medications/admin"
              className="block p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
            >
              <h3 className="font-medium">Cấp thuốc</h3>
              <p className="text-sm text-gray-600 mt-1">
                Ghi lại thuốc đã cấp cho học sinh
              </p>
            </Link>
            <Link
              to="/nurse/medications/approval"
              className="block p-4 bg-green-50 hover:bg-green-100 rounded-lg transition"
            >
              <h3 className="font-medium">Xem xét yêu cầu thuốc</h3>
              <p className="text-sm text-gray-600 mt-1">
                Phê duyệt các yêu cầu thuốc đang chờ
              </p>
            </Link>
            <Link
              to="/nurse/health-checks"
              className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
            >
              <h3 className="font-medium">Khám sức khỏe</h3>
              <p className="text-sm text-gray-600 mt-1">
                Quản lý các cuộc khám sàng lọc sức khỏe đã lên lịch
              </p>
            </Link>
            <Link
              to="/nurse/vaccinations"
              className="block p-4 bg-green-50 hover:bg-green-100 rounded-lg transition"
            >
              <h3 className="font-medium">Chương trình tiêm chủng</h3>
              <p className="text-sm text-gray-600 mt-1">
                Xem và quản lý các chiến dịch tiêm chủng
              </p>
            </Link>
          </div>
        </div>
        {/* Inventory Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Tình trạng kho</h2>
            <Link
              to="/nurse/medications/inventory"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Quản lý kho
            </Link>
          </div>

          <ul className="divide-y divide-gray-200">
            {stockAlerts.map((item) => (
              <li
                key={item.id}
                className="py-3 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-medium">{item.item}</h3>
                  <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full
                    ${item.status === "Sắp hết"
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="w-24">
                  <div className="bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${item.status === "Sắp hết"
                          ? "bg-red-600"
                          : "bg-green-600"
                        }`}
                      style={{ width: item.level }}
                    ></div>
                  </div>
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {item.level}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <Link
            to="/nurse/medications/inventory/order"
            className="block mt-4 text-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out"
          >
            Đặt hàng vật tư
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NurseDashboard;