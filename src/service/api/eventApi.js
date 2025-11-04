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

  const response = await axiosClient.get('/events', {
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

export default { getEvents }

// Lấy chi tiết sự kiện theo ID
export const getEventById = async (id) => {
  const response = await axiosClient.get(`/events/${id}`)
  return response
}



