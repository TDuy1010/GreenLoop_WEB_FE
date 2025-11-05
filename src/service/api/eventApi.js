import axiosClient from '../instance'

// Lấy danh sách sự kiện theo filter/pagination
export const getEvents = async (params = {}) => {
  const {
    page = 0,
    size = 10,
    code,
    status,
    search,
    startTime,
    endTime,
    createdAtStart,
    createdAtEnd,
    sortBy = 'createdAt',
    sortDir = 'DESC'
  } = params

  const response = await axiosClient.get('/events/admin', {
    params: {
      page,
      size,
      code,
      status,
      search,
      startTime,
      endTime,
      createdAtStart,
      createdAtEnd,
      sortBy,
      sortDir
    }
  })

  // Backend trả về { success, data: {...} }
  return response
}

// Lấy chi tiết sự kiện theo ID (ADMIN)
export const getEventById = async (id) => {
  const response = await axiosClient.get(`/events/admin/${id}`)
  return response
}

// Tạo sự kiện mới (multipart/form-data) - ADMIN
export const createEvent = async (eventData, thumbnailFile = null) => {
  const formData = new FormData()

  // Đính kèm event dưới dạng chuỗi JSON thuần (nhiều backend Spring mong đợi text)
  formData.append('event', JSON.stringify(eventData))

  // Đính kèm thumbnail đúng key như spec
  if (thumbnailFile) {
    formData.append('thumbnail', thumbnailFile, thumbnailFile.name)
    // Tương thích backend khác key
    formData.append('file', thumbnailFile, thumbnailFile.name)
    formData.append('image', thumbnailFile, thumbnailFile.name)
  }

  // ===== DEBUG LOG =====
  try {
    const debugEntries = []
    formData.forEach((value, key) => {
      if (value instanceof File || (typeof File !== 'undefined' && value?.name && value?.size !== undefined)) {
        debugEntries.push({ key, type: 'file', name: value.name, size: value.size })
      } else if (typeof value === 'string') {
        debugEntries.push({ key, type: 'string', length: value.length, preview: value.slice(0, 200) })
      } else {
        debugEntries.push({ key, type: typeof value })
      }
    })
    // eslint-disable-next-line no-console
    console.log('CreateEvent FormData:', debugEntries)
  } catch {}

  // Gửi multipart/form-data
  const response = await axiosClient.post('/events', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json'
    }
  })
  // eslint-disable-next-line no-console
  console.log('CreateEvent API response:', response)
  return response
}

// Cập nhật sự kiện (ADMIN)
export const updateEvent = async (id, eventData, thumbnailFile = null) => {
  const formData = new FormData()

  formData.append('event', JSON.stringify(eventData))

  if (thumbnailFile) {
    formData.append('thumbnail', thumbnailFile, thumbnailFile.name)
    formData.append('file', thumbnailFile, thumbnailFile.name)
    formData.append('image', thumbnailFile, thumbnailFile.name)
  }

  // ===== DEBUG LOG =====
  try {
    const debugEntries = []
    formData.forEach((value, key) => {
      if (value instanceof File || (typeof File !== 'undefined' && value?.name && value?.size !== undefined)) {
        debugEntries.push({ key, type: 'file', name: value.name, size: value.size })
      } else if (typeof value === 'string') {
        debugEntries.push({ key, type: 'string', length: value.length, preview: value.slice(0, 200) })
      } else {
        debugEntries.push({ key, type: typeof value })
      }
    })
    // eslint-disable-next-line no-console
    console.log('UpdateEvent FormData:', debugEntries)
  } catch {}

  const response = await axiosClient.put(`/events/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json'
    }
  })
  // eslint-disable-next-line no-console
  console.log('UpdateEvent API response:', response)
  return response
}

// Xóa sự kiện (ADMIN)
export const deleteEvent = async (id) => {
  // Theo swagger: xóa sự kiện dùng DELETE /events/{id}
  const response = await axiosClient.delete(`/events/${id}`)
  return response
}

export default { 
  getEvents, 
  getEventById, 
  createEvent, 
  updateEvent, 
  deleteEvent 
}



