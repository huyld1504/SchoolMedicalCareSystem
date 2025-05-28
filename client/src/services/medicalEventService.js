/**
 * Service xử lý các thao tác liên quan đến sự kiện y tế
 */

// Dữ liệu mẫu cho các sự kiện y tế
const medicalEvents = [
  {
    id: 1,
    studentName: 'Emma Johnson',
    studentId: 'S10045',
    grade: 'Lớp 5',
    eventType: 'Chấn thương',
    eventSubtype: 'Té ngã',
    date: '2025-05-20',
    time: '10:30 AM',
    location: 'Sân chơi',
    description: 'Ngã từ xích đu và trầy xước đầu gối',
    severity: 'Nhẹ',
    treatment: 'Làm sạch vết thương bằng dung dịch sát khuẩn và băng vết thương',
    treatmentBy: 'Y tá Sarah',
    followUpRequired: false,
    parentNotified: true,
    notifiedAt: '2025-05-20 10:45 AM',
    notifiedBy: 'Y tá Sarah',
    notes: 'Học sinh đã trở lại lớp học sau khi được điều trị',
    status: 'Đã giải quyết'
  },
  {
    id: 2,
    studentName: 'Michael Brown',
    studentId: 'S10062',
    grade: 'Lớp 7',
    eventType: 'Bệnh',
    eventSubtype: 'Sốt',
    date: '2025-05-19',
    time: '01:15 PM',
    location: 'Phòng học',
    description: 'Học sinh than đau đầu và phát hiện nhiệt độ cao (38°C)',
    severity: 'Trung bình',
    treatment: 'Cho uống thuốc hạ sốt với sự cho phép của phụ huynh và theo dõi trong 30 phút',
    treatmentBy: 'Y tá Robert',
    followUpRequired: true,
    followUpDate: '2025-05-21',
    parentNotified: true,
    notifiedAt: '2025-05-19 01:30 PM',
    notifiedBy: 'Y tá Robert',
    notes: 'Phụ huynh đón học sinh lúc 2:15 PM',
    status: 'Cần theo dõi thêm'
  },
  {
    id: 3,
    studentName: 'Sophia Davis',
    studentId: 'S10078',
    grade: 'Lớp 4',
    eventType: 'Tình trạng y tế',
    eventSubtype: 'Cơn hen suyễn',
    date: '2025-05-18',
    time: '11:20 AM',
    location: 'Phòng tập thể dục',
    description: 'Gặp khó khăn khi thở trong giờ thể dục',
    severity: 'Nghiêm trọng',
    treatment: 'Sử dụng ống hít cứu sinh theo kế hoạch chăm sóc của học sinh',
    treatmentBy: 'Y tá Sarah',
    followUpRequired: true,
    followUpDate: '2025-05-19',
    parentNotified: true,
    notifiedAt: '2025-05-18 11:25 AM',
    notifiedBy: 'Y tá Sarah',
    notes: 'Hơi thở đã bình thường sau khi sử dụng ống hít. Học sinh nghỉ ngơi trong phòng y tá 30 phút trước khi trở lại lớp học.',
    status: 'Đã giải quyết'
  },
  {
    id: 4,
    studentName: 'James Wilson',
    studentId: 'S10081',
    grade: 'Lớp 6',
    eventType: 'Chấn thương',
    eventSubtype: 'Chấn thương thể thao',
    date: '2025-05-15',
    time: '03:30 PM',
    location: 'Sân bóng đá',
    description: 'Bị trẹo mắt cá chân trong lúc tập bóng đá',
    severity: 'Trung bình',
    treatment: 'Chườm đá, nâng chân lên và sử dụng băng nén',
    treatmentBy: 'Y tá Robert',
    followUpRequired: true,
    followUpDate: '2025-05-16',
    parentNotified: true,
    notifiedAt: '2025-05-15 03:45 PM',
    notifiedBy: 'Y tá Robert',
    notes: 'Phụ huynh đón học sinh. Đề xuất khám bác sĩ nếu đau kéo dài.',
    status: 'Đã giải quyết'
  },
  {
    id: 5,
    studentName: 'Olivia Smith',
    studentId: 'S10058',
    grade: 'Lớp 3',
    eventType: 'Bệnh truyền nhiễm',
    eventSubtype: 'Nghi cúm',
    date: '2025-05-14',
    time: '09:45 AM',
    location: 'Phòng học',
    description: 'Có các triệu chứng của cúm bao gồm sốt, ho và mệt mỏi',
    severity: 'Trung bình',
    treatment: 'Cách ly học sinh, theo dõi các triệu chứng',
    treatmentBy: 'Y tá Sarah',
    followUpRequired: false,
    parentNotified: true,
    notifiedAt: '2025-05-14 10:00 AM',
    notifiedBy: 'Y tá Sarah',
    notes: 'Phụ huynh đón học sinh. Được khuyên đi khám bác sĩ nhi khoa và ở nhà ít nhất 24 giờ sau khi hết sốt.',
    status: 'Đã giải quyết'
  }
];

