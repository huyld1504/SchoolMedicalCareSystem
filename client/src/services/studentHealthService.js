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
        birthDate: "2013-07-15",
        bloodType: "A+",
        allergies: ["Peanuts", "Dust mites"],
        chronicConditions: ["Occasional migraine headaches"],
        vaccinations: [
          { name: "MMR", date: "2014-08-20" },
          { name: "DTaP", date: "2014-08-20" },
          { name: "Hepatitis B", date: "2013-09-15" },
          { name: "Influenza", date: "2023-10-10" }
        ],
        medications: [
          { name: "Ibuprofen", dosage: "200mg", frequency: "As needed", condition: "Headache" }
        ],
        visits: [
          { date: "2023-09-05", reason: "Headache", treatment: "Ibuprofen administered, rested 30 min" },
          { date: "2023-10-12", reason: "Seasonal allergies", treatment: "Given antihistamine" }
        ]
      },
      {
        id: "HR10046",
        studentId: "S10046",
        studentName: "Thomas Johnson",
        birthDate: "2010-03-22",
        bloodType: "O+",
        allergies: ["None"],
        chronicConditions: ["Asthma"],
        vaccinations: [
          { name: "MMR", date: "2011-04-10" },
          { name: "DTaP", date: "2011-04-10" },
          { name: "Hepatitis B", date: "2010-04-22" },
          { name: "Influenza", date: "2023-10-10" }
        ],
        medications: [
          { name: "Albuterol", dosage: "90mcg, 2 puffs", frequency: "As needed before exercise", condition: "Asthma" }
        ],
        visits: [
          { date: "2023-09-15", reason: "Asthma check", treatment: "No issues, advised to continue current regimen" },
          { date: "2023-10-05", reason: "Wheezing after PE", treatment: "Albuterol administered, symptoms improved" }
        ]
      },
      {
        id: "HR10058",
        studentId: "S10058",
        studentName: "Olivia Smith",
        birthDate: "2015-11-10",
        bloodType: "B-",
        allergies: ["Pollen", "Cat dander"],
        chronicConditions: ["Seasonal allergies"],
        vaccinations: [
          { name: "MMR", date: "2016-12-15" },
          { name: "DTaP", date: "2016-12-15" },
          { name: "Hepatitis B", date: "2015-12-10" },
          { name: "Influenza", date: "2023-10-10" }
        ],
        medications: [
          { name: "Cetirizine", dosage: "5mg", frequency: "Once daily", condition: "Seasonal allergies" }
        ],
        visits: [
          { date: "2023-09-20", reason: "Runny nose", treatment: "Recommended increased fluid intake" },
          { date: "2023-10-18", reason: "Allergy symptoms", treatment: "Confirmed medication administration" }
        ]
      },
      {
        id: "HR10062",
        studentId: "S10062",
        studentName: "Michael Brown",
        birthDate: "2011-05-18",
        bloodType: "AB+",
        allergies: ["None"],
        chronicConditions: ["ADHD"],
        vaccinations: [
          { name: "MMR", date: "2012-06-22" },
          { name: "DTaP", date: "2012-06-22" },
          { name: "Hepatitis B", date: "2011-06-18" },
          { name: "Influenza", date: "2023-10-10" }
        ],
        medications: [
          { name: "Methylphenidate", dosage: "10mg", frequency: "Once daily with lunch", condition: "ADHD" }
        ],
        visits: [
          { date: "2023-09-08", reason: "Medication check", treatment: "No side effects reported" },
          { date: "2023-10-22", reason: "Minor scrape on playground", treatment: "Cleaned wound, applied bandage" }
        ]
      },
      {
        id: "HR10078",
        studentId: "S10078",
        studentName: "Sophia Davis",
        birthDate: "2014-09-30",
        bloodType: "O-",
        allergies: ["Latex"],
        chronicConditions: ["Type 1 Diabetes"],
        vaccinations: [
          { name: "MMR", date: "2015-10-15" },
          { name: "DTaP", date: "2015-10-15" },
          { name: "Hepatitis B", date: "2014-10-30" },
          { name: "Influenza", date: "2023-10-10" }
        ],
        medications: [
          { name: "Insulin", dosage: "As per glucose reading", frequency: "With meals", condition: "Type 1 Diabetes" }
        ],
        visits: [
          { date: "2023-09-12", reason: "High glucose reading", treatment: "Insulin administered, monitored for 30 min" },
          { date: "2023-10-15", reason: "Routine check", treatment: "Blood sugar normal" }
        ]
      }
    ];

    if (studentId) {
      const studentRecord = healthRecords.find(record => record.studentId === studentId);
      resolve(studentRecord ? [studentRecord] : []);
    } else {
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