import axiosClient from '../instance'

// Lấy danh sách nhân viên (ADMIN/MANAGER)
// Endpoint: GET /admin/employees
// Params hỗ trợ: page, size, search, status, sortBy, sortDir
export const getEmployees = async (params = {}) => {
  const {
    page = 0,
    size = 10,
    search,
    status,
    sortBy = 'createdAt',
    sortDir = 'DESC'
  } = params

  const response = await axiosClient.get('/admin/employees', {
    params: {
      page,
      size,
      search,
      status,
      sortBy,
      sortDir
    }
  })

  return response
}

export default {
  getEmployees
}


