# Docker Setup for EduForge Notification Service

Hướng dẫn sử dụng Docker để chạy EduForge Notification Service.

## Yêu cầu

- Docker
- Docker Compose

## Cách sử dụng

### 1. Chuẩn bị môi trường

Tạo file `.env` từ file `.env.example`:

```bash
cp .env.example .env
```

Chỉnh sửa file `.env` để cấu hình các biến môi trường cần thiết:

```
# Database
DATABASE_URL="mongodb://mongodb:27017/edu-forge-notification?replicaSet=rs0"

# Email (Resend)
RESEND_API_KEY="your_resend_api_key_here"
FROM_EMAIL="notifications@eduforge.io.vn"

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN="*"
```

### 2. Khởi động dịch vụ

Để khởi động tất cả các dịch vụ (ứng dụng NestJS và MongoDB):

```bash
docker-compose up -d
```

Để chỉ khởi động MongoDB:

```bash
docker-compose up -d mongodb mongo-init
```

### 3. Kiểm tra trạng thái

Kiểm tra trạng thái các container:

```bash
docker-compose ps
```

Xem logs của ứng dụng:

```bash
docker-compose logs -f app
```

Xem logs của MongoDB:

```bash
docker-compose logs -f mongodb
```

### 4. Truy cập ứng dụng

- API: http://localhost:3000/api/v1/notification
- Swagger UI: http://localhost:3000/api

### 5. Dừng dịch vụ

Để dừng tất cả các dịch vụ:

```bash
docker-compose down
```

Để dừng và xóa tất cả các volume (dữ liệu MongoDB sẽ bị mất):

```bash
docker-compose down -v
```

## Phát triển

### Chạy ở chế độ development

Mặc định, docker-compose sẽ chạy ứng dụng ở chế độ development. Bạn có thể chỉnh sửa code và ứng dụng sẽ tự động khởi động lại.

### Husky Git Hooks

Husky Git hooks được tắt trong môi trường Docker bằng cách thiết lập biến môi trường `HUSKY=0`. Điều này giúp tránh các lỗi liên quan đến Git hooks khi không có repository Git trong container.

### Chạy ở chế độ production

Để chạy ứng dụng ở chế độ production:

```bash
NODE_ENV=production docker-compose up -d
```

### Rebuild ứng dụng

Nếu bạn thay đổi Dockerfile hoặc cài đặt thêm dependencies:

```bash
docker-compose build app
docker-compose up -d
```

## Khắc phục sự cố

### MongoDB không khởi động được replica set

Nếu MongoDB không khởi động được replica set, bạn có thể khởi động lại service mongo-init:

```bash
docker-compose restart mongo-init
```

Hoặc thực hiện thủ công:

```bash
docker-compose exec mongodb mongosh --eval "rs.initiate({_id: 'rs0', members: [{_id: 0, host: 'mongodb:27017'}]})"
```

### Kiểm tra kết nối đến MongoDB

```bash
docker-compose exec mongodb mongosh
```

Sau đó kiểm tra trạng thái replica set:

```
rs.status()
```
