import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getMedicalEventById,
  updateMedicalEvent,
  deleteMedicalEvent
} from "../../services/medicalEventService";

function MedicalEventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    // Fetch the medical event details
    setLoading(true);
    try {
      const eventData = getMedicalEventById(parseInt(id));
      if (eventData) {
        setEvent(eventData);
      } else {
        setError("Medical event not found");
      }
    } catch (error) {
      console.error("Error fetching medical event:", error);
      setError("Failed to load medical event data");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleStatusChange = (newStatus) => {
    if (!event) return;

    try {
      // Update only the status field
      const updatedEvent = updateMedicalEvent(event.id, {
        ...event,
        status: newStatus
      });

      if (updatedEvent) {
        setEvent(updatedEvent);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update status");
    }
  };

  const handleDeleteConfirm = () => {
    setConfirmDelete(true);
  };

  const handleDeleteCancel = () => {
    setConfirmDelete(false);
  };

  const handleDelete = () => {
    try {
      const result = deleteMedicalEvent(event.id);
      if (result) {
        // Navigate back to the list after successful deletion
        navigate("/nurse/medical-events", {
          state: { message: "Medical event deleted successfully" }
        });
      } else {
        setError("Failed to delete medical event");
        setConfirmDelete(false);
      }
    } catch (error) {
      console.error("Error deleting medical event:", error);
      setError("An error occurred while deleting the medical event");
      setConfirmDelete(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading medical event data...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong className="font-bold">Error!</strong> {error || "Medical event not found"}
        </div>
        <button
          onClick={() => navigate("/nurse/medical-events")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Medical Events
        </button>
      </div>
    );
  }

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

  return (
    <div className="container mx-auto p-4">
      {/* Header with actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Medical Event Details</h1>
          <p className="text-gray-600">Viewing details for medical event #{event.id}</p>
        </div>

        <div className="mt-4 md:mt-0 flex space-x-2">
          <Link
            to={`/nurse/medical-events/${event.id}/edit`}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <i className="bi bi-pencil me-2"></i> Edit
          </Link>
          <button
            onClick={handleDeleteConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            <i className="bi bi-trash me-2"></i> Delete
          </button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete this medical event for {event.studentName}?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status and Severity Badges */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Event Status</h2>
            <div className="flex items-center">
              <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusClass(event.status)}`}>
                {event.status}
              </span>

              {/* Status update buttons */}
              <div className="ml-4">
                <div className="dropdown">
                  <button
                    className="btn btn-sm btn-outline-secondary dropdown-toggle"
                    type="button"
                    id="statusDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Update Status
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="statusDropdown">
                    <li><button className="dropdown-item" onClick={() => handleStatusChange('Open')}>Open</button></li>
                    <li><button className="dropdown-item" onClick={() => handleStatusChange('In Progress')}>In Progress</button></li>
                    <li><button className="dropdown-item" onClick={() => handleStatusChange('Requires Follow-up')}>Requires Follow-up</button></li>
                    <li><button className="dropdown-item" onClick={() => handleStatusChange('Resolved')}>Resolved</button></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-0">
            <h2 className="text-xl font-semibold mb-2">Severity</h2>
            <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getSeverityClass(event.severity)}`}>
              {event.severity}
            </span>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Event Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Student Information</h3>
            <p><strong>Name:</strong> {event.studentName}</p>
            <p><strong>ID:</strong> {event.studentId}</p>
            <p><strong>Grade:</strong> {event.grade}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Event Details</h3>
            <p><strong>Type:</strong> {event.eventType} - {event.eventSubtype}</p>
            <p><strong>Date & Time:</strong> {event.date} at {event.time}</p>
            <p><strong>Location:</strong> {event.location}</p>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="p-3 bg-gray-50 rounded">{event.description}</p>
          </div>
        </div>
      </div>
      {/* Treatment Information */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Điều trị</h2>

        {event.treatment ? (
          <div>
            <p className="p-3 bg-gray-50 rounded mb-4">{event.treatment}</p>
            <p><strong>Điều trị bởi:</strong> {event.treatmentBy || "Chưa xác định"}</p>
          </div>
        ) : (
          <p className="text-gray-500">Chưa có thông tin điều trị được ghi nhận.</p>
        )}
      </div>

      {/* Follow-up Information */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Thông tin theo dõi</h2>

        {event.followUpRequired ? (
          <div>
            <p><strong>Cần theo dõi:</strong> Có</p>
            {event.followUpDate && <p><strong>Ngày theo dõi:</strong> {event.followUpDate}</p>}
          </div>
        ) : (
          <p>Không cần theo dõi.</p>
        )}
      </div>

      {/* Parent Notification */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Thông báo phụ huynh</h2>

        {event.parentNotified ? (
          <div>
            <p><strong>Đã thông báo phụ huynh:</strong> Có</p>
            {event.notifiedAt && <p><strong>Thời gian thông báo:</strong> {event.notifiedAt}</p>}
            {event.notifiedBy && <p><strong>Thông báo bởi:</strong> {event.notifiedBy}</p>}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p>Chưa thông báo phụ huynh.</p>
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => {
                const updatedEvent = updateMedicalEvent(event.id, {
                  ...event,
                  parentNotified: true,
                  notifiedAt: new Date().toLocaleString(),
                  notifiedBy: "Current User" // In a real app, this would be the current user's name
                });

                if (updatedEvent) {
                  setEvent(updatedEvent);
                }
              }}
            >
              Đánh dấu đã thông báo
            </button>
          </div>
        )}
      </div>

      {/* Notes */}
      {event.notes && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Ghi chú bổ sung</h2>
          <p className="p-3 bg-gray-50 rounded">{event.notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => navigate("/nurse/medical-events")}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Trở về danh sách
        </button>

        <Link
          to={`/nurse/medical-events/${event.id}/edit`}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Chỉnh sửa sự kiện
        </Link>
      </div>
    </div>
  );
}

export default MedicalEventDetails;
