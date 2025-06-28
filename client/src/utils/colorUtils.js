/**
 * Color utilities for consistent theming across the application
 * Centralized color management for chips, statuses, and UI elements
 */

// Medical Event Type Colors
export const getMedicalEventTypeColor = (type) => {
  const typeColorMap = {
    'cấp cứu': 'error',
    'chấn thương': 'warning',
    'bệnh': 'info',
    'khác': 'default'
  };

  return typeColorMap[type?.toLowerCase()] || 'default';
};

export const getMedicalEventTypeLabel = (type) => {
  const typeLabelMap = {
    'cấp cứu': 'Cấp cứu',
    'chấn thương': 'Chấn thương',
    'bệnh': 'Bệnh',
    'khác': 'Khác'
  };

  return typeLabelMap[type?.toLowerCase()] || type || 'Không xác định';
};

// Medical Event Level Colors
export const getMedicalEventLevelColor = (level) => {
  const levelColorMap = {
    1: 'success',  // Nhẹ - Xanh lá
    2: 'warning',  // Trung bình - Cam
    3: 'error'     // Khẩn cấp - Đỏ
  };

  return levelColorMap[level] || 'default';
};

export const getMedicalEventLevelLabel = (level) => {
  const levelLabelMap = {
    1: 'Nhẹ',
    2: 'Trung bình',
    3: 'Khẩn cấp'
  };

  return levelLabelMap[level] || 'Không xác định';
};

// Medical Event Status Colors
export const getMedicalEventStatusColor = (status) => {
  const statusColorMap = {
    'resolved': 'success',     // Đã xử lý
    'đã xử lí': 'success',     // Đã xử lý  
    'đã xử lý': 'success',     // Đã xử lý
    'ongoing': 'warning',      // Đang xử lý
    'đang xử lí': 'warning',   // Đang xử lý
    'đang xử lý': 'warning',   // Đang xử lý
    'pending': 'error',        // Chờ xử lý
    'chờ xử lí': 'error',      // Chờ xử lý
    'chờ xử lý': 'error'       // Chờ xử lý
  };

  return statusColorMap[status?.toLowerCase()] || 'default';
};

export const getMedicalEventStatusLabel = (status) => {
  const statusLabelMap = {
    'resolved': 'Đã xử lý',
    'đã xử lí': 'Đã xử lý',
    'đã xử lý': 'Đã xử lý',
    'ongoing': 'Đang xử lý',
    'đang xử lí': 'Đang xử lý',
    'đang xử lý': 'Đang xử lý',
    'pending': 'Chờ xử lý',
    'chờ xử lí': 'Chờ xử lý',
    'chờ xử lý': 'Chờ xử lý'
  };

  return statusLabelMap[status?.toLowerCase()] || status || 'Không xác định';
};

// Vaccination Campaign Status Colors
export const getVaccinationStatusColor = (status) => {
  const statusColorMap = {
    'planned': 'info',      // Đã lên kế hoạch
    'ongoing': 'warning',   // Đang tiến hành
    'completed': 'success', // Hoàn thành
    'canceled': 'error'    // Đã hủy
  };

  return statusColorMap[status?.toLowerCase()] || 'default';
};

export const getVaccinationStatusLabel = (status) => {
  const statusLabelMap = {
    'planned': 'Đã lên kế hoạch',
    'ongoing': 'Đang tiến hành',
    'completed': 'Hoàn thành',
    'canceled': 'Đã hủy'
  };

  return statusLabelMap[status?.toLowerCase()] || status || 'Không xác định';
};

// Health Profile Note Colors
export const getHealthNoteColor = (hasNotes) => {
  return hasNotes ? 'warning' : 'default';
};

export const getHealthNoteLabel = (hasNotes) => {
  return hasNotes ? 'Có' : 'Không';
};

// Student Status Colors
export const getStudentStatusColor = (isActive) => {
  return isActive ? 'success' : 'default';
};

