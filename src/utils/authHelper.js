/**
 * =====================================================
 * AUTH HELPER - Các hàm hỗ trợ xác thực
 * =====================================================
 */

/**
 * Lưu thông tin đăng nhập vào localStorage
 * @param {Object} authData - Dữ liệu xác thực
 * @param {string} authData.accessToken - Access token
 * @param {string} authData.refreshToken - Refresh token
 * @param {Object} authData.user - Thông tin user
 */
export const saveAuthData = (authData) => {
  console.log('💾 [AuthHelper] Saving auth data:', {
    userId: authData.userId,
    email: authData.email,
    roles: authData.roles,
    hasAccessToken: !!authData.accessToken,
    hasRefreshToken: !!authData.refreshToken
  })
  
  const { accessToken, refreshToken, userId, email, roles, type } = authData;
  
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('userInfo', JSON.stringify({
    userId,
    email,
    roles,
    type
  }));
  
  console.log('✅ [AuthHelper] Auth data saved successfully')
};

/**
 * Xóa tất cả thông tin xác thực
 */
export const clearAuthData = () => {
  console.log('🗑️ [AuthHelper] Clearing all auth data...')
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userInfo');
  console.log('✅ [AuthHelper] All auth data cleared')
};

/**
 * Lấy access token
 * @returns {string|null}
 */
export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

/**
 * Lấy refresh token
 * @returns {string|null}
 */
export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

/**
 * Lấy thông tin user
 * @returns {Object|null}
 */
export const getUserInfo = () => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('Error parsing user info:', error);
    return null;
  }
};

/**
 * Kiểm tra xem user đã đăng nhập chưa
 * @returns {boolean}
 */
export const isLoggedIn = () => {
  const token = getAccessToken();
  return !!token;
};

/**
 * Kiểm tra user có role cụ thể không
 * @param {string|string[]} requiredRoles - Role(s) cần kiểm tra
 * @returns {boolean}
 */
export const hasRole = (requiredRoles) => {
  const userInfo = getUserInfo();
  if (!userInfo || !userInfo.roles) return false;

  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  return roles.some(role => userInfo.roles.includes(role));
};

/**
 * Kiểm tra token có hết hạn không (dựa vào JWT)
 * @param {string} token - JWT token
 * @returns {boolean}
 */
export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expiry;
  } catch (error) {
    console.error('Error checking token expiry:', error);
    return true;
  }
};

/**
 * Redirect về trang phù hợp sau khi login
 * @param {Array} roles - Danh sách roles của user
 */
export const redirectAfterLogin = (roles) => {
  if (!roles || roles.length === 0) {
    window.location.href = '/';
    return;
  }

  // Admin redirect
  if (roles.includes('ADMIN') || roles.includes('admin')) {
    window.location.href = '/admin/dashboard';
    return;
  }

  // Staff redirect
  if (roles.includes('STAFF') || roles.includes('staff')) {
    window.location.href = '/admin/orders';
    return;
  }

  // Customer/User redirect
  if (roles.includes('CUSTOMER') || roles.includes('USER') || roles.includes('customer') || roles.includes('user')) {
    window.location.href = '/';
    return;
  }

  // Default redirect
  window.location.href = '/';
};

/**
 * Format lỗi từ API
 * @param {Object} error - Error object
 * @returns {string} Thông báo lỗi
 */
export const formatAuthError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.message) {
    return error.message;
  }

  return 'Đã có lỗi xảy ra. Vui lòng thử lại!';
};

/**
 * Validate email
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password
 * @param {string} password
 * @returns {Object} { isValid: boolean, message: string }
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Mật khẩu không được để trống' };
  }

  if (password.length < 8) {
    return { isValid: false, message: 'Mật khẩu phải có ít nhất 8 ký tự' };
  }

  // Kiểm tra có chữ hoa
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Mật khẩu phải có ít nhất 1 chữ hoa' };
  }

  // Kiểm tra có chữ thường
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Mật khẩu phải có ít nhất 1 chữ thường' };
  }

  // Kiểm tra có số
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Mật khẩu phải có ít nhất 1 số' };
  }

  return { isValid: true, message: 'Mật khẩu hợp lệ' };
};

/**
 * Kiểm tra password strength
 * @param {string} password
 * @returns {Object} { strength: string, score: number }
 */
export const checkPasswordStrength = (password) => {
  let score = 0;
  
  if (!password) return { strength: 'Yếu', score: 0 };

  // Length
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // Contains lowercase
  if (/[a-z]/.test(password)) score += 1;

  // Contains uppercase
  if (/[A-Z]/.test(password)) score += 1;

  // Contains numbers
  if (/[0-9]/.test(password)) score += 1;

  // Contains special characters
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { strength: 'Yếu', score };
  if (score <= 4) return { strength: 'Trung bình', score };
  return { strength: 'Mạnh', score };
};

export default {
  saveAuthData,
  clearAuthData,
  getAccessToken,
  getRefreshToken,
  getUserInfo,
  isLoggedIn,
  hasRole,
  isTokenExpired,
  redirectAfterLogin,
  formatAuthError,
  isValidEmail,
  validatePassword,
  checkPasswordStrength
};

