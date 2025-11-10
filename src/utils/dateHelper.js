import dayjs from 'dayjs'

/**
 * Chuyển đổi thời gian sang UTC+7 (Giờ Việt Nam)
 * @param {string|Date} dateString - Chuỗi thời gian hoặc Date object
 * @returns {Date} - Date object đã được chuyển đổi sang UTC+7
 */
export const convertToUTC7 = (dateString) => {
  if (!dateString) return null
  
  try {
    let date
    if (dateString instanceof Date) {
      date = dateString
    } else {
      // Nếu là chuỗi, parse nó
      date = new Date(dateString)
    }
    
    if (isNaN(date.getTime())) return null
    
    // Lấy UTC time (milliseconds since epoch)
    // Nếu chuỗi có timezone info (Z hoặc +00:00), Date sẽ parse đúng UTC
    // Nếu không, giả sử nó là UTC string và parse như UTC
    const utcTime = date.getTime()
    
    // Chuyển sang UTC+7: thêm 7 giờ (7 * 60 * 60 * 1000 milliseconds)
    const utc7Time = utcTime + (7 * 60 * 60 * 1000)
    
    // Tạo Date object mới với UTC+7 time
    // Sử dụng UTC methods để format đúng
    return new Date(utc7Time)
  } catch {
    return null
  }
}

/**
 * Format ngày tháng theo định dạng Việt Nam
 * @param {string|Date} dateString - Chuỗi thời gian hoặc Date object
 * @returns {string} - Chuỗi ngày tháng đã format
 */
export const formatDateToVN = (dateString) => {
  if (!dateString) return '--'
  
  try {
    // Parse UTC string và thêm 7 giờ để convert về GMT+7 (giống như admin)
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '--'
    
    // Thêm 7 giờ (7 * 60 * 60 * 1000 milliseconds) để convert về GMT+7
    const vietnamTime = new Date(date.getTime() + (7 * 60 * 60 * 1000))
    
    // Sử dụng toLocaleDateString để format theo định dạng Việt Nam
    // Format theo định dạng: "Thứ X, ngày DD tháng MM, YYYY"
    return vietnamTime.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (e) {
    // Fallback: thử parse như local time
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return '--'
    }
  }
}

/**
 * Format ngày tháng theo định dạng DD/MM/YYYY
 * @param {string|Date} dateString - Chuỗi thời gian hoặc Date object
 * @returns {string} - Chuỗi ngày tháng đã format (DD/MM/YYYY)
 */
export const formatDateShort = (dateString) => {
  if (!dateString) return '--'
  
  try {
    // Parse UTC string và thêm 7 giờ để convert về GMT+7 (giống như admin)
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '--'
    
    // Thêm 7 giờ để convert về GMT+7
    const vietnamTime = new Date(date.getTime() + (7 * 60 * 60 * 1000))
    
    // Sử dụng dayjs để format giống như admin
    return dayjs(vietnamTime).format('DD/MM/YYYY')
  } catch (e) {
    // Fallback: thử parse như local time
    try {
      return dayjs(dateString).format('DD/MM/YYYY')
    } catch {
      return '--'
    }
  }
}

/**
 * Format thời gian theo định dạng HH:mm
 * @param {string|Date} dateString - Chuỗi thời gian hoặc Date object
 * @returns {string} - Chuỗi thời gian đã format (HH:mm)
 */
export const formatTime = (dateString) => {
  if (!dateString) return '--:--'
  
  try {
    // Parse UTC string và thêm 7 giờ để convert về GMT+7 (giống như admin)
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '--:--'
    
    // Thêm 7 giờ (7 * 60 * 60 * 1000 milliseconds) để convert về GMT+7
    const vietnamTime = new Date(date.getTime() + (7 * 60 * 60 * 1000))
    
    // Sử dụng dayjs để format giống như admin
    return dayjs(vietnamTime).format('HH:mm')
  } catch (e) {
    // Fallback: thử parse như local time
    try {
      return dayjs(dateString).format('HH:mm')
    } catch {
      return '--:--'
    }
  }
}

/**
 * Format ngày và giờ theo định dạng DD/MM/YYYY HH:mm
 * @param {string|Date} dateString - Chuỗi thời gian hoặc Date object
 * @returns {string} - Chuỗi ngày giờ đã format
 */
export const formatDateTime = (dateString) => {
  const date = convertToUTC7(dateString)
  if (!date) return '--'
  
  try {
    const dateStr = formatDateShort(dateString)
    const timeStr = formatTime(dateString)
    return `${dateStr} ${timeStr}`
  } catch {
    return '--'
  }
}

