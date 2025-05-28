/**
 * Service for handling medical event-related operations
 */

// Mock data for medical events
const medicalEvents = [
  {
    id: 1,
    studentName: 'Emma Johnson',
    studentId: 'S10045',
    grade: '5th Grade',
    eventType: 'Injury',
    eventSubtype: 'Fall',
    date: '2025-05-20',
    time: '10:30 AM',
    location: 'Playground',
    description: 'Fell from swing and scraped knee',
    severity: 'Minor',
    treatment: 'Cleaned wound with antiseptic and applied bandage',
    treatmentBy: 'Nurse Sarah',
    followUpRequired: false,
    parentNotified: true,
    notifiedAt: '2025-05-20 10:45 AM',
    notifiedBy: 'Nurse Sarah',
    notes: 'Student returned to class after treatment',
    status: 'Resolved'
  },
  {
    id: 2,
    studentName: 'Michael Brown',
    studentId: 'S10062',
    grade: '7th Grade',
    eventType: 'Illness',
    eventSubtype: 'Fever',
    date: '2025-05-19',
    time: '01:15 PM',
    location: 'Classroom',
    description: 'Student complained of headache and was found to have elevated temperature (100.4°F)',
    severity: 'Moderate',
    treatment: 'Administered fever reducer with parent permission and monitored for 30 minutes',
    treatmentBy: 'Nurse Robert',
    followUpRequired: true,
    followUpDate: '2025-05-21',
    parentNotified: true,
    notifiedAt: '2025-05-19 01:30 PM',
    notifiedBy: 'Nurse Robert',
    notes: 'Parent picked up student at 2:15 PM',
    status: 'Requires Follow-up'
  },
  {
    id: 3,
    studentName: 'Sophia Davis',
    studentId: 'S10078',
    grade: '4th Grade',
    eventType: 'Medical Condition',
    eventSubtype: 'Asthma Attack',
    date: '2025-05-18',
    time: '11:20 AM',
    location: 'Gym',
    description: 'Experienced difficulty breathing during PE class',
    severity: 'Serious',
    treatment: 'Administered rescue inhaler as per student\'s care plan',
    treatmentBy: 'Nurse Sarah',
    followUpRequired: true,
    followUpDate: '2025-05-19',
    parentNotified: true,
    notifiedAt: '2025-05-18 11:25 AM',
    notifiedBy: 'Nurse Sarah',
    notes: 'Breathing normalized after inhaler use. Student rested in nurse\'s office for 30 minutes before returning to class.',
    status: 'Resolved'
  },
  {
    id: 4,
    studentName: 'James Wilson',
    studentId: 'S10081',
    grade: '6th Grade',
    eventType: 'Injury',
    eventSubtype: 'Sports Injury',
    date: '2025-05-15',
    time: '03:30 PM',
    location: 'Soccer Field',
    description: 'Twisted ankle during soccer practice',
    severity: 'Moderate',
    treatment: 'Applied ice pack, elevated leg, and used compression bandage',
    treatmentBy: 'Nurse Robert',
    followUpRequired: true,
    followUpDate: '2025-05-16',
    parentNotified: true,
    notifiedAt: '2025-05-15 03:45 PM',
    notifiedBy: 'Nurse Robert',
    notes: 'Parent picked up student. Recommended to follow up with physician if pain persists.',
    status: 'Resolved'
  },
  {
    id: 5,
    studentName: 'Olivia Smith',
    studentId: 'S10058',
    grade: '3rd Grade',
    eventType: 'Infectious Disease',
    eventSubtype: 'Suspected Flu',
    date: '2025-05-14',
    time: '09:45 AM',
    location: 'Classroom',
    description: 'Exhibited symptoms of influenza including fever, cough, and fatigue',
    severity: 'Moderate',
    treatment: 'Isolated student, monitored symptoms',
    treatmentBy: 'Nurse Sarah',
    followUpRequired: false,
    parentNotified: true,
    notifiedAt: '2025-05-14 10:00 AM',
    notifiedBy: 'Nurse Sarah',
    notes: 'Parent picked up student. Advised to consult pediatrician and keep home for at least 24 hours after fever subsides.',
    status: 'Resolved'
  }
];

