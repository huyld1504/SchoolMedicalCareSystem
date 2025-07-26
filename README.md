# 🏥 School Medical Care System

Hệ thống quản lý chăm sóc sức khỏe học sinh cho trường học - Quản lý hồ sơ sức khỏe, tiêm chủng và đơn thuốc.

## 📋 Tổng quan

Ứng dụng web quản lý hoạt động y tế tại trường học với 3 vai trò chính:
- **👨‍💼 Admin**: Quản lý người dùng, tạo chiến dịch tiêm chủng
- **👩‍⚕️ Y tá**: Ghi nhận tiêm chủng, xử lý đơn thuốc
- **👨‍👩‍👧‍👦 Phụ huynh**: Xem thông tin con, đồng ý tiêm chủng

## 🛠️ Công nghệ
- **Frontend**: React + Material-UI + Redux
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB

## 🚀 Cài đặt và chạy

### Yêu cầu
- Node.js >= 16.0.0
- MongoDB

### 1. Clone và cài đặt
```bash
git clone <repository-url>
cd SchoolMedicalCareSystem

# Cài đặt Backend
cd server
npm install

# Cài đặt Frontend  
cd ../client
npm install
```

### 2. Cấu hình Environment
Tạo file `server/.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/school-medical-care
JWT_SECRET=your-jwt-secret
```

### 3. Chạy ứng dụng
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client  
npm run dev
```

### 4. Truy cập
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

**Dự án học tập - FPT University SU25**
