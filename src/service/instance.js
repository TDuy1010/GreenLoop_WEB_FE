import axios from "axios";

// ===== CONFIGURATION =====
// Domain chính của API
const API_CONFIG = {
  // Trong development: sử dụng proxy (/api) để bypass CORS
  // Trong production: sử dụng URL từ env variable hoặc mặc định
  BASE_URL: import.meta.env.MODE === 'development' 
    ? '/api/v1'  // Proxy sẽ forward đến https://api.greenloop.thanhnt-tech.id.vn/api/v1
    : (import.meta.env.VITE_API_URL || 'https://api.greenloop.thanhnt-tech.id.vn/api/v1'),
  TIMEOUT: 10000,
};

// ===== DEBUG/SAFETY SWITCH =====
// Đặt false để cho phép tự động đăng xuất & chuyển hướng khi token hết hạn
const DISABLE_AUTO_LOGOUT = false;

// Export config để sử dụng ở nơi khác nếu cần
export { API_CONFIG };

const forceLogout = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userInfo");
  const currentPath = window.location.pathname;
  if (currentPath.startsWith('/admin')) {
    window.location.href = '/admin/login';
  } else {
    window.location.href = '/login';
  }
};

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
// đếm số lần 401 liên tiếp (nếu cần dùng cho UI), tạm thời không sử dụng
// let authFailureCount = 0;

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

// ===== TOKEN UTILS =====
const getJwtExpiryMs = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload?.exp ? payload.exp * 1000 : 0;
  } catch {
    return 0;
  }
};

const isTokenExpiringSoon = (token, thresholdMs = 60_000) => {
  if (!token) return true;
  const expMs = getJwtExpiryMs(token);
  if (!expMs) return false;
  return Date.now() + thresholdMs >= expMs;
};

// ===== REQUEST INTERCEPTOR =====
// Tự động gắn token vào mỗi request
axiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // Lấy token từ localStorage
      const token = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const hadAuthTokens = Boolean(localStorage.getItem("accessToken") || refreshToken);

      // Chủ động refresh nếu token sắp hết hạn để tránh 401 giữa chừng
      if (token && refreshToken && isTokenExpiringSoon(token) && !isRefreshing) {
        // Bật cờ refresh để chặn gọi trùng
        isRefreshing = true;
        return new Promise((resolve, reject) => {
          axios.post(
              `${API_CONFIG.BASE_URL}/auth/refresh`,
              { refreshToken }
          ).then((response) => {
              if (response.data.success && response.data.data) {
                const { accessToken, refreshToken: newRefreshToken } = response.data.data;
                localStorage.setItem("accessToken", accessToken);
                if (newRefreshToken) {
                  localStorage.setItem("refreshToken", newRefreshToken);
                }

                // Cập nhật userInfo expiry
                const userInfo = JSON.parse(localStorage.getItem("userInfo") || '{}');
                if (userInfo && Object.keys(userInfo).length > 0) {
                  localStorage.setItem("userInfo", JSON.stringify({
                    ...userInfo,
                    expiresIn: response.data.data.expiresIn,
                    refreshExpiresIn: response.data.data.refreshExpiresIn
                  }));
                }

                processQueue(null, accessToken);
                config.headers.Authorization = `Bearer ${accessToken}`;
                isRefreshing = false;
                resolve(config);
              } else {
                throw new Error('Refresh token response invalid');
              }
          }).catch((err) => {
            processQueue(err, null);
            isRefreshing = false;
            // Chỉ đăng xuất khi refresh bị từ chối (401/403)
            const status = err?.response?.status;
            if ((status === 401 || status === 403) && !DISABLE_AUTO_LOGOUT) {
              forceLogout();
            }
            reject(err);
          });
        });
      }

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
            { refreshToken }
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

          // Chỉ đăng xuất khi refresh bị từ chối (401/403)
          const status = refreshError?.response?.status;
          if ((status === 401 || status === 403) && !DISABLE_AUTO_LOGOUT) {
            forceLogout();
          }
          return Promise.reject(refreshError);
        }
      } else {
        isRefreshing = false;
        if (hadAuthTokens && !DISABLE_AUTO_LOGOUT) {
          forceLogout();
        }
        return Promise.reject(error.response?.data || error);
      }
    }

    // Xử lý các lỗi khác
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error.response?.data || error);
  }
);

export default axiosClient;
