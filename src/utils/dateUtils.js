import dayjs from 'dayjs';

/**
 * Format date từ UTC sang giờ Việt Nam để hiển thị
 * Tương tự như event management: thêm 7 giờ vào UTC time
 * @param {string|Date} dateString - Date string từ API (UTC)
 * @param {string} format - Format string (mặc định: 'DD/MM/YYYY HH:mm')
 * @returns {string} - Date string đã format theo giờ VN
 */
export const formatDateVN = (dateString, format = 'DD/MM/YYYY HH:mm') => {
  if (!dateString) return '—';
  
  try {
    // Parse UTC string và thêm 7 giờ để convert về GMT+7 (Việt Nam)
    // Tương tự như event management
    const date = new Date(dateString);
    const vietnamTime = new Date(date.getTime() + (7 * 60 * 60 * 1000));
    return dayjs(vietnamTime).format(format);
  } catch (error) {
    // Fallback: thử parse như local time
    try {
      return dayjs(dateString).format(format);
    } catch {
      return '—';
    }
  }
};

/**
 * Parse date string từ API (UTC) sang dayjs object với VN timezone
 * Tương tự như event management: thêm 7 giờ vào UTC time
 * @param {string} dateString - Date string từ API (UTC)
 * @returns {dayjs.Dayjs} - dayjs object với VN timezone
 */
export const parseDateFromAPI = (dateString) => {
  if (!dateString) return null;
  
  try {
    // Parse UTC string và thêm 7 giờ để convert về GMT+7
    // Tương tự như event management
    const date = new Date(dateString);
    const vietnamTime = new Date(date.getTime() + (7 * 60 * 60 * 1000));
    return dayjs(vietnamTime);
  } catch (error) {
    // Fallback: thử parse như local time
    try {
      return dayjs(dateString);
    } catch {
      return null;
    }
  }
};

/**
 * Convert dayjs object (VN timezone) sang UTC string để gửi API
 * Tương tự như event management: tạo dayjs từ string và để dayjs tự convert sang UTC
 * @param {dayjs.Dayjs} date - dayjs object từ DatePicker (user chọn giờ VN)
 * @returns {string} - ISO string UTC
 */
export const convertToUTCString = (date) => {
  if (!date) return null;
  
  try {
    // DatePicker trả về dayjs object với giá trị mà user đã chọn
    // Tương tự event management: tạo string từ dayjs và để dayjs tự động convert sang UTC
    // Format: YYYY-MM-DD HH:mm:ss
    const dateStr = date.format('YYYY-MM-DD HH:mm:ss');
    const dateTime = dayjs(dateStr);
    
    // Backend yêu cầu ISO 8601 format với UTC (có Z)
    return dateTime.toISOString();
  } catch (error) {
    // Fallback: thử dùng toISOString trực tiếp
    try {
      return date.toISOString();
    } catch {
      return null;
    }
  }
};

/**
 * Format date để hiển thị trong table (short format)
 * @param {string|Date} dateString - Date string từ API (UTC)
 * @returns {string} - Date string đã format
 */
export const formatDateShort = (dateString) => {
  return formatDateVN(dateString, 'DD/MM/YYYY HH:mm');
};

/**
 * Format date để hiển thị trong table (long format với giây)
 * @param {string|Date} dateString - Date string từ API (UTC)
 * @returns {string} - Date string đã format
 */
export const formatDateLong = (dateString) => {
  return formatDateVN(dateString, 'DD/MM/YYYY HH:mm:ss');
};

