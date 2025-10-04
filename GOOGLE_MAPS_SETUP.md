# Hướng dẫn cấu hình Google Maps

## Để sử dụng Google Maps trong ứng dụng:

### 1. Tạo Google Cloud Project
- Truy cập [Google Cloud Console](https://console.cloud.google.com/)
- Tạo project mới hoặc chọn project hiện có
- Bật billing cho project (bắt buộc)

### 2. Bật APIs cần thiết
- Vào **APIs & Services > Library**
- Tìm và bật các APIs sau:
  - **Maps JavaScript API**
  - **Geocoding API** (tùy chọn)
  - **Places API** (tùy chọn)

### 3. Tạo API Key
- Vào **APIs & Services > Credentials**
- Click **Create Credentials > API Key**
- Copy API key được tạo

### 4. Cấu hình API Key (Khuyến nghị)
- Click vào API key vừa tạo
- Trong **Application restrictions**:
  - Chọn **HTTP referrers (web sites)**
  - Thêm domain của bạn (ví dụ: `localhost:5173/*`, `yourdomain.com/*`)
- Trong **API restrictions**:
  - Chọn **Restrict key**
  - Chọn **Maps JavaScript API**

### 5. Cấu hình trong ứng dụng
- Tạo file `.env` trong thư mục root
- Thêm dòng: `VITE_GOOGLE_MAPS_API_KEY=your_api_key_here`
- Thay `your_api_key_here` bằng API key thực của bạn

### 6. Restart development server
```bash
npm run dev
```

## Lưu ý bảo mật:
- **KHÔNG** commit API key vào Git
- Luôn sử dụng restrictions cho API key
- Theo dõi usage để tránh chi phí không mong muốn
- Trong production, sử dụng environment variables

## Troubleshooting:
- Nếu map không hiển thị: Kiểm tra API key và restrictions
- Nếu có lỗi billing: Đảm bảo đã bật billing cho project
- Nếu có lỗi CORS: Kiểm tra HTTP referrer restrictions
