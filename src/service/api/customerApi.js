import axiosClient from '../instance';

const API_URL = '/admin/customers';

/**
 * Lấy danh sách khách hàng với phân trang, tìm kiếm và lọc
 * @param {Object} params - Các tham số tìm kiếm
 * @param {number} params.page - Số trang (mặc định: 0)
 * @param {number} params.size - Số lượng item mỗi trang (mặc định: 10)
 * @param {string} params.search - Tìm kiếm theo email, tên hoặc số điện thoại
 * @param {boolean} params.status - Lọc theo trạng thái active (true/false)
 * @param {string} params.sortBy - Trường để sắp xếp (mặc định: createdAt)
 * @param {string} params.sortDir - Hướng sắp xếp: ASC hoặc DESC (mặc định: DESC)
 * @returns {Promise} Response data từ API
 */
export const getCustomerList = async (params = {}) => {
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
    console.error('Error fetching customer list:', error);
    throw error;
  }
};

/**
 * Lấy thông tin chi tiết một khách hàng theo ID
 * @param {number} customerId - ID của khách hàng
 * @returns {Promise} Response data từ API
 */
export const getCustomerById = async (customerId) => {
  try {
    const response = await axiosClient.get(`${API_URL}/${customerId}`);
    return response;
  } catch (error) {
    console.error(`Error fetching customer ${customerId}:`, error);
    throw error;
  }
};

/**
 * Cập nhật trạng thái active của khách hàng
 * @param {number} customerId - ID của khách hàng
 * @param {boolean} isActive - Trạng thái mới (true/false)
 * @returns {Promise} Response data từ API
 */
export const updateCustomerStatus = async (customerId, isActive) => {
  try {
    const response = await axiosClient.patch(
      `${API_URL}/${customerId}/status?isActive=${isActive}`
    );
    return response;
  } catch (error) {
    console.error(`Error updating customer ${customerId} status:`, error);
    throw error;
  }
};