// Các tùy chọn loại sự kiện cho menu dropdown
export const eventTypes = [
  { value: 'Chấn thương', label: 'Chấn thương' },
  { value: 'Bệnh', label: 'Bệnh' },
  { value: 'Tình trạng y tế', label: 'Tình trạng y tế' },
  { value: 'Bệnh truyền nhiễm', label: 'Bệnh truyền nhiễm' },
  { value: 'Phản ứng dị ứng', label: 'Phản ứng dị ứng' },
  { value: 'Sức khỏe tâm thần', label: 'Sức khỏe tâm thần' },
  { value: 'Khác', label: 'Khác' }
];

// Mức độ nghiêm trọng
export const severityLevels = [
  { value: 'Nhẹ', label: 'Nhẹ - Chỉ cần sơ cứu' },
  { value: 'Trung bình', label: 'Trung bình - Có thể cần theo dõi thêm' },
  { value: 'Nghiêm trọng', label: 'Nghiêm trọng - Cần chăm sóc ngay' },
  { value: 'Rất nghiêm trọng', label: 'Rất nghiêm trọng - Cần đáp ứng khẩn cấp' }
];

// Các tùy chọn trạng thái
export const statusOptions = [
  { value: 'Mới', label: 'Mới' },
  { value: 'Đang xử lý', label: 'Đang xử lý' },
  { value: 'Cần theo dõi thêm', label: 'Cần theo dõi thêm' },
  { value: 'Đã giải quyết', label: 'Đã giải quyết' }
];

// Phân loại chi tiết dựa trên loại sự kiện
export const eventSubtypes = {
  'Chấn thương': [
    { value: 'Té ngã', label: 'Té ngã' },
    { value: 'Chấn thương thể thao', label: 'Chấn thương thể thao' },
    { value: 'Vết cắt/Xước', label: 'Vết cắt/Xước' },
    { value: 'Bỏng', label: 'Bỏng' },
    { value: 'Chấn thương đầu', label: 'Chấn thương đầu' },
    { value: 'Gãy xương/Bong gân', label: 'Gãy xương/Bong gân' },
    { value: 'Khác', label: 'Khác' }
  ],
  'Bệnh': [
    { value: 'Sốt', label: 'Sốt' },
    { value: 'Đau đầu', label: 'Đau đầu' },
    { value: 'Buồn nôn/Nôn', label: 'Buồn nôn/Nôn' },
    { value: 'Đau bụng', label: 'Đau bụng' },
    { value: 'Hô hấp', label: 'Hô hấp' },
    { value: 'Khác', label: 'Khác' }
  ],
  'Tình trạng y tế': [
    { value: 'Cơn hen suyễn', label: 'Cơn hen suyễn' },
    { value: 'Tiểu đường', label: 'Tiểu đường' },
    { value: 'Co giật', label: 'Co giật' },
    { value: 'Đau nửa đầu', label: 'Đau nửa đầu' },
    { value: 'Khác', label: 'Khác' }
  ],
  'Bệnh truyền nhiễm': [
    { value: 'Nghi cúm', label: 'Nghi cúm' },
    { value: 'Cảm lạnh thông thường', label: 'Cảm lạnh thông thường' },
    { value: 'Viêm họng liên cầu', label: 'Viêm họng liên cầu' },
    { value: 'Nhiễm trùng da', label: 'Nhiễm trùng da' },
    { value: 'Đau mắt đỏ', label: 'Đau mắt đỏ' },
    { value: 'Khác', label: 'Khác' }
  ],
  'Phản ứng dị ứng': [
    { value: 'Dị ứng thực phẩm', label: 'Dị ứng thực phẩm' },
    { value: 'Côn trùng đốt', label: 'Côn trùng đốt' },
    { value: 'Thuốc', label: 'Thuốc' },
    { value: 'Theo mùa', label: 'Theo mùa' },
    { value: 'Khác', label: 'Khác' }
  ],
  'Sức khỏe tâm thần': [
    { value: 'Lo âu', label: 'Lo âu' },
    { value: 'Căng thẳng', label: 'Căng thẳng' },
    { value: 'Vấn đề hành vi', label: 'Vấn đề hành vi' },
    { value: 'Khác', label: 'Khác' }
  ]
};

