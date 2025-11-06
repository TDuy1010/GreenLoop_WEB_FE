import axiosClient from '../instance'

// Lấy thông tin hồ sơ người dùng hiện tại
// Endpoint: GET /api/v1/users/profile
// Trả về dạng đã được interceptor unwrap: { success, data, ... }
export const getCurrentUserProfile = async () => {
  const response = await axiosClient.get('/users/profile')
  return response
}

export default {
  getCurrentUserProfile
}


