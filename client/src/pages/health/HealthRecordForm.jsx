import React, { useState } from "react";

function HealthRecordForm() {
  const [activeTab, setActiveTab] = useState(1);
  const [formData, setFormData] = useState({
    // Student Personal Information
    firstName: "",
    lastName: "",
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
    treatments: [],

    // Emergency Contacts
    emergencyContacts: [{ name: "", relationship: "", phone: "", email: "" }],

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
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value],
      }));
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
      ...prev,
      emergencyContacts: [
        ...prev.emergencyContacts,
        { name: "", relationship: "", phone: "", email: "" },
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
    console.log("Form submitted:", formData);
    // In a real app, you would send this data to your API
    alert("Health record submitted successfully!");
  };

  // Tab content components
  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Grade
          </label>
          <select
            name="grade"
            value={formData.grade}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select Grade</option>
            <option value="k">Kindergarten</option>
            <option value="1">1st Grade</option>
            <option value="2">2nd Grade</option>
            <option value="3">3rd Grade</option>
            <option value="4">4th Grade</option>
            <option value="5">5th Grade</option>
            <option value="6">6th Grade</option>
            <option value="7">7th Grade</option>
            <option value="8">8th Grade</option>
            <option value="9">9th Grade</option>
            <option value="10">10th Grade</option>
            <option value="11">11th Grade</option>
            <option value="12">12th Grade</option>
          </select>
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
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Student Photo
        </label>
        <input
          type="file"
          name="photo"
          onChange={(e) =>
            setFormData({ ...formData, photo: e.target.files[0] })
          }
          className="w-full p-2 border border-gray-300 rounded"
          accept="image/*"
        />
        <p className="mt-1 text-sm text-gray-500">
          Upload a recent photo of your child.
        </p>
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
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Height (cm)
          </label>
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Weight (kg)
          </label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Allergies
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            id="allergy-input"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter allergy and press Add"
          />
          <button
            type="button"
            onClick={() => {
              const input = document.getElementById("allergy-input");
              handleArrayInput("allergies", input.value);
              input.value = "";
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
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Chronic Conditions
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            id="condition-input"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter condition and press Add"
          />
          <button
            type="button"
            onClick={() => {
              const input = document.getElementById("condition-input");
              handleArrayInput("chronicConditions", input.value);
              input.value = "";
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
        <div key={index} className="p-4 border border-gray-200 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
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
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Student Health Record</h1>
        <p className="text-gray-600">
          Please complete all sections of this health record form. Information
          provided will be kept confidential and used only for your child's
          healthcare at school.
        </p>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <nav className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-4 text-center flex-1 whitespace-nowrap
                  ${
                    activeTab === tab.id
                      ? "border-b-2 border-blue-500 font-medium text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }
                `}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {activeTab === 1 && renderPersonalInfo()}
            {activeTab === 2 && renderMedicalBackground()}
            {activeTab === 3 && renderVisionHearing()}
            {activeTab === 4 && renderEmergencyContacts()}
            {activeTab === 5 && renderConsents()}

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={() => activeTab > 1 && setActiveTab(activeTab - 1)}
                className={`px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 ${
                  activeTab === 1 ? "invisible" : ""
                }`}
              >
                Previous
              </button>

              {activeTab < 5 ? (
                <button
                  type="button"
                  onClick={() => activeTab < 5 && setActiveTab(activeTab + 1)}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Submit Health Record
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default HealthRecordForm;
