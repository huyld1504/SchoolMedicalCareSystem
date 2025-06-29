// Loại bỏ khoảng trắng thừa và trim
export const cleanWhitespace = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/\s+/g, ' ').trim();
};

// Loại bỏ dấu ngoặc vuông từ chuỗi
export const deleteSpecical = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/[\[\]]/g, '').trim();
};

// Thêm dấu ngoặc vuông vào chuỗi nếu chưa có
export const addBrackets = (str) => {
  if (!str || typeof str !== 'string') return '';
  const trimmed = str.trim();
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed; // Đã có dấu ngoặc vuông
  }
  return `[${trimmed}]`;
};

// Loại bỏ dấu ngoặc vuông khỏi chuỗi để hiển thị
export const removeBrackets = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/^\[|\]$/g, '').trim();
};

// Xử lý dữ liệu health profile khi hiển thị (loại bỏ dấu ngoặc)
export const processHealthDataForDisplay = (data) => {
  if (!data || typeof data !== 'object') return data;

  const processed = { ...data };

  // Xử lý các trường có thể chứa dấu ngoặc vuông
  ['allergies', 'chronicDiseases', 'devicesSupport'].forEach(field => {
    if (processed[field] && processed[field].deleteSpecical) {
      processed[field] = {
        ...processed[field],
        deleteSpecical: removeBrackets(processed[field].deleteSpecical)
      };
    }
  });

  return processed;
};

// Xử lý dữ liệu health profile khi gửi lên server (thêm dấu ngoặc)
export const processHealthDataForSave = (data) => {
  if (!data || typeof data !== 'object') return data;

  const processed = { ...data };

  // Xử lý các trường cần thêm dấu ngoặc vuông
  ['allergies', 'chronicDiseases', 'devicesSupport'].forEach(field => {
    if (processed[field] && processed[field].deleteSpecical && processed[field].deleteSpecical !== '1') {
      processed[field] = {
        ...processed[field],
        deleteSpecical: addBrackets(processed[field].deleteSpecical)
      };
    }
  });

  return processed;
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

// Test functions để kiểm tra xử lý dấu ngoặc vuông
console.log('🧪 Testing bracket processing functions:');

// Test removeBrackets
console.log('removeBrackets("[Dị ứng sữa]"):', removeBrackets("[Dị ứng sữa]"));
console.log('removeBrackets("Dị ứng sữa"):', removeBrackets("Dị ứng sữa"));

// Test addBrackets  
console.log('addBrackets("Dị ứng sữa"):', addBrackets("Dị ứng sữa"));
console.log('addBrackets("[Dị ứng sữa]"):', addBrackets("[Dị ứng sữa]"));

// Test processHealthDataForDisplay
const sampleHealthData = {
  allergies: { deleteSpecical: "[Dị ứng sữa, Dị ứng tôm]" },
  chronicDiseases: { deleteSpecical: "[Hen suyễn]" },
  devicesSupport: { deleteSpecical: "[Kính cận thị]" }
};
console.log('processHealthDataForDisplay:', processHealthDataForDisplay(sampleHealthData));

// Test processHealthDataForSave
const sampleForSave = {
  allergies: { deleteSpecical: "Dị ứng sữa, Dị ứng tôm" },
  chronicDiseases: { deleteSpecical: "Hen suyễn" },
  devicesSupport: { deleteSpecical: "Kính cận thị" }
};
console.log('processHealthDataForSave:', processHealthDataForSave(sampleForSave));