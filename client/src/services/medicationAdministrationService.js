/**
 * Service for handling medication administration related operations
 */

// Mock data for medications that would be administered
const medications = [
  {
    id: 1,
    studentName: 'Emma Johnson',
    studentId: 'S10045',
    grade: '5th Grade',
    medication: 'Ibuprofen',
    dosage: '200mg',
    instructions: 'For headache or fever above 100F',
    time: '12:00 PM',
    remainingDoses: 5,
    inventoryId: 1,
    status: 'Pending',
    frequency: 'As needed',
    prescribedBy: 'Dr. Robert Miller',
    contactInfo: '555-123-4567',
    history: [
      { date: '2023-05-10', time: '12:05 PM', administered: true, notes: 'Student reported headache' },
      { date: '2023-05-09', time: '12:00 PM', administered: true, notes: '' },
      { date: '2023-05-08', time: '12:10 PM', administered: false, notes: 'Student absent' }
    ]
  },
  {
    id: 2,
    studentName: 'Thomas Johnson',
    studentId: 'S10046',
    grade: '8th Grade',
    medication: 'Albuterol',
    dosage: '90mcg, 2 puffs',
    instructions: 'For asthma symptoms. May take before exercise.',
    time: '10:30 AM',
    remainingDoses: 8,
    inventoryId: 2,
    status: 'Pending',
    frequency: 'As needed before physical activity',
    prescribedBy: 'Dr. Sarah Chen',
    contactInfo: '555-987-6543',
    history: [
      { date: '2023-05-10', time: '10:32 AM', administered: true, notes: 'Before PE class' },
      { date: '2023-05-09', time: '10:30 AM', administered: true, notes: 'Before PE class' },
      { date: '2023-05-08', time: '10:31 AM', administered: true, notes: 'Before PE class' }
    ]
  }
];

// Mock inventory data
const medicationInventory = [
  {
    id: 1,
    name: 'Ibuprofen 200mg',
    type: 'Tablet',
    category: 'Pain Reliever',
    quantity: 45,
    threshold: 20,
    expiryDate: '2024-06-15',
    storage: 'Medicine Cabinet',
    lastRestocked: '2023-04-10',
  },
  {
    id: 2,
    name: 'Albuterol Inhaler 90mcg',
    type: 'Inhaler',
    category: 'Bronchodilator',
    quantity: 8,
    threshold: 5,
    expiryDate: '2024-10-23',
    storage: 'Refrigerator',
    lastRestocked: '2023-02-15',
  }
];

/**
 * Get pending medications for the current day
 * @returns {Promise} Promise resolving to array of medications
 */
export const getPendingMedications = () => {
  // In a real app, this would be an API call
  return new Promise(resolve => {
    setTimeout(() => {
      const pendingMedications = medications.filter(med => med.status === 'Pending');
      resolve(pendingMedications);
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
 * Record a medication administration
 * @param {number} medicationId - The medication ID
 * @param {object} administrationData - The administration record data
 * @returns {Promise} Promise resolving to updated medication object
 */
export const recordAdministration = (medicationId, administrationData) => {
  // In a real app, this would be an API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const medicationIndex = medications.findIndex(med => med.id === parseInt(medicationId));

      if (medicationIndex === -1) {
        reject(new Error('Medication not found'));
        return;
      }

      // Create a new record
      const newRecord = {
        date: administrationData.date || new Date().toISOString().split('T')[0],
        time: administrationData.administrationTime,
        administered: true,
        administeredBy: administrationData.administeredBy,
        dosage: administrationData.actualDosage,
        notes: administrationData.notes,
        studentReaction: administrationData.studentReaction,
        followupRequired: administrationData.followupRequired,
        followupNotes: administrationData.followupNotes,
        witnessed: administrationData.witnessed ? administrationData.witnessName : null,
        vitalsRecorded: administrationData.vitals && Object.values(administrationData.vitals).some(v => v !== '')
      };

      // Update the medication record
      const updatedMedication = {
        ...medications[medicationIndex],
        status: 'Administered',
        remainingDoses: Math.max(0, medications[medicationIndex].remainingDoses - 1),
        history: [newRecord, ...medications[medicationIndex].history]
      };

      // Update our local "database"
      medications[medicationIndex] = updatedMedication;

      // Also update the inventory, if applicable
      if (updatedMedication.inventoryId) {
        const inventoryIndex = medicationInventory.findIndex(inv => inv.id === updatedMedication.inventoryId);
        if (inventoryIndex !== -1) {
          medicationInventory[inventoryIndex].quantity = Math.max(0, medicationInventory[inventoryIndex].quantity - 1);
        }
      }

      resolve(updatedMedication);
    }, 500);
  });
};

/**
 * Record a skipped medication
 * @param {number} medicationId - The medication ID
 * @param {object} skipData - The skip record data
 * @returns {Promise} Promise resolving to updated medication object
 */
export const recordSkippedMedication = (medicationId, skipData) => {
  // In a real app, this would be an API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const medicationIndex = medications.findIndex(med => med.id === parseInt(medicationId));

      if (medicationIndex === -1) {
        reject(new Error('Medication not found'));
        return;
      }

      // Create a new record
      const newRecord = {
        date: skipData.date || new Date().toISOString().split('T')[0],
        time: skipData.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        administered: false,
        notes: skipData.reason,
        administeredBy: skipData.administeredBy
      };

      // Update the medication record
      const updatedMedication = {
        ...medications[medicationIndex],
        status: 'Skipped',
        history: [newRecord, ...medications[medicationIndex].history]
      };

      // Update our local "database"
      medications[medicationIndex] = updatedMedication;

      resolve(updatedMedication);
    }, 500);
  });
};

/**
 * Get medication administration statistics
 * @returns {Promise} Promise resolving to statistics object
 */
export const getMedicationStatistics = () => {
  // In a real app, this would be an API call
  return new Promise(resolve => {
    setTimeout(() => {
      const stats = {
        total: medications.length,
        administered: medications.filter(med => med.status === 'Administered').length,
        pending: medications.filter(med => med.status === 'Pending').length,
        missed: medications.filter(med => med.status === 'Skipped').length
      };
      resolve(stats);
    }, 500);
  });
};

export default {
  getPendingMedications,
  getMedicationById,
  recordAdministration,
  recordSkippedMedication,
  getMedicationStatistics
};