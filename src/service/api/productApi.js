import axiosClient from '../instance';

/**
 * =====================================================
 * PRODUCT API - Quản lý các API liên quan đến sản phẩm
 * =====================================================
 */

// ===== LẤY DANH SÁCH SẢN PHẨM =====
/**
 * Lấy danh sách sản phẩm với phân trang và bộ lọc
 * @param {Object} params - Tham số query
 * @param {number} params.page - Số trang (bắt đầu từ 0)
 * @param {number} params.size - Số sản phẩm mỗi trang
 * @param {string} params.search - Tìm kiếm theo tên, mã, hoặc mô tả
 * @param {string} params.status - Lọc theo trạng thái (PENDING, AVAILABLE, SOLD, UNAVAILABLE)
 * @param {string} params.type - Lọc theo loại (DONATION, PURCHASE)
 * @param {number} params.categoryId - Lọc theo ID danh mục
 * @param {string} params.sortBy - Sắp xếp theo trường (createdAt, price, name, etc.)
 * @param {string} params.sortDir - Hướng sắp xếp (ASC/DESC)
 * @returns {Promise} Response với danh sách sản phẩm
 * 
 * Response structure:
 * {
 *   "success": true,
 *   "message": "Lấy danh sách sản phẩm thành công",
 *   "data": {
 *     "content": [],
 *     "pageNumber": 0,
 *     "pageSize": 10,
 *     "totalElements": 15,
 *     "totalPages": 2,
 *     "first": true,
 *     "last": false,
 *     "empty": false
 *   },
 *   "statusCode": 200,
 *   "status": "OK",
 *   "timestamp": "2025-11-17T02:52:07"
 * }
 */
export const getProducts = async (params = {}) => {
  try {
    // Build query params
    const queryParams = new URLSearchParams();
    
    // Pagination
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);
    
    // Filters
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.type) queryParams.append('type', params.type);
    if (params.categoryId) queryParams.append('categoryId', params.categoryId);
    
    // Sorting
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDir) queryParams.append('sortDir', params.sortDir);
    
    const response = await axiosClient.get(`/products?${queryParams.toString()}`);
    return response;
  } catch (error) {
    console.error('❌ [getProducts] Error:', error);
    throw error;
  }
};

// ===== LẤY CHI TIẾT SẢN PHẨM =====
/**
 * Lấy thông tin chi tiết của một sản phẩm
 * @param {number} productId - ID của sản phẩm
 * @returns {Promise} Response với thông tin chi tiết sản phẩm
 */
export const getProductById = async (productId) => {
  try {
    const response = await axiosClient.get(`/products/${productId}`);
    return response;
  } catch (error) {
    console.error(`❌ [getProductById] Error for product ${productId}:`, error);
    throw error;
  }
};

// ===== TẠO SẢN PHẨM MỚI =====
/**
 * Tạo sản phẩm mới (Admin/Staff)
 * @param {Object} productData - Dữ liệu sản phẩm
 * @returns {Promise} Response từ server
 */
export const createProduct = async (productData) => {
  try {
    const response = await axiosClient.post('/products', productData);
    return response;
  } catch (error) {
    console.error('❌ [createProduct] Error:', error);
    throw error;
  }
};

// ===== CẬP NHẬT SẢN PHẨM =====
/**
 * Cập nhật thông tin sản phẩm (Admin/Staff)
 * @param {number} productId - ID của sản phẩm
 * @param {Object} productData - Dữ liệu cập nhật
 * @returns {Promise} Response từ server
 */
export const updateProduct = async (productId, productData) => {
  try {
    const response = await axiosClient.put(`/products/${productId}`, productData);
    return response;
  } catch (error) {
    console.error(`❌ [updateProduct] Error for product ${productId}:`, error);
    throw error;
  }
};

// ===== XÓA SẢN PHẨM =====
/**
 * Xóa sản phẩm (Admin/Staff)
 * @param {number} productId - ID của sản phẩm
 * @returns {Promise} Response từ server
 */
export const deleteProduct = async (productId) => {
  try {
    const response = await axiosClient.delete(`/products/${productId}`);
    return response;
  } catch (error) {
    console.error(`❌ [deleteProduct] Error for product ${productId}:`, error);
    throw error;
  }
};

// Export tất cả các functions
export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};

