import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createMedicalEvent,
  getMedicalEventById,
  updateMedicalEvent,
  eventTypes,
  eventSubtypes,
  severityLevels,
  statusOptions
} from "../../services/medicalEventService";

function MedicalEventForm() {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Current date and time for defaults
  const currentDate = new Date().toISOString().split('T')[0];  const currentTime = new Date().toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  // Form state
  const [formData, setFormData] = useState({
    studentName: "",
    studentId: "",
    grade: "",
    eventType: "",
    eventSubtype: "",
    date: currentDate,
    time: currentTime,
    location: "",
    description: "",
    severity: "Minor",
    treatment: "",
    treatmentBy: "",
    followUpRequired: false,
    followUpDate: "",
    parentNotified: false,
    notifiedAt: "",
    notifiedBy: "",
    notes: "",
    status: "Open"
  });

  // Available subtypes based on selected event type
  const [availableSubtypes, setAvailableSubtypes] = useState([]);

  useEffect(() => {
    // If in edit mode, fetch the medical event data
    if (isEditMode) {
      setLoading(true);
      try {
        const eventData = getMedicalEventById(parseInt(id));        if (eventData) {
          setFormData(eventData);
          // Set available subtypes based on event type
          if (eventData.eventType) {
            setAvailableSubtypes(eventSubtypes[eventData.eventType] || []);
          }
        } else {
          setError("Không tìm thấy sự kiện y tế");
          navigate("/nurse/medical-events");
        }
      } catch (error) {
        console.error("Lỗi khi tải sự kiện y tế:", error);
        setError("Không thể tải dữ liệu sự kiện y tế");
      } finally {
        setLoading(false);
      }
    }
  }, [id, isEditMode, navigate]);

  // Update available subtypes when event type changes
  useEffect(() => {
    if (formData.eventType) {
      setAvailableSubtypes(eventSubtypes[formData.eventType] || []);
      // Reset subtype if current one is not valid for the new event type
      if (formData.eventSubtype && !eventSubtypes[formData.eventType]?.some(st => st.value === formData.eventSubtype)) {
        setFormData(prev => ({ ...prev, eventSubtype: "" }));
      }
    } else {
      setAvailableSubtypes([]);
    }
  }, [formData.eventType]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle checkbox inputs
    if (type === "checkbox") {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));

      // If parent notification checkbox is checked, set the notification time
      if (name === "parentNotified" && checked) {
        setFormData(prev => ({
          ...prev,
          notifiedAt: `${currentDate} ${currentTime}`
        }));
      }

      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {      // Validation
      if (!formData.studentName || !formData.eventType || !formData.severity || !formData.description) {
        throw new Error("Vui lòng điền đầy đủ các trường bắt buộc");
      }

      // Process the form data
      if (isEditMode) {
        // Update existing event
        const updatedEvent = updateMedicalEvent(parseInt(id), formData);
        if (updatedEvent) {
          setSuccess("Cập nhật sự kiện y tế thành công");
          // Navigate back to event list after a short delay
          setTimeout(() => navigate("/nurse/medical-events"), 1500);
        } else {
          throw new Error("Không thể cập nhật sự kiện y tế");
        }
      } else {
        // Create new event
        const newEvent = createMedicalEvent(formData);
        if (newEvent) {
          setSuccess("Ghi nhận sự kiện y tế thành công");
          // Navigate back to event list after a short delay
          setTimeout(() => navigate("/nurse/medical-events"), 1500);
        } else {          throw new Error("Không thể ghi nhận sự kiện y tế");
        }
      }} catch (error) {
      console.error("Lỗi khi gửi biểu mẫu:", error);
      setError(error.message || "Đã xảy ra lỗi khi gửi biểu mẫu");
    } finally {
      setSubmitting(false);
    }
  };if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
        <p className="mt-2">Đang tải dữ liệu sự kiện y tế...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {isEditMode ? "Chỉnh sửa Sự kiện Y tế" : "Ghi nhận Sự kiện Y tế Mới"}
        </h1>
        <p className="text-gray-600">
          {isEditMode
            ? "Cập nhật chi tiết sự kiện y tế này"
            : "Ghi nhận sự cố y tế hoặc sự kiện sức khỏe mới xảy ra trong trường"}
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong className="font-bold">Lỗi!</strong> {error}
        </div>
      )}      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <strong className="font-bold">Thành công!</strong> {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Information */}          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Thông tin Học sinh</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên học sinh <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã học sinh <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lớp
                </label>
                <input
                  type="text"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>          {/* Event Details */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Chi tiết Sự kiện</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại sự kiện <span className="text-red-500">*</span>
                </label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="">Chọn loại sự kiện</option>
                  {eventTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

          

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>                <label className="block text-sm font-medium text-gray-700 mb-1">
                Thời gian <span className="text-red-500">*</span>
              </label>
                <input
                  type="text"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  placeholder="VD: 9:30 AM"
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>                <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa điểm <span className="text-red-500">*</span>
              </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="VD: Sân chơi, Lớp học, Canteen"
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>                <label className="block text-sm font-medium text-gray-700 mb-1">
                Mức độ nghiêm trọng <span className="text-red-500">*</span>
              </label>
                <select
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  {severityLevels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">                <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả <span className="text-red-500">*</span>
              </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                ></textarea>
              </div>
            </div>
          </div>

          {/* Treatment Information */}
          <div className="md:col-span-2">            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Thông tin Điều trị</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phương pháp điều trị
                </label>
                <textarea
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Người điều trị
                </label>
                <input
                  type="text"
                  name="treatmentBy"
                  value={formData.treatmentBy}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Follow-up Information */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Thông tin Theo dõi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="followUpRequired"
                  name="followUpRequired"
                  checked={formData.followUpRequired}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-2"
                />
                <label htmlFor="followUpRequired" className="text-sm font-medium text-gray-700">
                  Cần theo dõi thêm
                </label>
              </div>              {formData.followUpRequired && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày theo dõi
                  </label>
                  <input
                    type="date"
                    name="followUpDate"
                    value={formData.followUpDate}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Parent Notification */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Thông báo Phụ huynh</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="parentNotified"
                  name="parentNotified"
                  checked={formData.parentNotified}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-2"
                />
                <label htmlFor="parentNotified" className="text-sm font-medium text-gray-700">
                  Đã thông báo phụ huynh
                </label>
              </div>

              {formData.parentNotified && (
                <>
                  <div>                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thời gian thông báo
                  </label>
                    <input
                      type="text"
                      name="notifiedAt"
                      value={formData.notifiedAt}
                      onChange={handleChange}
                      placeholder="VD: 2025-05-21 10:30 AM"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div>                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Người thông báo
                  </label>
                    <input
                      type="text"
                      name="notifiedBy"
                      value={formData.notifiedBy}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Additional Notes */}          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Ghi chú thêm</h2>
            <div>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Thông tin bổ sung hoặc các quan sát khác..."
              ></textarea>
            </div>
          </div>
        </div>
        {/* Form Actions */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/nurse/medical-events")}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            disabled={submitting}
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {isEditMode ? "Đang cập nhật..." : "Đang lưu..."}
              </>
            ) : (
              isEditMode ? "Cập nhật sự kiện" : "Ghi nhận sự kiện"
            )}
          </button>        </div>
      </form>
    </div>
  );
}

export default MedicalEventForm;
