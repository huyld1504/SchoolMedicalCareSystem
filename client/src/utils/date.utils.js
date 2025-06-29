import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Cấu hình dayjs
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('vi');

// Định dạng ngày có kèm giờ (HH:mm:ss DD/MM/YYYY)
export const formattedDate = (date) => {
  if (date) {
    return dayjs(date).format("HH:mm:ss DD/MM/YYYY");
  }
  return "";
};

// Định dạng ngày không có giờ (DD/MM/YYYY)
export const formatnoTime = (date) => {
  if (date) {
    return dayjs(date).format("DD/MM/YYYY");
  }
  return "";
};

// Lấy thời gian tương đối so với hiện tại (ví dụ: "2 giờ trước", "3 ngày nữa")
export const getRelativeTime = (date) => {
  if (date) {
    return dayjs(date).fromNow();
  }
  return "";
};

// Tính tuổi từ ngày sinh
export const getAge = (birthDate) => {
  if (birthDate) {
    return dayjs().diff(dayjs(birthDate), 'year');
  }
  return 0;
};

// Định dạng chỉ giờ (HH:mm)
export const formatTime = (date) => {
  if (date) {
    return dayjs(date).format('HH:mm');
  }
  return "";
};

// Định dạng khoảng thời gian
export const formatDateRange = (startDate, endDate) => {
  if (startDate && endDate) {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    
    if (start.isSame(end, 'day')) {
      return `${start.format('DD/MM/YYYY')} (${start.format('HH:mm')} - ${end.format('HH:mm')})`;
    }
    
    return `${start.format('DD/MM/YYYY HH:mm')} - ${end.format('DD/MM/YYYY HH:mm')}`;
  }
  return "";
};

// Kiểm tra ngày có hợp lệ không
export const isValidDate = (date) => {
  if (date) {
    return dayjs(date).isValid();
  }
  return false;
};
