/**
 * Service for handling medication-related operations
 */

// Mock data for medications
const medications = [
  {
    id: 1,
    studentName: 'Emma Johnson',
    studentId: 'S10045',
    grade: '5th Grade',
    medication: 'Ibuprofen',
    dosage: '200mg',
    frequency: 'As needed',
    startDate: '2023-05-01',
    endDate: '2023-05-30',
    status: 'Active',
    lastAdministered: '2023-05-10 12:05 PM',
    remainingDoses: 5,
    instructions: 'For headache or fever above 100F',
    prescribingPhysician: 'Dr. Robert Miller',
    prescribingPhysicianPhone: '555-123-4567',
    pharmacy: 'University Pharmacy',
    pharmacyPhone: '555-789-1234',
    parentApproved: true,
    nurseApproved: true,
    approvalDate: '2023-05-01',
    approvedBy: 'Nurse Sarah',
    emergencyContact: 'John Johnson',
    emergencyContactPhone: '555-456-7890',
    insuranceInfo: 'BlueCross Policy #12345',
    allergies: 'None',
    medicalConditions: 'Occasional migraines',
    documents: [
      { id: 1, name: 'Prescription.pdf', type: 'application/pdf', url: '#' },
      { id: 2, name: 'ParentConsent.pdf', type: 'application/pdf', url: '#' }
    ]
  },
  {
    id: 2,
    studentName: 'Thomas Johnson',
    studentId: 'S10046',
    grade: '8th Grade',
    medication: 'Albuterol',
    dosage: '90mcg, 2 puffs',
    frequency: 'Every 4-6 hours as needed',
    startDate: '2023-01-15',
    endDate: '2023-12-31',
    status: 'Low Supply',
    lastAdministered: '2023-05-10 10:32 AM',
    remainingDoses: 2,
    instructions: 'For asthma symptoms. May take before exercise.',
    prescribingPhysician: 'Dr. Sarah Chen',
    prescribingPhysicianPhone: '555-987-6543',
    pharmacy: 'MedPlus Pharmacy',
    pharmacyPhone: '555-321-6789',
    parentApproved: true,
    nurseApproved: true,
    approvalDate: '2023-01-10',
    approvedBy: 'Nurse David',
    emergencyContact: 'Mary Johnson',
    emergencyContactPhone: '555-222-3333',
    insuranceInfo: 'Aetna Policy #67890',
    allergies: 'Dust, pollen',
    medicalConditions: 'Asthma',
    documents: [
      { id: 3, name: 'AsthmaAction.pdf', type: 'application/pdf', url: '#' },
      { id: 4, name: 'Prescription.pdf', type: 'application/pdf', url: '#' }
    ]
  }
];

// Mock pending medication requests
const pendingRequests = [
  {
    id: 3,
    studentName: 'Olivia Smith',
    studentId: 'S10058',
    grade: '3rd Grade',
    medication: 'Cetirizine',
    dosage: '5mg',
    frequency: 'Once daily',
    startDate: '2023-05-15',
    endDate: '2023-06-15',
    status: 'Pending Approval',
    instructions: 'For seasonal allergies. Take in the morning.',
    prescribingPhysician: 'Dr. Emily Wong',
    prescribingPhysicianPhone: '555-444-5555',
    pharmacy: 'Community Drugs',
    pharmacyPhone: '555-666-7777',
    parentApproved: true,
    nurseApproved: false,
    requestDate: '2023-05-12',
    parentName: 'Robert Smith',
    parentPhone: '555-888-9999',
    allergies: 'None',
    medicalConditions: 'Seasonal allergies',
    documents: [
      { id: 5, name: 'PrescriptionCetirizine.pdf', type: 'application/pdf', url: '#' }
    ],
    additionalInformation: 'Child has been experiencing increased allergy symptoms due to spring pollen.'
  }
];

/**
 * Get all medications for a student or all students
 * @param {string} [studentId] - Optional student ID to filter medications
 * @returns {Promise} Promise resolving to array of medications
 */
export const getMedications = (studentId = null) => {
  // In a real app, this would be an API call
  return new Promise(resolve => {
    setTimeout(() => {
      let result = [...medications];

      // Filter by student ID if provided
      if (studentId) {
        result = result.filter(med => med.studentId === studentId);
      }

      resolve(result);
    }, 500);
  });
};

