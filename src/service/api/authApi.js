import axiosClient from '../instance';

/**
 * =====================================================
 * AUTH API - Quản lý các API liên quan đến xác thực
 * =====================================================
 */

// ===== ĐĂNG NHẬP =====
/**
 * API đăng nhập người dùng
 * @param {Object} loginData - Dữ liệu đăng nhập
 * @param {string} loginData.email - Email người dùng
 * @param {string} loginData.password - Mật khẩu
 * @returns {Promise} Response từ server
 * 
 * Response structure:
 * {
 *   "success": true,
 *   "message": "string",
 *   "data": {
 *     "accessToken": "string",
 *     "refreshToken": "string",
 *     "type": "string",
 *     "userId": 123,
 *     "email": "string",
 *     "roles": ["USER", "ADMIN"],
 *     "expiresIn": 3600,
 *     "refreshExpiresIn": 86400
 *   },
 *   "statusCode": 200,
 *   "status": "OK",
 *   "path": "/api/v1/auth/login",
 *   "timestamp": "2025-10-31T14:29:22.798Z"
 * }
 */
export const loginUser = async (loginData) => {
  const response = await axiosClient.post('/auth/login', {
    email: loginData.email,
    password: loginData.password
  });

  // Xử lý response theo structure từ backend
  if (response.success && response.data) {
    const { accessToken, refreshToken, userId, email, roles, type, expiresIn, refreshExpiresIn } = response.data;
    
    // Lưu tokens
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    // Lưu thông tin user
    localStorage.setItem('userInfo', JSON.stringify({
      userId,
      email,
      roles,
      type,
      expiresIn,
      refreshExpiresIn
    }));
  }

  return response;
};

// ===== ĐĂNG KÝ =====
/**
 * API đăng ký người dùng mới
 * @param {Object} registerData - Dữ liệu đăng ký
 * @param {string} registerData.email - Email người dùng
 * @param {string} registerData.password - Mật khẩu
 * @param {string} registerData.fullName - Họ và tên
 * @param {string} registerData.phone - Số điện thoại
 * @param {string} registerData.gender - Giới tính
 * @param {string} registerData.dob - Ngày sinh (YYYY-MM-DD)
 * @returns {Promise} Response từ server
 */
export const registerUser = async (registerData) => {
  const response = await axiosClient.post('/auth/register', registerData);
  return response;
};

// ===== REFRESH TOKEN =====
/**
 * API làm mới access token
 * @returns {Promise} Response với token mới
 */
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await axiosClient.post('/auth/refresh', {
    refreshToken: refreshToken
  });

  // Cập nhật token mới
  if (response.success && response.data) {
    const { accessToken, refreshToken: newRefreshToken, expiresIn, refreshExpiresIn } = response.data;
    localStorage.setItem('accessToken', accessToken);
    if (newRefreshToken) {
      localStorage.setItem('refreshToken', newRefreshToken);
    }
    
    // Cập nhật userInfo với expiry time mới
    const userInfo = getUserInfo();
    if (userInfo) {
      localStorage.setItem('userInfo', JSON.stringify({
        ...userInfo,
        expiresIn,
        refreshExpiresIn
      }));
    }
  }

  return response;
};

// ===== ĐĂNG XUẤT =====
/**
 * Đăng xuất người dùng (xóa thông tin local)
 */
export const logoutUser = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userInfo');
  
  // Redirect về trang login
  window.location.href = '/login';
};

// ===== LẤY THÔNG TIN NGƯỜI DÙNG =====
/**
 * Lấy thông tin chi tiết người dùng hiện tại
 * @returns {Promise} Response với thông tin user
 */
export const getCurrentUser = async () => {
  const response = await axiosClient.get('/auth/me');
  return response;
};

