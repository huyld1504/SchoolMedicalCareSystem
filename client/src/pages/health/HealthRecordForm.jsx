import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function HealthRecordForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(id ? true : false);
  const [isEditMode, setIsEditMode] = useState(!!id);
  const [activeTab, setActiveTab] = useState(1);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Student Personal Information
    firstName: "", // Using firstName field for full name
    dateOfBirth: "",
    gender: "",
    grade: "",
    class: "",
    studentId: "",
    photo: null,

    // Medical Background
    bloodType: "",
    height: "",
    weight: "",
    allergies: [],
    chronicConditions: [],

    // Vision and Hearing
    visionLeft: "",
    visionRight: "",
    wearGlasses: false,
    hearingLeft: "",
    hearingRight: "",
    hearingAid: false,

    // Vaccination History
    vaccinations: [],

    // Medical Treatment History
    treatments: [],    // Emergency Contacts
    emergencyContacts: [{ name: "", relationship: "", otherRelationship: "", phone: "", email: "" }],

    // Medical Coverage
    insuranceProvider: "",
    insuranceNumber: "",
    familyDoctor: "",
    doctorPhone: "",

    // Consent
    consentEmergencyTreatment: false,
    consentMedicationAdmin: false,
    consentInformationSharing: false,
  });

  // Fetch student health record data for editing
  useEffect(() => {
    if (isEditMode) {
      // Simulate API fetch for health record data
      // In a real application, you would fetch from your backend
      const mockStudentRecords = {
        1: {
          // Student Personal Information
          firstName: "Emma Johnson",
          dateOfBirth: "2013-05-10",
          gender: "female",
          grade: "5th Grade",
          class: "5A",
          studentId: "STU-2023-001",
          photoUrl: null,
  
          // Medical Background
          bloodType: "A+",
          height: "145",
          weight: "38",
          allergies: ["Peanuts", "Dust mites"],
          chronicConditions: ["Asthma"],
  
          // Vision and Hearing
          visionLeft: "20/25",
          visionRight: "20/25",
          wearGlasses: true,
          hearingLeft: "normal",
          hearingRight: "normal",
          hearingAid: false,
  
          // Vaccination History
          vaccinations: ["MMR", "Tetanus", "Polio", "Hepatitis B"],
  
          // Medical Treatment History
          treatments: ["Asthma medication - prescribed Jan 2023"],
  
          // Emergency Contacts
          emergencyContacts: [
            {
              name: "Michael Johnson",
              relationship: "parent",
              otherRelationship: "",
              phone: "555-123-4567",
              email: "michael.johnson@example.com",
            },
            {
              name: "Susan Johnson",
              relationship: "parent",
              otherRelationship: "",
              phone: "555-987-6543",
              email: "susan.johnson@example.com",
            },
          ],
  
          // Medical Coverage
          insuranceProvider: "HealthPlus Insurance",
          insuranceNumber: "HP-98765432",
          familyDoctor: "Dr. Sarah Williams",
          doctorPhone: "555-222-3333",
  
          // Consent
          consentEmergencyTreatment: true,
          consentMedicationAdmin: true,
          consentInformationSharing: true,
        },
        2: {
          firstName: "Thomas Johnson",
          dateOfBirth: "2010-03-15",
          gender: "male",
          grade: "8th Grade",
          class: "8B",
          studentId: "STU-2023-002",
          photoUrl: null,
          bloodType: "O+",
          height: "162",
          weight: "52",
          allergies: ["Shellfish"],
          chronicConditions: ["ADHD"],
          visionLeft: "20/20",
          visionRight: "20/20",
          wearGlasses: false,
          hearingLeft: "normal",
          hearingRight: "normal",
          hearingAid: false,
          vaccinations: ["MMR", "Tetanus", "Polio", "Hepatitis B", "HPV"],
          treatments: ["ADHD medication - prescribed Sep 2022"],
          emergencyContacts: [
            {
              name: "Michael Johnson",
              relationship: "parent",
              otherRelationship: "",
              phone: "555-123-4567",
              email: "michael.johnson@example.com",
            },
          ],
          insuranceProvider: "HealthPlus Insurance",
          insuranceNumber: "HP-98765433",
          familyDoctor: "Dr. Sarah Williams",
          doctorPhone: "555-222-3333",
          consentEmergencyTreatment: true,
          consentMedicationAdmin: true,
          consentInformationSharing: true,
        },
        3: {
          firstName: "Olivia Smith",
          dateOfBirth: "2015-07-20",
          gender: "female",
          grade: "3rd Grade",
          class: "3C",
          studentId: "STU-2023-003",
          photoUrl: null,
          bloodType: "B-",
          height: "135",
          weight: "30",
          allergies: ["Bee stings", "Penicillin"],
          chronicConditions: [],
          visionLeft: "20/30",
          visionRight: "20/30",
          wearGlasses: true,
          hearingLeft: "mild_loss",
          hearingRight: "normal",
          hearingAid: false,
          vaccinations: ["MMR", "Tetanus", "Polio"],
          treatments: ["EpiPen for bee sting allergy"],
          emergencyContacts: [
            {
              name: "James Smith",
              relationship: "parent",
              otherRelationship: "",
              phone: "555-444-5555",
              email: "james.smith@example.com",
            },
            {
              name: "Mary Smith",
              relationship: "parent",
              otherRelationship: "",
              phone: "555-666-7777",
              email: "mary.smith@example.com",
            },
            {
              name: "Robert Smith",
              relationship: "grandparent",
              otherRelationship: "",
              phone: "555-888-9999",
              email: "robert.smith@example.com",
            },
          ],
          insuranceProvider: "MediCare Plus",
          insuranceNumber: "MC-12345678",
          familyDoctor: "Dr. John Davis",
          doctorPhone: "555-111-2222",
          consentEmergencyTreatment: true,
          consentMedicationAdmin: true,
          consentInformationSharing: false,
        },
      };

      setTimeout(() => {
        const studentRecord = mockStudentRecords[id];
        if (studentRecord) {
          // Update form with student record data
          setFormData({
            ...formData,
            ...studentRecord
          });
        }
        setLoading(false);
      }, 500);
    }
  }, [id, isEditMode]);

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleArrayInput = (field, value) => {
    if (value.trim() !== "") {
      // Check if the value already exists in the array (case insensitive)
      const valueExists = formData[field].some(
        item => item.toLowerCase() === value.trim().toLowerCase()
      );
      
      if (!valueExists) {
        setFormData((prev) => ({
          ...prev,
          [field]: [...prev[field], value.trim()],
        }));
      }
    }
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleContactChange = (index, field, value) => {
    const updatedContacts = [...formData.emergencyContacts];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
    setFormData((prev) => ({
      ...prev,
      emergencyContacts: updatedContacts,
    }));
  };

  const addContact = () => {
    setFormData((prev) => ({
      ...prev,      emergencyContacts: [
        ...prev.emergencyContacts,
        { name: "", relationship: "", otherRelationship: "", phone: "", email: "" },
      ],
    }));
  };

  const removeContact = (index) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index),
    }));
  };

    const handleSubmit = (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    console.log("Form submitted:", formData);
    
    // In a real app, you would send this data to your API
    // Simulate API call with setTimeout
    setTimeout(() => {
      // Prepare success message based on mode
      const message = isEditMode 
        ? "Health record updated successfully!"
        : "Health record created successfully!";
      
      alert(message);
      // Redirect to the list page after submission
      navigate('/parent/health-records');
      setIsSubmitting(false);
    }, 1000);
  };
  // Tab content components
  const renderPersonalInfo = () => (
    <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Student Photo
        </label>
        
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Photo Preview */}
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="relative w-40 h-40 overflow-hidden border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center bg-gray-100">
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className="h-full w-full object-cover" 
                />
              ) : (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-16 w-16 text-gray-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1} 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                  />
                </svg>
              )}
            </div>
          </div>
          
          {/* Upload Controls */}
          <div className="w-full md:w-2/3">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="photo-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p className="mb-1 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 2MB)</p>
                </div>
                <input 
                  id="photo-upload" 
                  type="file" 
                  name="photo" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setFormData({ ...formData, photo: file });
                      setPreviewImage(URL.createObjectURL(file));
                    }
                  }}
                />
              </label>
            </div>
            
            {formData.photo && (
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-gray-500 truncate max-w-[200px]">
                  {formData.photo.name}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, photo: null });
                    setPreviewImage(null);
                  }}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
            placeholder="Enter full name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Student ID
          </label>
          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
            placeholder="Enter studentID"
            
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Class
          </label>
          <input
            type="text"
            name="class"
            value={formData.class}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter class"
          />
        </div>      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderMedicalBackground = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Blood Type
          </label>
          <select
            name="bloodType"
            value={formData.bloodType}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Blood Type</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Height (cm)
          </label>
          <select
            name="height"
            value={formData.height}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select height</option>
            {/* Generate height options from 50 to 220 cm */}
            {Array.from({ length: 171 }, (_, i) => i + 50).map((h) => (
              <option key={h} value={h.toString()}>
                {h} cm
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Weight (kg)
          </label>
          <select
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select weight</option>
            {/* Generate weight options from 1 to 150 kg */}
            {Array.from({ length: 150 }, (_, i) => i + 1).map((w) => (
              <option key={w} value={w.toString()}>
                {w} kg
              </option>
            ))}
          </select>
        </div>
      </div>      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Allergies
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            id="allergy-input"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter allergy and press Add"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const input = document.getElementById("allergy-input");
                handleArrayInput("allergies", input.value);
                input.value = "";
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              const input = document.getElementById("allergy-input");
              handleArrayInput("allergies", input.value);
              input.value = "";
              input.focus();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {formData.allergies.map((allergy, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800"
            >
              {allergy}
              <button
                type="button"
                onClick={() => removeArrayItem("allergies", index)}
                className="ml-1 text-blue-500 hover:text-blue-700"
              >
                &times;
              </button>
            </span>
          ))}
          {formData.allergies.length === 0 && (
            <span className="text-sm text-gray-500">No allergies added</span>
          )}
        </div>
      </div>      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Chronic Conditions
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            id="condition-input"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter condition and press Add"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const input = document.getElementById("condition-input");
                handleArrayInput("chronicConditions", input.value);
                input.value = "";
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              const input = document.getElementById("condition-input");
              handleArrayInput("chronicConditions", input.value);
              input.value = "";
              input.focus();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {formData.chronicConditions.map((condition, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800"
            >
              {condition}
              <button
                type="button"
                onClick={() => removeArrayItem("chronicConditions", index)}
                className="ml-1 text-green-500 hover:text-green-700"
              >
                &times;
              </button>
            </span>
          ))}
          {formData.chronicConditions.length === 0 && (
            <span className="text-sm text-gray-500">No conditions added</span>
          )}
        </div>
      </div>
    </div>
  );

  const renderVisionHearing = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Vision Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vision (Left Eye)
            </label>
            <input
              type="text"
              name="visionLeft"
              value={formData.visionLeft}
              onChange={handleInputChange}
              placeholder="e.g., 20/20"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vision (Right Eye)
            </label>
            <input
              type="text"
              name="visionRight"
              value={formData.visionRight}
              onChange={handleInputChange}
              placeholder="e.g., 20/20"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="wearGlasses"
              checked={formData.wearGlasses}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2">Wears glasses or contacts</span>
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Hearing Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hearing (Left Ear)
            </label>
            <select
              name="hearingLeft"
              value={formData.hearingLeft}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Status</option>
              <option value="normal">Normal</option>
              <option value="mild_loss">Mild Loss</option>
              <option value="moderate_loss">Moderate Loss</option>
              <option value="severe_loss">Severe Loss</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hearing (Right Ear)
            </label>
            <select
              name="hearingRight"
              value={formData.hearingRight}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Status</option>
              <option value="normal">Normal</option>
              <option value="mild_loss">Mild Loss</option>
              <option value="moderate_loss">Moderate Loss</option>
              <option value="severe_loss">Severe Loss</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="hearingAid"
              checked={formData.hearingAid}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2">Uses hearing aid</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderEmergencyContacts = () => (
    <div className="space-y-6">
      <p className="text-gray-600">
        Add at least one emergency contact who can be reached during school
        hours in case of emergency.
      </p>

      {formData.emergencyContacts.map((contact, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg mb-4">          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">
              Contact {index + 1}
            </h3>
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeContact(index)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={contact.name}
                onChange={(e) =>
                  handleContactChange(index, "name", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relationship
              </label>
              <select
                value={contact.relationship}
                onChange={(e) =>
                  handleContactChange(index, "relationship", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Select Relationship</option>
                <option value="parent">Parent</option>
                <option value="guardian">Guardian</option>
                <option value="grandparent">Grandparent</option>
                <option value="relative">Other Relative</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Additional field for "Other" relationship */}
          {contact.relationship === "other" && (
            <div className="mt-4">              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relationship details
              </label>
              <input
                type="text"
                value={contact.otherRelationship}
                onChange={(e) =>
                  handleContactChange(index, "otherRelationship", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="e.g., Family Friend"
                required
              />
            </div>
          )}          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={contact.phone}
                onChange={(e) =>
                  handleContactChange(index, "phone", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={contact.email}
                onChange={(e) =>
                  handleContactChange(index, "email", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addContact}
        className="flex items-center justify-center w-full p-2 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1 text-gray-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Add Another Contact
      </button>
    </div>
  );

  const renderConsents = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 p-4 border-l-4 border-yellow-400 mb-6">
        <p className="text-sm text-yellow-700">
          These consents are important for providing appropriate medical care to
          your child during school hours. Please read each statement carefully.
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="consent-emergency"
                name="consentEmergencyTreatment"
                type="checkbox"
                checked={formData.consentEmergencyTreatment}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                required
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="consent-emergency"
                className="font-medium text-gray-700"
              >
                Emergency Medical Treatment
              </label>
              <p className="text-gray-500">
                I authorize the school to arrange for emergency medical
                treatment for my child in the event I cannot be reached. This
                includes transportation to a medical facility if necessary.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="consent-medication"
                name="consentMedicationAdmin"
                type="checkbox"
                checked={formData.consentMedicationAdmin}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="consent-medication"
                className="font-medium text-gray-700"
              >
                Medication Administration
              </label>
              <p className="text-gray-500">
                I authorize the school nurse or designated personnel to
                administer prescribed medications that I have provided according
                to instructions. I will update the school if there are any
                changes to my child's medication needs.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="consent-info-sharing"
                name="consentInformationSharing"
                type="checkbox"
                checked={formData.consentInformationSharing}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="consent-info-sharing"
                className="font-medium text-gray-700"
              >
                Health Information Sharing
              </label>
              <p className="text-gray-500">
                I authorize the school nurse to share relevant health
                information with appropriate school staff who may need to know
                this information to maintain my child's health and safety.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Tab navigation
  const tabs = [
    { id: 1, name: "Personal Info", icon: "user" },
    { id: 2, name: "Medical Background", icon: "heartbeat" },
    { id: 3, name: "Vision & Hearing", icon: "eye" },
    { id: 4, name: "Emergency Contacts", icon: "phone" },
    { id: 5, name: "Consents", icon: "check-circle" },
  ];
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {isEditMode ? "Edit Health Record" : "New Health Record"}
        </h1>
        <p className="text-gray-600">
          Please complete all sections of this health record form. Information
          provided will be kept confidential and used only for your child's
          healthcare at school.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Tabs Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {activeTab === 1 && renderPersonalInfo()}
            {activeTab === 2 && renderMedicalBackground()}
            {activeTab === 3 && renderVisionHearing()}
            {activeTab === 4 && renderEmergencyContacts()}
            {activeTab === 5 && renderConsents()}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : (
                <span>{isEditMode ? "Update" : "Save"}</span>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default HealthRecordForm;
