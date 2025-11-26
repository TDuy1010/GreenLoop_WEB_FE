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
export const createProduct = async (productData, config = {}) => {
  try {
    const requestConfig = { ...config };
    if (typeof FormData !== 'undefined' && productData instanceof FormData) {
      requestConfig.headers = {
        ...(config.headers || {}),
        'Content-Type': 'multipart/form-data'
      };
    }
    const response = await axiosClient.post('/products', productData, requestConfig);
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

// ===== THÊM HÌNH ẢNH CHO SẢN PHẨM =====
/**
 * Upload thêm ảnh cho sản phẩm
 * @param {number} productId
 * @param {File[]|FileList} files
 * @returns {Promise}
 */
export const uploadProductAssets = async (productId, files) => {
  if (!productId) {
    throw new Error('productId is required to upload assets');
  }
  const formData = new FormData();
  const fileArray = Array.isArray(files) ? files : Array.from(files || []);
  if (!fileArray.length) {
    throw new Error('files is required to upload assets');
  }
  fileArray.forEach((file) => {
    if (file) {
      formData.append('files', file);
    }
  });

  try {
    const response = await axiosClient.post(
      `/products/${productId}/assets`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response;
  } catch (error) {
    console.error(`❌ [uploadProductAssets] Error for product ${productId}:`, error);
    throw error;
  }
};

// ===== THAY THẾ HÌNH ẢNH =====
/**
 * Replace a specific product image.
 * @param {number} productAssetId
 * @param {File} file
 * @returns {Promise}
 */
export const replaceProductAsset = async (productAssetId, file) => {
  if (!productAssetId) {
    throw new Error('productAssetId is required to replace asset');
  }
  if (!file) {
    throw new Error('file is required to replace asset');
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axiosClient.put(
      `/products/assets/${productAssetId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response;
  } catch (error) {
    console.error(`❌ [replaceProductAsset] Error for asset ${productAssetId}:`, error);
    throw error;
  }
};

// ===== XÓA/Disable HÌNH ẢNH =====
/**
 * Disable (delete) a specific product image.
 * @param {number} productAssetId
 * @returns {Promise}
 */
export const deleteProductAsset = async (productAssetId) => {
  if (!productAssetId) {
    throw new Error('productAssetId is required to delete asset');
  }
  try {
    const response = await axiosClient.delete(`/products/assets/${productAssetId}`);
    return response;
  } catch (error) {
    console.error(`❌ [deleteProductAsset] Error for asset ${productAssetId}:`, error);
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

// ===== SẢN PHẨM GÁN ĐƯỢC CHO SỰ KIỆN =====
/**
 * Lấy danh sách sản phẩm có thể gán cho một sự kiện
 * @param {number} eventId
 * @returns {Promise}
 */
export const getProductsAssignableToEvent = async (eventId) => {
  if (!eventId) {
    throw new Error('eventId is required to fetch assignable products');
  }
  try {
    const response = await axiosClient.get(`/products/assignable-to-event/${eventId}`);
    return response;
  } catch (error) {
    console.error(`❌ [getProductsAssignableToEvent] Error for event ${eventId}:`, error);
    throw error;
  }
};

// ===== TOGGLE PRODUCT STATUS =====
/**
 * Switch product status between AVAILABLE / UNAVAILABLE
 * @param {number} productId
 * @returns {Promise}
 */
export const toggleProductStatus = async (productId) => {
  if (!productId) {
    throw new Error('productId is required to toggle status');
  }
  try {
    const response = await axiosClient.patch(`/products/${productId}/toggle-status`);
    return response;
  } catch (error) {
    console.error(`❌ [toggleProductStatus] Error for product ${productId}:`, error);
    throw error;
  }
};

// ===== GÁN SẢN PHẨM CHO SỰ KIỆN =====
/**
 * Gán danh sách sản phẩm vào sự kiện với thời gian hiển thị
 * @param {Object} payload { eventId, productIds: number[], displayFrom, displayTo }
 * @returns {Promise}
 */
export const assignProductsToEvent = async (payload) => {
  if (!payload?.eventId || !Array.isArray(payload.productIds)) {
    throw new Error('eventId và productIds là bắt buộc');
  }
  try {
    const response = await axiosClient.post('/products/assign-to-event', payload);
    return response;
  } catch (error) {
    console.error('❌ [assignProductsToEvent] Error:', error);
    throw error;
  }
};

// ===== GỠ SẢN PHẨM KHỎI SỰ KIỆN =====
/**
 * Hủy mapping giữa sản phẩm và sự kiện
 * @param {Array<number|string>} mappingIds - danh sách product-event mapping IDs
 */
export const removeProductsFromEvent = async (mappingIds = []) => {
  if (!Array.isArray(mappingIds) || mappingIds.length === 0) {
    throw new Error('mappingIds là bắt buộc để gỡ sản phẩm khỏi sự kiện');
  }
  try {
    const response = await axiosClient.delete('/products/remove-from-event', {
      data: mappingIds
    });
    return response;
  } catch (error) {
    console.error('❌ [removeProductsFromEvent] Error:', error);
    throw error;
  }
};

// Export tất cả các functions
export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  uploadProductAssets,
  replaceProductAsset,
  deleteProductAsset,
  deleteProduct,
  getProductsAssignableToEvent,
  toggleProductStatus,
  assignProductsToEvent,
  removeProductsFromEvent
};