// Event type options for dropdown menus
export const eventTypes = [
  { value: 'Injury', label: 'Chấn thương' },
  { value: 'Illness', label: 'Ốm bệnh' },
  { value: 'Medical Condition', label: 'Tình trạng bệnh lý' },
  { value: 'Infectious Disease', label: 'Bệnh truyền nhiễm' },
  { value: 'Allergic Reaction', label: 'Phản ứng dị ứng' },
  { value: 'Mental Health', label: 'Sức khỏe tâm thần' },
  { value: 'Other', label: 'Khác' }
];

// Severity levels
export const severityLevels = [
  { value: 'Minor', label: 'Nhẹ - Chỉ cần sơ cứu' },
  { value: 'Moderate', label: 'Trung bình - Có thể cần theo dõi thêm' },
  { value: 'Serious', label: 'Nghiêm trọng - Cần chăm sóc ngay lập tức' },
  { value: 'Severe', label: 'Rất nghiêm trọng - Cần đáp ứng khẩn cấp' }
];

// Status options
export const statusOptions = [
  { value: 'Open', label: 'Open' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Requires Follow-up', label: 'Requires Follow-up' },
  { value: 'Resolved', label: 'Resolved' }
];

// Event subtypes based on event type
export const eventSubtypes = {
  'Injury': [
    { value: 'Fall', label: 'Té ngã' },
    { value: 'Sports Injury', label: 'Chấn thương thể thao' },
    { value: 'Cut/Scrape', label: 'Vết cắt/Trầy xước' },
    { value: 'Burn', label: 'Bỏng' },
    { value: 'Head Injury', label: 'Chấn thương đầu' },
    { value: 'Fracture/Sprain', label: 'Gãy xương/Bong gân' },
    { value: 'Other', label: 'Khác' }
  ],
  'Illness': [
    { value: 'Fever', label: 'Sốt' },
    { value: 'Headache', label: 'Đau đầu' },
    { value: 'Nausea/Vomiting', label: 'Buồn nôn/Nôn' },
    { value: 'Abdominal Pain', label: 'Đau bụng' },
    { value: 'Respiratory', label: 'Hô hấp' },
    { value: 'Other', label: 'Khác' }
  ],
  'Medical Condition': [
    { value: 'Asthma Attack', label: 'Cơn hen suyễn' },
    { value: 'Diabetic Episode', label: 'Biến cố tiểu đường' },
    { value: 'Seizure', label: 'Co giật' },
    { value: 'Migraine', label: 'Đau nửa đầu' },
    { value: 'Other', label: 'Khác' }
  ],
  'Infectious Disease': [
    { value: 'Suspected Flu', label: 'Nghi ngờ cúm' },
    { value: 'Common Cold', label: 'Cảm lạnh thông thường' },
    { value: 'Strep Throat', label: 'Viêm họng liên cầu' },
    { value: 'Skin Infection', label: 'Nhiễm trùng da' },
    { value: 'Pink Eye', label: 'Đau mắt đỏ' },
    { value: 'Other', label: 'Khác' }
  ],
  'Allergic Reaction': [
    { value: 'Food Allergy', label: 'Dị ứng thực phẩm' },
    { value: 'Insect Sting', label: 'Côn trùng đốt' },
    { value: 'Medication', label: 'Dị ứng thuốc' },
    { value: 'Seasonal', label: 'Dị ứng theo mùa' },
    { value: 'Other', label: 'Khác' }
  ],
  'Mental Health': [
    { value: 'Anxiety', label: 'Lo âu' },
    { value: 'Distress', label: 'Căng thẳng' },
    { value: 'Behavioral Issue', label: 'Vấn đề hành vi' },
    { value: 'Other', label: 'Khác' }
  ]
};

// Service functions

/**
 * Get all medical events
 * @returns {Array} Array of medical events
 */
export const getAllMedicalEvents = () => {
  return [...medicalEvents];
};

/**
 * Get filtered medical events 
 * @param {Object} filters - Filters to apply
 * @returns {Array} Filtered medical events
 */
export const getFilteredMedicalEvents = (filters = {}) => {
  let result = [...medicalEvents];

  // Apply filters if provided
  if (filters.studentId) {
    result = result.filter(event => event.studentId === filters.studentId);
  }

  if (filters.eventType) {
    result = result.filter(event => event.eventType === filters.eventType);
  }

  if (filters.severity) {
    result = result.filter(event => event.severity === filters.severity);
  }

  if (filters.status) {
    result = result.filter(event => event.status === filters.status);
  }

  if (filters.dateFrom) {
    result = result.filter(event => new Date(event.date) >= new Date(filters.dateFrom));
  }

  if (filters.dateTo) {
    result = result.filter(event => new Date(event.date) <= new Date(filters.dateTo));
  }

  return result;
};

/**
 * Get a medical event by ID
 * @param {number} id - Event ID
 * @returns {Object|null} Medical event object or null if not found
 */
export const getMedicalEventById = (id) => {
  return medicalEvents.find(event => event.id === parseInt(id)) || null;
};

/**
 * Add a new medical event
 * @param {Object} eventData - New event data
 * @returns {Object} Created event
 */
export const createMedicalEvent = (eventData) => {
  const newEvent = {
    id: medicalEvents.length > 0 ? Math.max(...medicalEvents.map(e => e.id)) + 1 : 1,
    ...eventData,
    date: eventData.date || new Date().toISOString().split('T')[0]
  };
  
  medicalEvents.push(newEvent);
  return newEvent;
};

/**
 * Update an existing medical event
 * @param {number} id - Event ID to update
 * @param {Object} eventData - Updated event data
 * @returns {Object|null} Updated event or null if not found
 */
export const updateMedicalEvent = (id, eventData) => {
  const index = medicalEvents.findIndex(event => event.id === parseInt(id));
  
  if (index === -1) {
    return null;
  }
  
  const updatedEvent = {
    ...medicalEvents[index],
    ...eventData
  };
  
  medicalEvents[index] = updatedEvent;
  return updatedEvent;
};

/**
 * Delete a medical event
 * @param {number} id - Event ID to delete
 * @returns {boolean} Whether the operation was successful
 */
export const deleteMedicalEvent = (id) => {
  const index = medicalEvents.findIndex(event => event.id === parseInt(id));
  
  if (index === -1) {
    return false;
  }
  
  medicalEvents.splice(index, 1);
  return true;
};

/**
 * Get events requiring follow-up
 * @returns {Array} Medical events requiring follow-up
 */
export const getFollowUpEvents = () => {
  return medicalEvents.filter(event => 
    event.followUpRequired && 
    (event.status === 'Requires Follow-up' || event.status === 'In Progress')
  );
};

/**
 * Get events by date range
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Array} Medical events in the date range
 */
export const getEventsByDateRange = (startDate, endDate) => {
  return medicalEvents.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= new Date(startDate) && eventDate <= new Date(endDate);
  });
};

/**
 * Get statistics about medical events
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Object} Statistics
 */
export const getMedicalEventStats = (startDate, endDate) => {
  const eventsInRange = startDate && endDate ? 
    getEventsByDateRange(startDate, endDate) : 
    [...medicalEvents];

  const totalEvents = eventsInRange.length;
  
  // Count by type
  const countByType = {};
  eventsInRange.forEach(event => {
    countByType[event.eventType] = (countByType[event.eventType] || 0) + 1;
  });
  
  // Count by severity
  const countBySeverity = {};
  eventsInRange.forEach(event => {
    countBySeverity[event.severity] = (countBySeverity[event.severity] || 0) + 1;
  });
  
  // Count by status
  const countByStatus = {};
  eventsInRange.forEach(event => {
    countByStatus[event.status] = (countByStatus[event.status] || 0) + 1;
  });
  
  return {
    totalEvents,
    countByType,
    countBySeverity,
    countByStatus,
    openEvents: eventsInRange.filter(e => e.status === 'Open').length,
    followUpRequired: eventsInRange.filter(e => e.followUpRequired).length
  };
};
