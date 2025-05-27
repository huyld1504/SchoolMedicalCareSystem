import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getFollowUpEvents,
  getFilteredMedicalEvents
} from "../../services/medicalEventService";

function MedicalEventNotifications({ maxEvents = 5 }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    setLoading(true);
    try {
      // Get events requiring follow-up
      const followUpEvents = getFollowUpEvents();

      // Get urgent events (open and serious/severe severity)
      const urgentEvents = getFilteredMedicalEvents({
        status: "Open",
        // This will filter events with Serious or Severe severity
      }).filter(event =>
        event.severity === "Serious" || event.severity === "Severe"
      );

      // Combine and sort events
      const combinedEvents = [...followUpEvents, ...urgentEvents];

      // Remove duplicates (events that might be both follow-up and urgent)
      const uniqueEvents = Array.from(new Map(
        combinedEvents.map(event => [event.id, event])
      ).values());

      // Sort by date (most recent first)
      const sortedEvents = uniqueEvents.sort((a, b) =>
        new Date(b.date + " " + b.time) - new Date(a.date + " " + a.time)
      );

      // Take only the specified number of events
      setNotifications(sortedEvents.slice(0, maxEvents));
    } catch (error) {
      console.error("Error loading medical event notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeIcon = (eventType) => {
    switch (eventType) {
      case "Injury":
        return "bi-bandaid";
      case "Illness":
        return "bi-thermometer";
      case "Medical Condition":
        return "bi-heart-pulse";
      case "Infectious Disease":
        return "bi-virus";
      case "Allergic Reaction":
        return "bi-exclamation-triangle";
      default:
        return "bi-clipboard-pulse";
    }
  };

  const getSeverityClass = (severity) => {
    switch (severity) {
      case "Minor":
        return "bg-green-100 text-green-800";
      case "Moderate":
        return "bg-yellow-100 text-yellow-800";
      case "Serious":
        return "bg-orange-100 text-orange-800";
      case "Severe":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  if (loading) {
    return (
      <div className="p-3 text-center">
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <span className="ms-2">Đang tải thông báo...</span>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-3 text-center text-gray-500">
        Không có sự kiện y tế khẩn cấp cần chú ý
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <ul className="list-group list-group-flush">
        {notifications.map(event => (
          <li key={event.id} className="list-group-item px-0 py-3 border-bottom">
            <Link
              to={`/nurse/medical-events/${event.id}`}
              className="d-flex align-items-start text-decoration-none"
            >
              <div className={`me-3 rounded-circle p-2 ${getSeverityClass(event.severity)}`}>
                <i className={`bi ${getEventTypeIcon(event.eventType)}`}></i>
              </div>

              <div className="flex-grow-1">
                <div className="d-flex justify-content-between">
                  <h6 className="mb-0 text-body">
                    {event.eventType}: {event.studentName}
                  </h6>
                  <small className="text-muted ms-2">{event.date}</small>
                </div>

                <div className="mt-1 text-sm text-gray-600">
                  {event.description.substring(0, 80)}...
                </div>

                <div className="mt-1">
                  <span className={`badge ${getSeverityClass(event.severity)}`}>
                    {event.severity}
                  </span>
                  <span className="badge bg-blue-100 text-blue-800 ms-1">
                    {event.status}
                  </span>                  {event.followUpRequired && (
                    <span className="badge bg-purple-100 text-purple-800 ms-1">
                      Theo dõi
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="pt-2 pb-1 text-center">        <Link
        to="/nurse/medical-events"
        className="text-blue-600 hover:text-blue-800 text-sm"
      >
        Xem tất cả sự kiện y tế
      </Link>
      </div>
    </div>
  );
}

export default MedicalEventNotifications;
