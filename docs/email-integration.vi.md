# Tích hợp gửi email thông báo

Tài liệu này mô tả cách tích hợp và sử dụng tính năng gửi email thông báo trong hệ thống EduForge LMS.

## Cấu hình

Để sử dụng tính năng gửi email, bạn cần cấu hình các biến môi trường sau trong file `.env`:

```
# Email (Resend)
RESEND_API_KEY=your_resend_api_key_here
FROM_EMAIL=notifications@eduforge.com
```

- `RESEND_API_KEY`: API key của dịch vụ Resend. Bạn có thể đăng ký tài khoản và lấy API key tại [Resend.com](https://resend.com).
- `FROM_EMAIL`: Địa chỉ email gửi đi. Nên sử dụng domain đã được xác minh trong Resend.

## API Endpoints

### Gửi thông báo qua email

```
POST /api/v1/notification/users/:userId/notifications/:notificationId/email
```

**Tham số đường dẫn:**
- `userId`: ID của người dùng
- `notificationId`: ID của thông báo người dùng

**Body:**
```json
{
  "email": "user@example.com"
}
```

**Phản hồi thành công (200):**
```json
{
  "id": "email_id",
  "from": "notifications@eduforge.com",
  "to": "user@example.com",
  "subject": "Thông báo khóa học: Lập trình Web",
  "status": "sent"
}
```

### Gửi thông báo hàng loạt qua email

```
POST /api/v1/notification/users/:userId/notifications/bulk-email/:notificationId
```

**Tham số đường dẫn:**
- `userId`: ID của người dùng (admin)
- `notificationId`: ID của thông báo

**Body:**
```json
{
  "recipients": [
    {
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user1@example.com"
    },
    {
      "userId": "550e8400-e29b-41d4-a716-446655440001",
      "email": "user2@example.com"
    }
  ]
}
```

**Phản hồi thành công (200):**
```json
[
  {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user1@example.com",
    "success": true,
    "result": {
      "id": "email_id_1",
      "from": "notifications@eduforge.com",
      "to": "user1@example.com",
      "subject": "Thông báo khóa học: Lập trình Web",
      "status": "sent"
    }
  },
  {
    "userId": "550e8400-e29b-41d4-a716-446655440001",
    "email": "user2@example.com",
    "success": true,
    "result": {
      "id": "email_id_2",
      "from": "notifications@eduforge.com",
      "to": "user2@example.com",
      "subject": "Thông báo khóa học: Lập trình Web",
      "status": "sent"
    }
  }
]
```

## Mẫu email

Hệ thống sử dụng các mẫu email khác nhau dựa trên loại thông báo. Dưới đây là các loại mẫu email được hỗ trợ:

1. **Thông báo cơ bản**: Sử dụng cho các loại thông báo SYSTEM, DISCUSSION, PAYMENT, AUTHENTICATION
2. **Thông báo khóa học**: Sử dụng cho loại thông báo COURSE_ANNOUNCEMENT
3. **Thông báo bài tập**: Sử dụng cho loại thông báo ASSIGNMENT
4. **Thông báo điểm số**: Sử dụng cho loại thông báo GRADE
5. **Thông báo đăng ký khóa học**: Sử dụng cho loại thông báo ENROLLMENT
6. **Thông báo chứng chỉ**: Sử dụng cho loại thông báo CERTIFICATE
7. **Thông báo buổi học trực tuyến**: Sử dụng cho loại thông báo LIVE_SESSION

Mỗi loại mẫu email sẽ hiển thị thông tin phù hợp với loại thông báo tương ứng.

## Metadata

Để tận dụng tối đa các mẫu email, bạn nên cung cấp metadata phù hợp khi tạo thông báo. Dưới đây là ví dụ về metadata cho từng loại thông báo:

### COURSE_ANNOUNCEMENT

```json
{
  "courseId": "course-123",
  "courseName": "Lập trình Web",
  "instructorId": "instructor-456",
  "instructorName": "Nguyễn Văn A",
  "materialIds": ["material-789", "material-101"]
}
```

### ASSIGNMENT

```json
{
  "courseId": "course-456",
  "courseName": "Cơ sở dữ liệu",
  "assignmentId": "assignment-789",
  "assignmentTitle": "Thiết kế cơ sở dữ liệu cho hệ thống bán hàng",
  "dueDate": "2023-07-15T23:59:59Z",
  "maxScore": 100
}
```

### GRADE

```json
{
  "courseId": "course-789",
  "courseName": "Trí tuệ nhân tạo",
  "assessmentId": "assessment-101",
  "assessmentTitle": "Bài kiểm tra giữa kỳ",
  "score": 85,
  "maxScore": 100,
  "feedback": "Bài làm tốt, cần cải thiện phần thuật toán tìm kiếm."
}
```

### ENROLLMENT

```json
{
  "courseId": "course-202",
  "courseName": "Machine Learning cơ bản",
  "instructorName": "Trần Thị B",
  "startDate": "2023-08-01T00:00:00Z",
  "endDate": "2023-11-30T00:00:00Z",
  "enrollmentId": "enrollment-303"
}
```

### CERTIFICATE

```json
{
  "certificateId": "certificate-404",
  "courseId": "course-505",
  "courseName": "Python cho người mới bắt đầu",
  "issueDate": "2023-07-01T00:00:00Z",
  "expiryDate": "2024-07-01T00:00:00Z",
  "grade": "A"
}
```

### LIVE_SESSION

```json
{
  "sessionId": "session-606",
  "courseId": "course-707",
  "courseName": "Kỹ thuật tối ưu hóa",
  "instructorName": "Lê Văn C",
  "startTime": "2023-07-10T14:00:00Z",
  "duration": 90,
  "platform": "Zoom",
  "meetingLink": "https://zoom.us/j/123456789",
  "meetingId": "123 456 789",
  "password": "123456"
}
```
