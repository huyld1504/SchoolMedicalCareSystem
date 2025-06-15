// Loại bỏ khoảng trắng thừa và trim
export const cleanWhitespace = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/\s+/g, ' ').trim();
};

// Tạo slug từ chuỗi
export const generateSlug = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Loại bỏ ký tự đặc biệt
    .replace(/[\s_-]+/g, '-') // Thay thế khoảng trắng và gạch dưới bằng gạch ngang
    .replace(/^-+|-+$/g, ''); // Loại bỏ gạch ngang đầu/cuối
};

// Định dạng số điện thoại
export const formatPhone = (phone, format = 'vn') => {
  if (!phone || typeof phone !== 'string') return '';
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (format === 'vn' && cleanPhone.length === 10) {
    // Định dạng Việt Nam: 0xxx xxx xxx
    return cleanPhone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  }
  return phone;
};

// Kiểm tra số điện thoại hợp lệ (định dạng Việt Nam)
export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const cleanPhone = phone.replace(/\D/g, '');
  // Số điện thoại Việt Nam: 10 chữ số bắt đầu bằng 0
  return /^0\d{9}$/.test(cleanPhone);
};

// Định dạng tiền tệ (Đồng Việt Nam)
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '';
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return '';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(numAmount);
};

// Định dạng số với dấu phân cách hàng nghìn
export const formatNumber = (num) => {
  if (!num && num !== 0) return '';
  const numValue = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(numValue)) return '';
  return new Intl.NumberFormat('vi-VN').format(numValue);
};

// Cắt ngắn chuỗi với dấu chấm lửng
export const truncate = (str, length, suffix = '...') => {
  if (!str || typeof str !== 'string') return '';
  if (str.length <= length) return str;
  return str.substring(0, length) + suffix;
};

// Viết hoa chữ cái đầu của chuỗi
export const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Viết hoa chữ cái đầu của mỗi từ
export const toTitleCase = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

// Hiển thị vai trò người dùng
export const showRole = (role) => {
  if (!role) {
    return "";
  }
  
  let roleShow = role;
  if (role === "user") {
    roleShow = "Student";
  }
  
  return roleShow.charAt(0).toUpperCase() + roleShow.slice(1);
};