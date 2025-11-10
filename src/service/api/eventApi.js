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

// Lấy danh sách sự kiện cho CUSTOMER theo filter
export const getCustomerEvents = async (params = {}) => {
  const {
    page = 0,
    size = 10,
    code,
    status,
    search,
    startTime,
    endTime,
    sortBy = 'createdAt',
    sortDir = 'DESC'
  } = params

  const response = await axiosClient.get('/events/customers', {
    params: { page, size, code, status, search, startTime, endTime, sortBy, sortDir }
  })
  return response
}

// Lấy danh sách sự kiện mà người dùng hiện tại đã đăng ký (CUSTOMER)
export const getMyRegisteredEvents = async (params = {}) => {
  const {
    page = 0,
    size = 10,
    sortBy = 'createdAt',
    sortDir = 'DESC',
    status
  } = params

  // Đường dẫn có thể thay đổi theo backend; mặc định dùng endpoint chuyên biệt
  const response = await axiosClient.get('/events/my-events', {
    params: {
      page,
      size,
      sortBy,
      sortDir,
      // Một số backend hỗ trợ lọc theo trạng thái đăng ký (REGISTERED, CANCELLED, ...)
      // Nếu không hỗ trợ, server sẽ bỏ qua tham số này.
      ...(status ? { status } : {})
    }
  })
  return response
}

// Lấy chi tiết sự kiện cho CUSTOMER theo ID
export const getCustomerEventById = async (id) => {
  const response = await axiosClient.get(`/events/customers/${id}`)
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

// Lấy danh sách nhân viên đã được assign vào sự kiện - GET /events/{eventId}/staffs
export const getEventStaffs = async (eventId) => {
  const response = await axiosClient.get(`/events/${eventId}/staffs`)
  console.log('GetEventStaffs API response:', response)
  return response
}

// Lấy danh sách người đăng ký của sự kiện (ADMIN)
// GET /events/admin/{eventId}/registrations
export const getEventRegistrations = async (eventId, params = {}) => {
  const {
    page = 0,
    size = 15,
    sortBy = 'createdAt',
    sortDir = 'DESC',
    status,
    active
  } = params

  const response = await axiosClient.get(`/events/admin/${eventId}/registrations`, {
    params: {
      page,
      size,
      sortBy,
      sortDir,
      ...(status ? { status } : {}),
      ...(active !== undefined ? { active } : {})
    }
  })
  return response
}

// Cập nhật trạng thái đăng ký của một user trong sự kiện (ADMIN)
// PUT /events/admin/{eventId}/status
// body: { userId: number, registrationStatus: 'BOOKED' | 'CANCELED' | 'CHECKED_IN' }
export const updateEventRegistrationStatus = async (eventId, payload) => {
  // Nếu userId là số an toàn → gửi số; nếu không thì gửi chuỗi để tránh mất chính xác
  const asNumber = Number(payload?.userId)
  const isSafe = Number.isFinite(asNumber) && Math.abs(asNumber) <= Number.MAX_SAFE_INTEGER
  const body = isSafe
    ? { userId: asNumber, registrationStatus: payload?.registrationStatus }
    : { userId: String(payload?.userId), registrationStatus: payload?.registrationStatus }
  const response = await axiosClient.put(`/events/admin/${eventId}/status`, body, {
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
  })
  return response
}

// Kích hoạt (active) một sự kiện - PUT /events/{id}/activate
export const activateEvent = async (id) => {
  const response = await axiosClient.put(`/events/${id}/activate`)
  return response
}

// Gán nhiều nhân sự vào sự kiện - POST /events/staffs
// Body: { eventId: number, staffAssignments: [{ staffId: number, storeManager: boolean }] }
export const assignEventStaffs = async (payload) => {
  const response = await axiosClient.post('/events/staffs', payload, {
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
  })
  console.log('AssignEventStaffs API response:', response)
  return response
}

// Cập nhật nhân sự đã được assign vào sự kiện - PUT /events/{eventId}/staffs
// Body: { eventId: number, staffAssignments: [{ staffId: number, storeManager: boolean }] }
export const updateEventStaffs = async (eventId, payload) => {
  const response = await axiosClient.put(`/events/${eventId}/staffs`, payload, {
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
  })
  console.log('UpdateEventStaffs API response:', response)
  return response
}

// Xóa sự kiện (ADMIN)
export const deleteEvent = async (id) => {
  // Theo swagger: xóa sự kiện dùng DELETE /events/{id}
  const response = await axiosClient.delete(`/events/${id}`)
  return response
}

// Đăng ký tham gia sự kiện (CUSTOMER) - POST /events/{eventId}/register
// body: { note: string }
export const registerCustomerToEvent = async (eventId, note) => {
  const response = await axiosClient.post(`/events/${eventId}/register`, { note })
  return response
}

// Hủy đăng ký tham gia sự kiện của user hiện tại (CUSTOMER)
// Suy đoán REST: DELETE /events/{eventId}/register
export const cancelCustomerRegistration = async (eventId) => {
  // Theo swagger: PUT /events/{eventId}/cancel
  const response = await axiosClient.put(`/events/${eventId}/cancel`)
  return response
}

export default { 
  getEvents, 
  getCustomerEvents,
  getMyRegisteredEvents,
  getCustomerEventById,
  getEventById, 
  createEvent, 
  updateEvent, 
  updateEventThumbnail,
  updateEventStatus,
  getEventStaffs,
  assignEventStaffs,
  updateEventStaffs,
  deleteEvent,
  registerCustomerToEvent,
  cancelCustomerRegistration,
  getEventRegistrations,
  updateEventRegistrationStatus,
  activateEvent 
}