export const getStudentStatusLabel = (isActive) => {
  return isActive ? 'Đang học' : 'Không hoạt động';
};

// Blood Type Colors
export const getBloodTypeColor = () => {
  return 'primary'; // Consistent primary color for all blood types
};

// Raw color values for direct styling (hex colors)
export const getRawMedicalEventLevelColor = (level) => {
  const levelColorMap = {
    1: '#2e7d32', // Xanh lá - Nhẹ
    2: '#ed6c02', // Cam - Trung bình  
    3: '#d32f2f'  // Đỏ - Khẩn cấp
  };

  return levelColorMap[level] || '#757575'; // Xám mặc định
};

export const getRawMedicalEventStatusColor = (status) => {
  const statusColorMap = {
    'resolved': '#2e7d32',     // Xanh lá - Đã xử lý
    'đã xử lí': '#2e7d32',     // Xanh lá - Đã xử lý
    'đã xử lý': '#2e7d32',     // Xanh lá - Đã xử lý
    'ongoing': '#ed6c02',      // Cam - Đang xử lý
    'đang xử lí': '#ed6c02',   // Cam - Đang xử lý
    'đang xử lý': '#ed6c02',   // Cam - Đang xử lý
    'pending': '#d32f2f',      // Đỏ - Chờ xử lý
    'chờ xử lí': '#d32f2f',    // Đỏ - Chờ xử lý
    'chờ xử lý': '#d32f2f'     // Đỏ - Chờ xử lý
  };

  return statusColorMap[status?.toLowerCase()] || '#757575'; // Xám mặc định
};

// Medical Order Status Colors
export const getMedicalOrderStatusColor = (status) => {
  const statusColorMap = {
    'pending': 'warning',    // Chờ xử lý
    'approved': 'info',   // Đã duyệt
    'canceled': 'error',     // Đã hủy
    'completed': 'success'      // Hoàn thành
  };

  return statusColorMap[status?.toLowerCase()] || 'default';
};

export const getMedicalOrderStatusLabel = (status) => {
  const statusLabelMap = {
    'pending': 'Đang xử lý',
    'approved': 'Đã duyệt',
    'canceled': 'Đã hủy',
    'completed': 'Hoàn thành'
  };

  return statusLabelMap[status?.toLowerCase()] || status || 'Không xác định';
};

// Helper function to create chip with consistent styling
export const createMedicalEventTypeChip = (type) => ({
  label: getMedicalEventTypeLabel(type),
  color: getMedicalEventTypeColor(type),
  size: 'small'
});

export const createMedicalEventLevelChip = (level) => ({
  label: getMedicalEventLevelLabel(level),
  color: getMedicalEventLevelColor(level),
  size: 'small'
});

export const createMedicalEventStatusChip = (status) => ({
  label: getMedicalEventStatusLabel(status),
  color: getMedicalEventStatusColor(status),
  size: 'small'
});

export const createVaccinationStatusChip = (status) => ({
  label: getVaccinationStatusLabel(status),
  color: getVaccinationStatusColor(status),
  size: 'small'
});

export const createHealthNoteChip = (hasNotes) => ({
  label: getHealthNoteLabel(hasNotes),
  color: getHealthNoteColor(hasNotes),
  size: 'small',
  variant: hasNotes ? 'filled' : 'outlined'
});

export const createStudentStatusChip = (isActive) => ({
  label: getStudentStatusLabel(isActive),
  color: getStudentStatusColor(isActive),
  size: 'small'
});

export const createBloodTypeChip = (bloodType) => ({
  label: bloodType,
  color: getBloodTypeColor(),
  size: 'small',
  variant: 'outlined'
});

export const createMedicalOrderStatusChip = (status) => ({
  label: getMedicalOrderStatusLabel(status),
  color: getMedicalOrderStatusColor(status),
  size: 'small'
});
