import axios from "axios";

// Tạo instance của axios
const axiosClient = axios.create({
  baseURL: "https://api.greenloop.thanhnt-tech.id.vn/", // 🔹 URL API gốc
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptors để gắn token hoặc xử lý lỗi
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error);
    throw error;
  }
);

export default axiosClient;
