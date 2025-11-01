import axios from "axios";

// ===== CONFIGURATION =====
// Domain chính của API
const API_CONFIG = {
  // Trong development: sử dụng proxy (/api) để bypass CORS
  // Trong production: sử dụng URL đầy đủ
  BASE_URL: import.meta.env.MODE === 'development' 
    ? '/api/v1'  // Proxy sẽ forward đến https://api.greenloop.thanhnt-tech.id.vn/api/v1
    : 'https://api.greenloop.thanhnt-tech.id.vn/api/v1',
  TIMEOUT: 10000,
};

// Export config để sử dụng ở nơi khác nếu cần
export { API_CONFIG };

// ===== AXIOS INSTANCE =====
const axiosClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===== FLAG ĐỂ TRÁNH INFINITE LOOP KHI REFRESH TOKEN =====
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// ===== REQUEST INTERCEPTOR =====
// Tự động gắn token vào mỗi request
axiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // Lấy token từ localStorage
      const token = localStorage.getItem("accessToken");
      
      // Nếu có token thì gắn vào header Authorization
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ===== RESPONSE INTERCEPTOR =====
// Xử lý response và tự động refresh token khi hết hạn
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về data từ response
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 (Unauthorized) và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Nếu đang refresh token, thêm request vào queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      // Nếu có refresh token, thử refresh
      if (refreshToken) {
        try {
          // Gọi API refresh token
          const response = await axios.post(
            `${API_CONFIG.BASE_URL}/auth/refresh`,
            { refresh_token: refreshToken }
          );

          if (response.data.success && response.data.data) {
            const { accessToken, refreshToken: newRefreshToken } = response.data.data;
            
            // Lưu token mới vào localStorage
            localStorage.setItem("accessToken", accessToken);
            if (newRefreshToken) {
              localStorage.setItem("refreshToken", newRefreshToken);
            }

            // Cập nhật userInfo nếu có
            const userInfo = JSON.parse(localStorage.getItem("userInfo") || '{}');
            if (userInfo && Object.keys(userInfo).length > 0) {
              localStorage.setItem("userInfo", JSON.stringify({
                ...userInfo,
                expiresIn: response.data.data.expiresIn,
                refreshExpiresIn: response.data.data.refreshExpiresIn
              }));
            }

            // Cập nhật header và retry request
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            
            processQueue(null, accessToken);
            isRefreshing = false;
            
            return axiosClient(originalRequest);
          }
        } catch (refreshError) {
          console.error("Refresh token failed:", refreshError);
          processQueue(refreshError, null);
          isRefreshing = false;
          
          // Clear token và redirect về login
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("userInfo");
          
          // Kiểm tra current path để redirect đúng
          const currentPath = window.location.pathname;
          if (currentPath.startsWith('/admin')) {
            window.location.href = '/admin/login';
          } else {
            window.location.href = '/login';
          }
          
          return Promise.reject(refreshError);
        }
      } else {
        // Không có refresh token, clear và redirect
        isRefreshing = false;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userInfo");
        
        // Kiểm tra current path để redirect đúng
        const currentPath = window.location.pathname;
        if (currentPath.startsWith('/admin')) {
          window.location.href = '/admin/login';
        } else {
          window.location.href = '/login';
        }
      }
    }

    // Xử lý các lỗi khác
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error.response?.data || error);
  }
);

export default axiosClient;
