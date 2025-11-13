import axiosClient from '../instance'

// Lấy thông tin hồ sơ người dùng hiện tại
// Endpoint: GET /api/v1/users/profile
// Trả về dạng đã được interceptor unwrap: { success, data, ... }
export const getCurrentUserProfile = async () => {
  const response = await axiosClient.get('/users/profile')
  return response
}

// Cập nhật thông tin hồ sơ người dùng
// Endpoint: PUT /api/v1/users/profile
// Body: multipart/form-data with request (JSON) and avatar (file)
export const updateUserProfile = async (userData, avatar = null) => {
  try {
    const formData = new FormData()
    
    // Tạo request object
    const request = {
      fullName: userData.fullName,
      dateOfBirth: userData.dateOfBirth,
      gender: userData.gender,
      phoneNumber: userData.phoneNumber
    }
    
    // Append request as JSON blob
    formData.append('request', new Blob([JSON.stringify(request)], {
      type: 'application/json'
    }))
    
    // Append avatar if provided
    if (avatar) {
      formData.append('avatar', avatar)
    }
    
    const response = await axiosClient.put('/users/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return response
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}

export default {
  getCurrentUserProfile,
  updateUserProfile
}


