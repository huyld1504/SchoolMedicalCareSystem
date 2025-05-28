import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAllMedicalEvents,
  getFilteredMedicalEvents,
  eventTypes,
  severityLevels,
  statusOptions
} from "../../services/medicalEventService";

function MedicalEventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    eventType: "",
    severity: "",
    status: "",
    dateFrom: "",
    dateTo: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Tải sự kiện y tế khi component được mount
    loadEvents();
  }, []);

  const loadEvents = () => {
    setLoading(true);
    try {
      // Kiểm tra xem có bộ lọc nào đang kích hoạt không
      const hasActiveFilters = Object.values(filters).some(value => value !== "");

      // Lấy sự kiện đã lọc hoặc tất cả sự kiện
      const data = hasActiveFilters
        ? getFilteredMedicalEvents(filters)
        : getAllMedicalEvents();

      setEvents(data);
    } catch (error) {
      console.error("Lỗi khi tải sự kiện y tế:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    loadEvents();
  };

  const resetFilters = () => {
    setFilters({
      eventType: "",
      severity: "",
      status: "",
      dateFrom: "",
      dateTo: ""
    });
    // Đặt lại về tất cả sự kiện
    setEvents(getAllMedicalEvents());
  };

  const handleViewDetails = (eventId) => {
    navigate(`/nurse/medical-events/${eventId}`);
  };
  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'Minor':
        return 'bg-green-100 text-green-800';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Serious':
        return 'bg-orange-100 text-orange-800';
      case 'Severe':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-purple-100 text-purple-800';
      case 'Requires Follow-up':
        return 'bg-yellow-100 text-yellow-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Dịch mức độ nghiêm trọng
  const translateSeverity = (severity) => {
    switch (severity) {
      case 'Minor':
        return 'Nhẹ';
      case 'Moderate':
        return 'Trung bình';
      case 'Serious':
        return 'Nghiêm trọng';
      case 'Severe':
        return 'Rất nghiêm trọng';
      default:
        return severity;
    }
  };

  // Dịch trạng thái
  const translateStatus = (status) => {
    switch (status) {
      case 'Open':
        return 'Mở';
      case 'In Progress':
        return 'Đang xử lý';
      case 'Requires Follow-up':
        return 'Cần theo dõi';
      case 'Resolved':
        return 'Đã giải quyết';
      default:
        return status;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sự Kiện Y Tế</h1>
        <Link
          to="/nurse/medical-events/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          <i className="bi bi-plus-circle me-2"></i> Ghi Nhận Sự Kiện Mới
        </Link>
      </div>

      {/* Bộ lọc */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Bộ Lọc</h2>
        <form onSubmit={applyFilters}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại Sự Kiện</label>
              <select
                name="eventType"
                value={filters.eventType}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Tất Cả Loại</option>
                {eventTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mức Độ Nghiêm Trọng</label>
              <select
                name="severity"
                value={filters.severity}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Tất Cả Mức Độ</option>
                {severityLevels.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng Thái</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Tất Cả Trạng Thái</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Từ Ngày</label>
              <input
                type="date"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Đến Ngày</label>
              <input
                type="date"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="flex items-end space-x-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Áp Dụng Bộ Lọc
              </button>
              <button
                type="button"
                onClick={resetFilters}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Đặt Lại
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Danh sách sự kiện */}
      {loading ? (
        <div className="text-center py-8">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-2">Đang tải sự kiện y tế...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white p-8 rounded shadow text-center">
          <p className="text-lg text-gray-600">Không tìm thấy sự kiện y tế nào phù hợp với bộ lọc đã chọn.</p>
        </div>
      ) : (
        <div className="bg-white overflow-hidden shadow rounded">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Học Sinh</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sự Kiện</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày & Giờ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mức Độ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{event.studentName}</div>
                    <div className="text-sm text-gray-500">{event.grade} (ID: {event.studentId})</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{event.eventType}</div>
                    <div className="text-sm text-gray-500">{event.eventSubtype}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{event.date}</div>
                    <div className="text-sm text-gray-500">{event.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityClass(event.severity)}`}>
                      {translateSeverity(event.severity)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(event.status)}`}>
                      {translateStatus(event.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(event.id)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Xem
                    </button>
                    <Link
                      to={`/nurse/medical-events/${event.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Sửa
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MedicalEventsList;
