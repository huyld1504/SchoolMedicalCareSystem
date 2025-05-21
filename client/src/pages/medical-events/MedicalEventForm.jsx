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
  const currentDate = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toLocaleTimeString('en-US', { 
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
        const eventData = getMedicalEventById(parseInt(id));
        if (eventData) {
          setFormData(eventData);
          // Set available subtypes based on event type
          if (eventData.eventType) {
            setAvailableSubtypes(eventSubtypes[eventData.eventType] || []);
          }
        } else {
          setError("Medical event not found");
          navigate("/nurse/medical-events");
        }
      } catch (error) {
        console.error("Error fetching medical event:", error);
        setError("Failed to load medical event data");
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
    
    try {
      // Validation
      if (!formData.studentName || !formData.eventType || !formData.severity || !formData.description) {
        throw new Error("Please fill all required fields");
      }
      
      // Process the form data
      if (isEditMode) {
        // Update existing event
        const updatedEvent = updateMedicalEvent(parseInt(id), formData);
        if (updatedEvent) {
          setSuccess("Medical event updated successfully");
          // Navigate back to event list after a short delay
          setTimeout(() => navigate("/nurse/medical-events"), 1500);
        } else {
          throw new Error("Failed to update medical event");
        }
      } else {
        // Create new event
        const newEvent = createMedicalEvent(formData);
        if (newEvent) {
          setSuccess("Medical event recorded successfully");
          // Navigate back to event list after a short delay
          setTimeout(() => navigate("/nurse/medical-events"), 1500);
        } else {
          throw new Error("Failed to record medical event");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(error.message || "An error occurred while submitting the form");
    } finally {
      setSubmitting(false);
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
  
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {isEditMode ? "Edit Medical Event" : "Record New Medical Event"}
        </h1>
        <p className="text-gray-600">
          {isEditMode 
            ? "Update the details of this medical event" 
            : "Record a new medical incident or health event that occurred in the school"}
        </p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong className="font-bold">Error!</strong> {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <strong className="font-bold">Success!</strong> {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Information */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Student Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade
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
          </div>
          
          {/* Event Details */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Event Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="">Select Event Type</option>
                  {eventTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Subtype
                </label>
                <select
                  name="eventSubtype"
                  value={formData.eventSubtype}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  disabled={!formData.eventType}
                >
                  <option value="">Select Subtype</option>
                  {availableSubtypes.map(subtype => (
                    <option key={subtype.value} value={subtype.value}>{subtype.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date <span className="text-red-500">*</span>
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  placeholder="e.g., 9:30 AM"
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Playground, Classroom, Cafeteria"
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Severity <span className="text-red-500">*</span>
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
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
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
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Treatment Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Treatment Provided
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
                  Treated By
                </label>
                <input
                  type="text"
                  name="treatmentBy"
                  value={formData.treatmentBy}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
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
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Follow-up Information</h2>
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
                  Follow-up Required
                </label>
              </div>
              
              {formData.followUpRequired && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Follow-up Date
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
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Parent Notification</h2>
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
                  Parent Notified
                </label>
              </div>
              
              {formData.parentNotified && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notified At
                    </label>
                    <input
                      type="text"
                      name="notifiedAt"
                      value={formData.notifiedAt}
                      onChange={handleChange}
                      placeholder="e.g., 2025-05-21 10:30 AM"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notified By
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
          
          {/* Additional Notes */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Additional Notes</h2>
            <div>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Any additional information or observations..."
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
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {isEditMode ? "Updating..." : "Saving..."}
              </>
            ) : (
              isEditMode ? "Update Event" : "Record Event"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MedicalEventForm;