/**
 * Get a specific medication by ID
 * @param {number} id - The medication ID
 * @returns {Promise} Promise resolving to medication object
 */
export const getMedicationById = (id) => {
  // In a real app, this would be an API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const medication = medications.find(med => med.id === parseInt(id));
      if (medication) {
        resolve(medication);
      } else {
        reject(new Error('Medication not found'));
      }
    }, 500);
  });
};

/**
 * Create a new medication request
 * @param {object} medicationData - The medication request data
 * @returns {Promise} Promise resolving to created medication request object
 */
export const createMedicationRequest = (medicationData) => {
  // In a real app, this would be an API call
  return new Promise(resolve => {
    setTimeout(() => {
      const newId = Math.max(...medications.map(med => med.id), ...pendingRequests.map(req => req.id)) + 1;

      const newRequest = {
        id: newId,
        ...medicationData,
        status: 'Pending Approval',
        nurseApproved: false,
        requestDate: new Date().toISOString().split('T')[0]
      };

      pendingRequests.push(newRequest);
      resolve(newRequest);
    }, 500);
  });
};

/**
 * Get all pending medication requests
 * @returns {Promise} Promise resolving to array of pending medication requests
 */
export const getPendingRequests = () => {
  // In a real app, this would be an API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([...pendingRequests]);
    }, 500);
  });
};

/**
 * Approve a medication request
 * @param {number} requestId - The request ID
 * @param {object} approvalData - The approval data
 * @returns {Promise} Promise resolving to approved medication object
 */
export const approveMedicationRequest = (requestId, approvalData) => {
  // In a real app, this would be an API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const requestIndex = pendingRequests.findIndex(req => req.id === parseInt(requestId));

      if (requestIndex === -1) {
        reject(new Error('Medication request not found'));
        return;
      }

      const request = pendingRequests[requestIndex];

      // Create new approved medication
      const newMedication = {
        ...request,
        status: 'Active',
        nurseApproved: true,
        approvalDate: new Date().toISOString().split('T')[0],
        approvedBy: approvalData.approvedBy || 'Nurse',
        remainingDoses: approvalData.initialDoses || 30
      };

      // Add to medications array
      medications.push(newMedication);

      // Remove from pending requests
      pendingRequests.splice(requestIndex, 1);

      resolve(newMedication);
    }, 500);
  });
};

/**
 * Deny a medication request
 * @param {number} requestId - The request ID
 * @param {object} denialData - The denial data
 * @returns {Promise} Promise resolving to denial confirmation
 */
export const denyMedicationRequest = (requestId, denialData) => {
  // In a real app, this would be an API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const requestIndex = pendingRequests.findIndex(req => req.id === parseInt(requestId));

      if (requestIndex === -1) {
        reject(new Error('Medication request not found'));
        return;
      }

      // Update the request
      pendingRequests[requestIndex] = {
        ...pendingRequests[requestIndex],
        status: 'Denied',
        deniedReason: denialData.reason,
        deniedBy: denialData.deniedBy || 'Nurse',
        deniedDate: new Date().toISOString().split('T')[0]
      };

      resolve({ success: true, message: 'Medication request denied' });
    }, 500);
  });
};

/**
 * Update a medication
 * @param {number} medicationId - The medication ID
 * @param {object} updateData - The data to update
 * @returns {Promise} Promise resolving to updated medication object
 */
export const updateMedication = (medicationId, updateData) => {
  // In a real app, this would be an API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const medicationIndex = medications.findIndex(med => med.id === parseInt(medicationId));

      if (medicationIndex === -1) {
        reject(new Error('Medication not found'));
        return;
      }

      // Update the medication
      const updatedMedication = {
        ...medications[medicationIndex],
        ...updateData
      };

      medications[medicationIndex] = updatedMedication;
      resolve(updatedMedication);
    }, 500);
  });
};

export default {
  getMedications,
  getMedicationById,
  createMedicationRequest,
  getPendingRequests,
  approveMedicationRequest,
  denyMedicationRequest,
  updateMedication
};