// ===== CẬP NHẬT THÔNG TIN CÁ NHÂN =====
/**
 * Cập nhật thông tin cá nhân người dùng
 * @param {Object} userData - Dữ liệu cập nhật
 * @param {string} userData.fullName - Họ và tên
 * @param {string} userData.phone - Số điện thoại
 * @param {string} userData.gender - Giới tính (male/female/other)
 * @param {string} userData.dob - Ngày sinh (YYYY-MM-DD)
 * @returns {Promise} Response từ server
 */
export const updateUserProfile = async (userData) => {
  const response = await axiosClient.put('/auth/updatedetails', userData);
  return response;
};

// ===== ĐỔI MẬT KHẨU =====
/**
 * Đổi mật khẩu người dùng
 * @param {Object} passwordData - Dữ liệu đổi mật khẩu
 * @param {string} passwordData.currentPassword - Mật khẩu hiện tại
 * @param {string} passwordData.newPassword - Mật khẩu mới
 * @returns {Promise} Response từ server
 */
export const changePassword = async (passwordData) => {
  const response = await axiosClient.post('/auth/change-password', {
    currentPassword: passwordData.currentPassword,
    newPassword: passwordData.newPassword
  });
  return response;
};

// ===== QUÊN MẬT KHẨU =====
/**
 * Gửi yêu cầu reset mật khẩu
 * @param {string} email - Email người dùng
 * @returns {Promise} Response từ server
 */
export const forgotPassword = async (email) => {
  const response = await axiosClient.post('/auth/forgot-password', { email });
  return response;
};

// ===== RESET MẬT KHẨU =====
/**
 * Reset mật khẩu với OTP
 * @param {Object} resetData - Dữ liệu reset
 * @param {string} resetData.email - Email người dùng
 * @param {string} resetData.otp - Mã OTP 6 số
 * @param {string} resetData.newPassword - Mật khẩu mới
 * @returns {Promise} Response từ server
 * 
 * Request body:
 * {
 *   "email": "user@example.com",
 *   "otp": "123456",
 *   "newPassword": "NewPassword123"
 * }
 */
export const resetPassword = async (resetData) => {
  console.log('🔐 [API] Resetting password with:', {
    email: resetData.email,
    hasOtp: !!resetData.otp,
    hasNewPassword: !!resetData.newPassword
  })
  const response = await axiosClient.post('/auth/reset-password', resetData);
  console.log('✅ [API] Reset password response:', response)
  return response;
};

// ===== UPLOAD AVATAR =====
/**
 * Upload ảnh đại diện người dùng
 * @param {File} file - File ảnh
 * @returns {Promise} Response với URL ảnh
 */
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await axiosClient.post('/upload/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response;
};

// ===== KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP =====
/**
 * Kiểm tra xem người dùng đã đăng nhập chưa
 * @returns {boolean} True nếu đã đăng nhập
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  return !!token;
};

// ===== LẤY THÔNG TIN USER TỪ LOCALSTORAGE =====
/**
 * Lấy thông tin user từ localStorage
 * @returns {Object|null} Thông tin user hoặc null
 */
export const getUserInfo = () => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('Get user info failed:', error);
    return null;
  }
};

// ===== KIỂM TRA ROLE =====
/**
 * Kiểm tra xem user có role cụ thể không
 * @param {string} role - Role cần kiểm tra
 * @returns {boolean} True nếu có role
 */
export const hasRole = (role) => {
  const userInfo = getUserInfo();
  if (!userInfo || !userInfo.roles) return false;
  return userInfo.roles.includes(role);
};

// ===== VERIFY EMAIL =====
/**
 * Xác thực email với OTP code
 * @param {Object} data - Dữ liệu verify
 * @param {string} data.email - Email người dùng
 * @param {string} data.otp - Mã OTP 6 số
 * @returns {Promise} Response từ server
 * 
 * Request body:
 * {
 *   "email": "duytran2199@gmail.com",
 *   "otp": "841500"
 * }
 */
