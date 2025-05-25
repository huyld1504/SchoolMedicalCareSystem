import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

function HealthRecordView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(1);
  const [recordData, setRecordData] = useState({
    firstName: "",
    dateOfBirth: "",
    gender: "",
    grade: "",
    class: "",
    studentId: "",
    photo: null,
    bloodType: "",
    height: "",
    weight: "",
    allergies: [],
    chronicConditions: [],
    visionLeft: "",
    visionRight: "",
    wearGlasses: false,
    hearingLeft: "",
    hearingRight: "",
    hearingAid: false,
    vaccinations: [],
    treatments: [],
    emergencyContacts: [],
    insuranceProvider: "",
    insuranceNumber: "",
    familyDoctor: "",
    doctorPhone: "",
    consentEmergencyTreatment: false,
    consentMedicationAdmin: false,
    consentInformationSharing: false,
  });

  // Fetch student health record data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRecordData({
        firstName: "John Doe",
        dateOfBirth: "2010-05-15",
        gender: "male",
        grade: "10",
        class: "10A",
        studentId: "ST2024001",
        bloodType: "A+",
        height: "170",
        weight: "65",
        allergies: ["Peanuts", "Dust"],
        chronicConditions: ["Asthma"],
        visionLeft: "20/20",
        visionRight: "20/20",
        wearGlasses: true,
        hearingLeft: "normal",
        hearingRight: "normal",
        hearingAid: false,
        emergencyContacts: [
          {
            name: "Mary Doe",
            relationship: "mother",
            phone: "555-0123",
            email: "mary.doe@email.com",
          },
        ],
        consentEmergencyTreatment: true,
        consentMedicationAdmin: true,
        consentInformationSharing: true,
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Full Name</p>
            <p className="mt-1">{recordData.firstName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Student ID</p>
            <p className="mt-1">{recordData.studentId}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Class</p>
            <p className="mt-1">{recordData.class}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Date of Birth</p>
            <p className="mt-1">{recordData.dateOfBirth}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Gender</p>
            <p className="mt-1 capitalize">{recordData.gender}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMedicalBackground = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Medical Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Blood Type</p>
            <p className="mt-1">{recordData.bloodType}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Height</p>
            <p className="mt-1">{recordData.height} cm</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Weight</p>
            <p className="mt-1">{recordData.weight} kg</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Allergies</h3>
        <div className="flex flex-wrap gap-2">
          {recordData.allergies.length > 0 ? (
            recordData.allergies.map((allergy, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
              >
                {allergy}
              </span>
            ))
          ) : (
            <p className="text-gray-500">No known allergies</p>
          )}
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Chronic Conditions
        </h3>
        <div className="flex flex-wrap gap-2">
          {recordData.chronicConditions.length > 0 ? (
            recordData.chronicConditions.map((condition, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
              >
                {condition}
              </span>
            ))
          ) : (
            <p className="text-gray-500">No chronic conditions</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderVisionHearing = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Vision Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Vision (Left Eye)</p>
            <p className="mt-1">{recordData.visionLeft}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Vision (Right Eye)</p>
            <p className="mt-1">{recordData.visionRight}</p>
          </div>
        </div>
        <p className="mt-4">
          {recordData.wearGlasses
            ? "Wears glasses or contacts"
            : "Does not wear glasses or contacts"}
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Hearing Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Hearing (Left Ear)</p>
            <p className="mt-1 capitalize">{recordData.hearingLeft.replace("_", " ")}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Hearing (Right Ear)</p>
            <p className="mt-1 capitalize">{recordData.hearingRight.replace("_", " ")}</p>
          </div>
        </div>
        <p className="mt-4">
          {recordData.hearingAid ? "Uses hearing aid" : "Does not use hearing aid"}
        </p>
      </div>
    </div>
  );

  const renderEmergencyContacts = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Emergency Contacts
        </h3>
        {recordData.emergencyContacts.map((contact, index) => (
          <div key={index} className="mb-6 last:mb-0">
            <h4 className="font-medium text-gray-900 mb-2">Contact {index + 1}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="mt-1">{contact.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Relationship</p>
                <p className="mt-1 capitalize">{contact.relationship}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="mt-1">{contact.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="mt-1">{contact.email}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderConsents = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Consent Status</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <div
              className={`w-4 h-4 rounded mr-2 ${
                recordData.consentEmergencyTreatment ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="font-medium">Emergency Medical Treatment</span>
          </div>
          <div className="flex items-center">
            <div
              className={`w-4 h-4 rounded mr-2 ${
                recordData.consentMedicationAdmin ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="font-medium">Medication Administration</span>
          </div>
          <div className="flex items-center">
            <div
              className={`w-4 h-4 rounded mr-2 ${
                recordData.consentInformationSharing ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="font-medium">Health Information Sharing</span>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 1, name: "Personal Info" },
    { id: 2, name: "Medical Background" },
    { id: 3, name: "Vision & Hearing" },
    { id: 4, name: "Emergency Contacts" },
    { id: 5, name: "Consents" },
  ];

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 print:p-0">
      <div className="flex justify-between items-center mb-6 print:mb-8">
        <h1 className="text-3xl font-bold">Health Record</h1>
        <div className="space-x-4 print:hidden">          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Print Record
            </span>
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
          >
            Back
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg print:shadow-none">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 1 && renderPersonalInfo()}
          {activeTab === 2 && renderMedicalBackground()}
          {activeTab === 3 && renderVisionHearing()}
          {activeTab === 4 && renderEmergencyContacts()}
          {activeTab === 5 && renderConsents()}
        </div>
      </div>

      <style type="text/css" media="print">{`
        @page { size: auto; margin: 20mm; }
        body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        .print\\:hidden { display: none !important; }
        .print\\:shadow-none { box-shadow: none !important; }
        .print\\:p-0 { padding: 0 !important; }
        .print\\:mb-8 { margin-bottom: 2rem !important; }
      `}</style>
    </div>
  );
}

export default HealthRecordView;
