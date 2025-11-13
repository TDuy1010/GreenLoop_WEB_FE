import axiosClient from '../instance';

const API_URL = '/admin/employees';

/**
 * Lấy danh sách nhân viên với phân trang, tìm kiếm và lọc
 * @param {Object} params - Các tham số tìm kiếm
 * @param {number} params.page - Số trang (mặc định: 0)
 * @param {number} params.size - Số lượng item mỗi trang (mặc định: 10)
 * @param {string} params.search - Tìm kiếm theo tên, email hoặc số điện thoại
 * @param {boolean} params.status - Lọc theo trạng thái active (true/false)
 * @param {string} params.sortBy - Trường để sắp xếp (mặc định: createdAt)
 * @param {string} params.sortDir - Hướng sắp xếp: ASC hoặc DESC (mặc định: DESC)
 * @returns {Promise} Response data từ API
 */
export const getEmployees = async (params = {}) => {
  try {
    const {
      page = 0,
      size = 10,
      search = '',
      status = null,
      sortBy = 'createdAt',
      sortDir = 'DESC'
    } = params;

    // Tạo query params
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir
    });

    // Thêm search nếu có
    if (search && search.trim()) {
      queryParams.append('search', search.trim());
    }

    // Thêm status nếu có giá trị rõ ràng
    if (status !== null && status !== undefined && status !== '') {
      queryParams.append('status', status.toString());
    }

    const response = await axiosClient.get(`${API_URL}?${queryParams.toString()}`);
    return response;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

/**
 * Lấy thông tin chi tiết một nhân viên theo ID
 * @param {number} employeeId - ID của nhân viên
 * @returns {Promise} Response data từ API
 */
export const getEmployeeById = async (employeeId) => {
  try {
    const response = await axiosClient.get(`${API_URL}/${employeeId}`);
    return response;
  } catch (error) {
    console.error(`Error fetching employee ${employeeId}:`, error);
    throw error;
  }
};

/**
 * Tạo nhân viên mới với avatar (optional)
 * @param {Object} employeeData - Thông tin nhân viên
 * @param {string} employeeData.email - Email
 * @param {string} employeeData.fullName - Họ và tên
 * @param {string} employeeData.phone - Số điện thoại
 * @param {string} employeeData.role - Chức vụ (STAFF, MANAGER, ADMIN)
 * @param {File} avatar - File ảnh avatar (optional)
 * @returns {Promise} Response data từ API
 */
export const createEmployee = async (employeeData, avatar = null) => {
  try {
    const formData = new FormData();
    
    // Tạo request object
    const request = {
      email: employeeData.email,
      fullName: employeeData.fullName,
      phone: employeeData.phone,
      role: employeeData.role
    };
    
    // Thêm request dưới dạng JSON blob
    formData.append('request', new Blob([JSON.stringify(request)], {
      type: 'application/json'
    }));
    
    // Thêm avatar nếu có
    if (avatar) {
      formData.append('avatar', avatar);
    }
    
    const response = await axiosClient.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response;
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
};

/**
 * Cập nhật thông tin nhân viên với avatar (optional)
 * @param {number} employeeId - ID của nhân viên
 * @param {Object} employeeData - Thông tin nhân viên cần cập nhật
 * @param {string} employeeData.email - Email
 * @param {string} employeeData.fullName - Họ và tên
 * @param {string} employeeData.phone - Số điện thoại
 * @param {string} employeeData.dateOfBirth - Ngày sinh (YYYY-MM-DD)
 * @param {string} employeeData.gender - Giới tính (MALE/FEMALE/OTHER)
 * @param {string} employeeData.role - Chức vụ (STAFF, MANAGER, ADMIN, STORE_MANAGER, SUPPORT_STAFF)
 * @param {boolean} employeeData.isActive - Trạng thái hoạt động
 * @param {File} avatar - File ảnh avatar (optional)
 * @returns {Promise} Response data từ API
 */
export const updateEmployee = async (employeeId, employeeData, avatar = null) => {
  try {
    const formData = new FormData();
    
    // Tạo request object
    const request = {
      email: employeeData.email,
      fullName: employeeData.fullName,
      phone: employeeData.phone,
      dateOfBirth: employeeData.dateOfBirth,
      gender: employeeData.gender,
      role: employeeData.role,
      isActive: employeeData.isActive
    };
    
    // Thêm request dưới dạng JSON blob
    formData.append('request', new Blob([JSON.stringify(request)], {
      type: 'application/json'
    }));
    
    // Thêm avatar nếu có
    if (avatar) {
      formData.append('avatar', avatar);
    }
    
    const response = await axiosClient.put(`${API_URL}/${employeeId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response;
  } catch (error) {
    console.error(`Error updating employee ${employeeId}:`, error);
    throw error;
  }
};

/**
 * Reset mật khẩu nhân viên - Tạo mật khẩu tạm thời mới
 * @param {number} employeeId - ID của nhân viên
 * @returns {Promise} Response data từ API chứa temporary password
 */
export const resetEmployeePassword = async (employeeId) => {
  try {
    const response = await axiosClient.post(
      `${API_URL}/${employeeId}/reset-password`
    );
    return response;
  } catch (error) {
    console.error(`Error resetting password for employee ${employeeId}:`, error);
    throw error;
  }
};

/**
 * Cập nhật trạng thái active của nhân viên
 * @param {number} employeeId - ID của nhân viên
 * @param {boolean} isActive - Trạng thái mới (true/false)
 * @returns {Promise} Response data từ API
 */
export const updateEmployeeStatus = async (employeeId, isActive) => {
  try {
    const response = await axiosClient.patch(
      `${API_URL}/${employeeId}/status?isActive=${isActive}`
    );
    return response;
  } catch (error) {
    console.error(`Error updating employee ${employeeId} status:`, error);
    throw error;
  }
};

export default {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  resetEmployeePassword,
  updateEmployeeStatus
};


