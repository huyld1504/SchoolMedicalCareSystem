/**
 * Service for student health records management
 */

/**
 * Get health records for a specific student
 * @param {string} studentId - Student ID
 * @returns {Promise} Promise resolving to student health record data
 */
export const getStudentHealthRecords = (studentId = null) => {
  return new Promise((resolve) => {
    // Mock data for student health records
    const healthRecords = [
      {
        id: "HR10045",
        studentId: "S10045",
        studentName: "Emma Johnson",
        dateOfBirth: "2013-07-15",
        bloodType: "A+",
        height: "145",
        weight: "38",
        allergies: ["Peanuts", "Dust mites"],
        chronicConditions: ["Occasional migraine headaches"],
        visionLeft: "20/20",
        visionRight: "20/20",
        wearGlasses: false,
        hearingLeft: "normal",
        hearingRight: "normal",
        hearingAid: false,
        vaccinations: [
          { name: "MMR", date: "2014-08-20", provider: "Dr. Sarah Johnson" },
          { name: "DTaP", date: "2014-08-20", provider: "Dr. Sarah Johnson" },
          { name: "Hepatitis B", date: "2013-09-15", provider: "Dr. Sarah Johnson" },
          { name: "Influenza", date: "2023-10-10", provider: "Dr. Michael Chen" }
        ],
        medications: [
          { name: "Ibuprofen", dosage: "200mg", frequency: "As needed", condition: "Headache" }
        ],
        visits: [
          { date: "2023-09-05", reason: "Headache", treatment: "Ibuprofen administered, rested 30 min", provider: "School Nurse" },
          { date: "2023-10-12", reason: "Seasonal allergies", treatment: "Given antihistamine", provider: "School Nurse" }
        ],
        emergencyContacts: [
          {
            name: "Mary Johnson",
            relationship: "mother",
            phone: "555-0123",
            email: "mary.johnson@email.com"
          },
          {
            name: "Robert Johnson",
            relationship: "father",
            phone: "555-0124",
            email: "robert.johnson@email.com"
          }
        ],
        insuranceProvider: "HealthFirst",
        insuranceNumber: "HF123456",
        familyDoctor: "Dr. Sarah Johnson",
        doctorPhone: "555-9876",
        consentEmergencyTreatment: true,
        consentMedicationAdmin: true,
        consentInformationSharing: true
      },
      {
        id: "HR10046",
        studentId: "S10046",
        studentName: "Thomas Johnson",
        dateOfBirth: "2010-03-22",
        bloodType: "O+",
        height: "165",
        weight: "55",
        allergies: ["None"],
        chronicConditions: ["Asthma"],
        visionLeft: "20/20",
        visionRight: "20/20",
        wearGlasses: true,
        hearingLeft: "normal",
        hearingRight: "normal",
        hearingAid: false,
        vaccinations: [
          { name: "MMR", date: "2011-04-10", provider: "Dr. James Wilson" },
          { name: "DTaP", date: "2011-04-10", provider: "Dr. James Wilson" },
          { name: "Hepatitis B", date: "2010-04-22", provider: "Dr. James Wilson" },
          { name: "Influenza", date: "2023-10-10", provider: "Dr. Michael Chen" }
        ],
        medications: [
          { name: "Albuterol", dosage: "90mcg, 2 puffs", frequency: "As needed before exercise", condition: "Asthma" }
        ],
        visits: [
          { date: "2023-09-15", reason: "Asthma check", treatment: "No issues, advised to continue current regimen", provider: "Dr. James Wilson" },
          { date: "2023-10-05", reason: "Wheezing after PE", treatment: "Albuterol administered, symptoms improved", provider: "School Nurse" }
        ],
        emergencyContacts: [
          {
            name: "Sarah Johnson",
            relationship: "mother",
            phone: "555-0125",
            email: "sarah.johnson@email.com"
          },
          {
            name: "David Johnson",
            relationship: "father",
            phone: "555-0126",
            email: "david.johnson@email.com"
          }
        ],
        insuranceProvider: "BlueCross",
        insuranceNumber: "BC789012",
        familyDoctor: "Dr. James Wilson",
        doctorPhone: "555-8765",
        consentEmergencyTreatment: true,
        consentMedicationAdmin: true,
        consentInformationSharing: true
      },
      {
        id: "HR10058",
        studentId: "S10058",
        studentName: "Olivia Smith",
        dateOfBirth: "2015-11-10",
        bloodType: "B-",
        height: "120",
        weight: "25",
        allergies: ["Pollen", "Cat dander"],
        chronicConditions: ["Seasonal allergies"],
        visionLeft: "20/25",
        visionRight: "20/25",
        wearGlasses: true,
        hearingLeft: "normal",
        hearingRight: "normal",
        hearingAid: false,
        vaccinations: [
          { name: "MMR", date: "2016-12-15", provider: "Dr. Lisa Chen" },
          { name: "DTaP", date: "2016-12-15", provider: "Dr. Lisa Chen" },
          { name: "Hepatitis B", date: "2015-12-10", provider: "Dr. Lisa Chen" },
          { name: "Influenza", date: "2023-10-10", provider: "Dr. Michael Chen" }
        ],
        medications: [
          { name: "Cetirizine", dosage: "5mg", frequency: "Once daily", condition: "Seasonal allergies" }
        ],
        visits: [
          { date: "2023-09-20", reason: "Runny nose", treatment: "Recommended increased fluid intake", provider: "School Nurse" },
          { date: "2023-10-18", reason: "Allergy symptoms", treatment: "Confirmed medication administration", provider: "School Nurse" }
        ],
        emergencyContacts: [
          {
            name: "Emily Smith",
            relationship: "mother",
            phone: "555-0127",
            email: "emily.smith@email.com"
          },
          {
            name: "William Smith",
            relationship: "father",
            phone: "555-0128",
            email: "william.smith@email.com"
          }
        ],
        insuranceProvider: "Aetna",
        insuranceNumber: "AE345678",
        familyDoctor: "Dr. Lisa Chen",
        doctorPhone: "555-7654",
        consentEmergencyTreatment: true,
        consentMedicationAdmin: true,
        consentInformationSharing: true
      }
    ];

    // If studentId is provided, return only that student's records
    if (studentId) {
      const studentRecord = healthRecords.find(record => record.studentId === studentId);
      resolve(studentRecord || null);
    } else {
      // Otherwise return all records
      resolve(healthRecords);
    }
  });
};

/**
 * Add a new visit to student health record
 * @param {string} studentId - Student ID
 * @param {Object} visitData - Visit data including reason and treatment
 * @returns {Promise} Promise resolving to updated health record
 */
export const addStudentHealthVisit = (studentId, visitData) => {
  return new Promise((resolve) => {
    // In a real application, this would update the database
    // For the demo, we'll just return a success indicator
    resolve({
      success: true,
      message: `Health visit recorded for student ${studentId}`,
      visitData: {
        ...visitData,
        date: new Date().toISOString().split('T')[0]
      }
    });
  });
};

/**
 * Update student health records with new information
 * @param {string} studentId - Student ID
 * @param {Object} updateData - Data to update
 * @returns {Promise} Promise resolving to update status
 */
export const updateStudentHealthRecord = (studentId, updateData) => {
  return new Promise((resolve) => {
    // In a real application, this would update the database
    resolve({
      success: true,
      message: `Health record updated for student ${studentId}`,
      updatedFields: Object.keys(updateData)
    });
  });
};

export default {
  getStudentHealthRecords,
  addStudentHealthVisit,
  updateStudentHealthRecord
};