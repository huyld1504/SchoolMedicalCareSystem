import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

function HealthRecordView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState(null);

  // Mock data loading - in a real app, you would fetch data from an API
  useEffect(() => {
    // Simulate API fetch
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

    // Simulate network delay
    setTimeout(() => {
      const studentRecord = mockStudentRecords[id];
      if (studentRecord) {
        setRecord(studentRecord);
      } else {
        // Handle case where record is not found
        console.error("Record not found");
      }
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Health record not found. The requested student record may have been removed or doesn't exist.
              </p>
            </div>
          </div>
        </div>
        <Link
          to="/parent/health-records"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Back to Records
        </Link>
      </div>
    );
  }

  // Helper to render a list of items
  const renderList = (items) => {
    if (!items || items.length === 0) {
      return <p className="text-gray-500 italic">None</p>;
    }
    return (
      <ul className="list-disc pl-5">
        {items.map((item, index) => (
          <li key={index} className="text-gray-700 mb-1">
            {item}
          </li>
        ))}
      </ul>
    );
  };

  // Helper to render an info item
  const InfoItem = ({ label, value, className = "" }) => (
    <div className={`mb-4 ${className}`}>
      <h4 className="text-sm font-medium text-gray-500">{label}</h4>
      <p className="text-base text-gray-900 mt-1">
        {value || <span className="text-gray-400 italic">Not provided</span>}
      </p>
    </div>
  );

  // Helper to format gender display
  const formatGender = (gender) => {
    if (!gender) return "";
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  };

  // Helper to format boolean values
  const formatBoolean = (value) => (value ? "Yes" : "No");

  // Helper to render consent items
  const ConsentItem = ({ label, value }) => (
    <div className="flex items-center mb-2">
      <div
        className={`w-4 h-4 rounded-full mr-2 ${
          value ? "bg-green-500" : "bg-red-500"
        }`}
      ></div>
      <p className="text-sm text-gray-700">{label}</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Health Record</h1>
          <p className="text-gray-600">Student: {record.firstName}</p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/parent/health-records"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg
              className="mr-2 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back
          </Link>
          <Link
            to={`/parent/health-records/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <svg
              className="mr-2 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        {/* Personal Information */}
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Personal Information
          </h3>
        </div>
        <div className="border-b border-gray-200 px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoItem label="Full Name" value={record.firstName} />
            <InfoItem label="Student ID" value={record.studentId} />
            <InfoItem label="Class" value={record.class} />
            <InfoItem
              label="Date of Birth"
              value={record.dateOfBirth}
            />
            <InfoItem
              label="Gender"
              value={formatGender(record.gender)}
            />
            <InfoItem label="Grade" value={record.grade} />
          </div>
        </div>

        {/* Medical Background */}
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Medical Background
          </h3>
        </div>
        <div className="border-b border-gray-200 px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoItem label="Blood Type" value={record.bloodType} />
            <InfoItem label="Height" value={record.height ? `${record.height} cm` : null} />
            <InfoItem label="Weight" value={record.weight ? `${record.weight} kg` : null} />
          </div>

          <div className="mt-6">
            <h4 className="text-base font-medium text-gray-700 mb-2">
              Allergies
            </h4>
            {renderList(record.allergies)}
          </div>

          <div className="mt-6">
            <h4 className="text-base font-medium text-gray-700 mb-2">
              Chronic Conditions
            </h4>
            {renderList(record.chronicConditions)}
          </div>
        </div>

        {/* Vision and Hearing */}
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Vision and Hearing
          </h3>
        </div>
        <div className="border-b border-gray-200 px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <h4 className="text-base font-medium text-gray-700 mb-4">
                Vision Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="Left Eye" value={record.visionLeft} />
                <InfoItem label="Right Eye" value={record.visionRight} />
              </div>
              <div className="mt-4">
                <InfoItem
                  label="Wears Glasses/Contacts"
                  value={formatBoolean(record.wearGlasses)}
                />
              </div>
            </div>

            <div>
              <h4 className="text-base font-medium text-gray-700 mb-4">
                Hearing Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <InfoItem
                  label="Left Ear"
                  value={
                    record.hearingLeft
                      ? record.hearingLeft.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())
                      : ""
                  }
                />
                <InfoItem
                  label="Right Ear"
                  value={
                    record.hearingRight
                      ? record.hearingRight.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())
                      : ""
                  }
                />
              </div>
              <div className="mt-4">
                <InfoItem
                  label="Uses Hearing Aid"
                  value={formatBoolean(record.hearingAid)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Vaccination History */}
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Vaccination History
          </h3>
        </div>
        <div className="border-b border-gray-200 px-4 py-5 sm:p-6">
          {renderList(record.vaccinations)}
        </div>

        {/* Medical Treatment History */}
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Medical Treatment History
          </h3>
        </div>
        <div className="border-b border-gray-200 px-4 py-5 sm:p-6">
          {renderList(record.treatments)}
        </div>

        {/* Emergency Contacts */}
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Emergency Contacts
          </h3>
        </div>
        <div className="border-b border-gray-200 px-4 py-5 sm:p-6">
          {record.emergencyContacts &&
          record.emergencyContacts.length > 0 ? (
            <div className="space-y-6">
              {record.emergencyContacts.map((contact, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <h4 className="text-lg font-medium text-gray-800 mb-3">
                    Contact {index + 1}: {contact.name}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem
                      label="Relationship"
                      value={
                        contact.relationship === "other"
                          ? contact.otherRelationship
                          : contact.relationship.replace(/\b\w/g, (l) => l.toUpperCase())
                      }
                    />
                    <InfoItem label="Phone" value={contact.phone} />
                    <InfoItem label="Email" value={contact.email} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No emergency contacts added</p>
          )}
        </div>

        {/* Medical Coverage */}
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Medical Coverage
          </h3>
        </div>
        <div className="border-b border-gray-200 px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem
              label="Insurance Provider"
              value={record.insuranceProvider}
            />
            <InfoItem
              label="Insurance Number"
              value={record.insuranceNumber}
            />
            <InfoItem label="Family Doctor" value={record.familyDoctor} />
            <InfoItem label="Doctor's Phone" value={record.doctorPhone} />
          </div>
        </div>

        {/* Consent */}
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Parental Consent
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <ConsentItem
            label="Consent for emergency medical treatment"
            value={record.consentEmergencyTreatment}
          />
          <ConsentItem
            label="Consent for medication administration"
            value={record.consentMedicationAdmin}
          />
          <ConsentItem
            label="Consent for information sharing with relevant staff"
            value={record.consentInformationSharing}
          />
        </div>
      </div>
    </div>
  );
}

export default HealthRecordView;
