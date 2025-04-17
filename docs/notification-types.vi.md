# Các loại thông báo trong hệ thống LMS

Tài liệu này mô tả các loại thông báo được hỗ trợ trong hệ thống thông báo của EduForge LMS.

## Các loại thông báo cơ bản

1. **SYSTEM** - Thông báo hệ thống
   - Thông báo về bảo trì hệ thống
   - Cập nhật tính năng mới
   - Thông báo từ quản trị viên

2. **DISCUSSION** - Thông báo thảo luận
   - Bình luận mới trên bài viết
   - Phản hồi cho bình luận của bạn
   - Bài viết được đánh dấu nổi bật

3. **PAYMENT** - Thông báo thanh toán
   - Xác nhận thanh toán
   - Hóa đơn mới
   - Nhắc nhở thanh toán

4. **AUTHENTICATION** - Thông báo xác thực
   - Đăng nhập từ thiết bị mới
   - Thay đổi mật khẩu
   - Cảnh báo bảo mật

## Các loại thông báo đặc thù cho LMS

1. **COURSE_ANNOUNCEMENT** - Thông báo từ khóa học
   - Thông báo từ giảng viên
   - Cập nhật tài liệu khóa học
   - Thay đổi lịch học

2. **ASSIGNMENT** - Thông báo bài tập
   - Bài tập mới được giao
   - Nhắc nhở deadline
   - Phản hồi cho bài tập đã nộp

3. **GRADE** - Thông báo điểm số
   - Điểm bài tập
   - Điểm kiểm tra
   - Điểm tổng kết

4. **ENROLLMENT** - Thông báo đăng ký khóa học
   - Xác nhận đăng ký khóa học
   - Thông báo về khóa học sắp bắt đầu
   - Nhắc nhở hoàn thành đăng ký

5. **CERTIFICATE** - Thông báo chứng chỉ
   - Chứng chỉ mới
   - Chứng chỉ sắp hết hạn
   - Yêu cầu cấp lại chứng chỉ

6. **LIVE_SESSION** - Thông báo buổi học trực tuyến
   - Nhắc nhở buổi học sắp diễn ra
   - Thay đổi lịch học trực tuyến
   - Ghi chú buổi học

## Cấu trúc metadata cho từng loại thông báo

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

## Kênh thông báo

Hệ thống hỗ trợ các kênh thông báo sau:

1. **EMAIL** - Thông báo qua email
2. **IN_APP** - Thông báo trong ứng dụng
3. **PUSH** - Thông báo đẩy (mobile, desktop)

## Trạng thái thông báo

Mỗi thông báo người dùng có thể có một trong các trạng thái sau:

1. **UNREAD** - Chưa đọc
2. **READ** - Đã đọc
3. **ARCHIVED** - Đã lưu trữ
4. **DELETED** - Đã xóa