// Các hàm dịch vụ

/**
 * Lấy tất cả các sự kiện y tế
 * @returns {Array} Mảng các sự kiện y tế
 */
export const getAllMedicalEvents = () => {
  return [...medicalEvents];
};

/**
 * Lấy các sự kiện y tế đã lọc 
 * @param {Object} filters - Các bộ lọc cần áp dụng
 * @returns {Array} Các sự kiện y tế đã lọc
 */
export const getFilteredMedicalEvents = (filters = {}) => {
  let result = [...medicalEvents];

  // Áp dụng bộ lọc nếu được cung cấp
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
 * Lấy sự kiện y tế theo ID
 * @param {number} id - ID sự kiện
 * @returns {Object|null} Đối tượng sự kiện y tế hoặc null nếu không tìm thấy
 */
export const getMedicalEventById = (id) => {
  return medicalEvents.find(event => event.id === parseInt(id)) || null;
};

/**
 * Thêm sự kiện y tế mới
 * @param {Object} eventData - Dữ liệu sự kiện mới
 * @returns {Object} Sự kiện đã tạo
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
 * Cập nhật sự kiện y tế hiện có
 * @param {number} id - ID sự kiện cần cập nhật
 * @param {Object} eventData - Dữ liệu sự kiện đã cập nhật
 * @returns {Object|null} Sự kiện đã cập nhật hoặc null nếu không tìm thấy
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
 * Xóa sự kiện y tế
 * @param {number} id - ID sự kiện cần xóa
 * @returns {boolean} Cho biết thao tác có thành công hay không
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
 * Lấy các sự kiện cần theo dõi thêm
 * @returns {Array} Các sự kiện y tế cần theo dõi thêm
 */
export const getFollowUpEvents = () => {
  return medicalEvents.filter(event =>
    event.followUpRequired &&
    (event.status === 'Cần theo dõi thêm' || event.status === 'Đang xử lý')
  );
};

/**
 * Lấy các sự kiện theo khoảng thời gian
 * @param {string} startDate - Ngày bắt đầu (YYYY-MM-DD)
 * @param {string} endDate - Ngày kết thúc (YYYY-MM-DD)
 * @returns {Array} Các sự kiện y tế trong khoảng thời gian
 */
export const getEventsByDateRange = (startDate, endDate) => {
  return medicalEvents.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= new Date(startDate) && eventDate <= new Date(endDate);
  });
};

/**
 * Lấy thống kê về các sự kiện y tế
 * @param {string} startDate - Ngày bắt đầu (YYYY-MM-DD)
 * @param {string} endDate - Ngày kết thúc (YYYY-MM-DD)
 * @returns {Object} Thống kê
 */
export const getMedicalEventStats = (startDate, endDate) => {
  const eventsInRange = startDate && endDate ?
    getEventsByDateRange(startDate, endDate) :
    [...medicalEvents];

  const totalEvents = eventsInRange.length;

  // Đếm theo loại
  const countByType = {};
  eventsInRange.forEach(event => {
    countByType[event.eventType] = (countByType[event.eventType] || 0) + 1;
  });

  // Đếm theo mức độ nghiêm trọng
  const countBySeverity = {};
  eventsInRange.forEach(event => {
    countBySeverity[event.severity] = (countBySeverity[event.severity] || 0) + 1;
  });

  // Đếm theo trạng thái
  const countByStatus = {};
  eventsInRange.forEach(event => {
    countByStatus[event.status] = (countByStatus[event.status] || 0) + 1;
  });

  return {
    totalEvents,
    countByType,
    countBySeverity,
    countByStatus,
    openEvents: eventsInRange.filter(e => e.status === 'Mới').length,
    followUpRequired: eventsInRange.filter(e => e.followUpRequired).length
  };
};