export const verifyEmail = async (data) => {
  console.log('🔐 [API] Verifying email with:', data)
  const response = await axiosClient.post('/auth/verify-email', {
    email: data.email,
    otp: data.otp
  });
  console.log('✅ [API] Verify response:', response)
  return response;
};

// ===== GỬI LẠI EMAIL XÁC THỰC =====
/**
 * Gửi lại email xác thực
 * @param {Object} data - Dữ liệu
 * @param {string} data.email - Email người dùng
 * @returns {Promise} Response từ server
 */
export const resendVerificationEmail = async (data) => {
  console.log('📧 [API] Resending verification to:', data.email)
  const response = await axiosClient.post('/auth/resend-verification', { 
    email: data.email 
  });
  console.log('✅ [API] Resend response:', response)
  return response;
};

// ===== GỬI LẠI OTP VERIFY EMAIL =====
/**
 * Gửi lại OTP xác thực email
 * @param {Object} data - Dữ liệu gửi OTP
 * @param {string} data.email - Email người dùng
 * @returns {Promise} Response từ server
 * 
 * Endpoint: POST /api/v1/auth/resend-verify-email-otp
 */
export const resendVerifyEmailOTP = async (data) => {
  console.log('📧 [API] Resending verify email OTP to:', data.email)
  const response = await axiosClient.post('/auth/resend-verify-email-otp', {
    email: data.email
  });
  console.log('✅ [API] Resend OTP response:', response)
  return response;
};

// ===== GỬI LẠI OTP RESET PASSWORD =====
/**
 * Gửi lại OTP reset mật khẩu
 * @param {Object} data - Dữ liệu gửi OTP
 * @param {string} data.email - Email người dùng
 * @returns {Promise} Response từ server
 * 
 * Endpoint: POST /api/v1/auth/resend-reset-password-otp
 */
export const resendResetPasswordOTP = async (data) => {
  const response = await axiosClient.post('/auth/resend-reset-password-otp', data);
  return response;
};

// ===== ĐĂNG XUẤT (SERVER-SIDE) =====
/**
 * Đăng xuất từ server (invalidate token)
 * @returns {Promise} Response từ server
 * 
 * Endpoint: POST /api/v1/auth/logout
 */
export const logoutFromServer = async () => {
  console.log('🌐 [API] Sending logout request to server...')
  
  const response = await axiosClient.post('/auth/logout');
  
  console.log('📡 [API] Logout response:', response)
  
  // Clear localStorage sau khi đăng xuất từ server
  console.log('🗑️ [API] Clearing localStorage...')
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userInfo');
  console.log('✅ [API] localStorage cleared')
  
  return response;
};

// ===== EXCHANGE OAUTH2 =====
/**
 * Exchange OAuth2 temporary key
 * @param {Object} data - Dữ liệu OAuth2
 * @param {string} data.code - Authorization code
 * @param {string} data.provider - OAuth provider (google, facebook)
 * @returns {Promise} Response từ server
 * 
 * Endpoint: POST /api/v1/auth/oauth2/exchange
 */
export const exchangeOAuth2 = async (data) => {
  const response = await axiosClient.post('/auth/oauth2/exchange', data);
  
  // Lưu token nếu đăng nhập thành công qua OAuth
  if (response.success && response.data) {
    const { accessToken, refreshToken, userId, email, roles, type, expiresIn, refreshExpiresIn } = response.data;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userInfo', JSON.stringify({
      userId,
      email,
      roles,
      type,
      expiresIn,
      refreshExpiresIn
    }));
  }
  
  return response;
};

// Export tất cả các functions
export default {
  loginUser,
  registerUser,
  refreshAccessToken,
  logoutUser,
  logoutFromServer,
  getCurrentUser,
  updateUserProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  uploadAvatar,
  isAuthenticated,
  getUserInfo,
  hasRole,
  verifyEmail,
  resendVerificationEmail,
  resendVerifyEmailOTP,
  resendResetPasswordOTP,
  exchangeOAuth2
};

