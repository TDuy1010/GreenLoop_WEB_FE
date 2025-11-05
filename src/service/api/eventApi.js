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
    console.log('CreateEvent FormData:', debugEntries)
  } catch (e) {
    console.warn('CreateEvent FormData inspect failed:', e)
  }

  // Gửi multipart/form-data
  const response = await axiosClient.post('/events', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json'
    }
  })
  console.log('CreateEvent API response:', response)
  return response
}

// Cập nhật sự kiện (ADMIN) - JSON body theo spec PUT /events/{id}
export const updateEvent = async (id, eventData) => {
  const response = await axiosClient.put(`/events/${id}`, eventData, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  console.log('UpdateEvent API response:', response)
  return response
}

// Upload/Update thumbnail riêng (ADMIN) - PUT /events/{id}/thumbnail
export const updateEventThumbnail = async (id, thumbnailFile) => {
  const formData = new FormData()
  if (thumbnailFile) {
    formData.append('thumbnail', thumbnailFile, thumbnailFile.name)
  }
  console.log('UpdateEventThumbnail FormData:', thumbnailFile ? { name: thumbnailFile.name, size: thumbnailFile.size } : 'no-file')
  const response = await axiosClient.put(`/events/${id}/thumbnail`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json'
    }
  })
  console.log('UpdateEventThumbnail API response:', response)
  return response
}

// Cập nhật trạng thái sự kiện (ADMIN) - PUT /events/{id}/status?status=...
export const updateEventStatus = async (id, status) => {
  const response = await axiosClient.put(`/events/${id}/status`, null, {
    params: { status },
    headers: { 'Accept': 'application/json' }
  })
  console.log('UpdateEventStatus API response:', response)
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
  updateEventThumbnail,
  updateEventStatus,
  deleteEvent 
}



