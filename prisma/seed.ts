import {
  PrismaClient,
  NotificationType,
  NotificationStatus,
  NotificationChannel,
} from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  // Clean existing data
  await prisma.userNotification.deleteMany({});
  await prisma.userPreference.deleteMany({});
  await prisma.notification.deleteMany({});

  // Create notifications
  const systemNotification = await prisma.notification.create({
    data: {
      type: NotificationType.SYSTEM,
      title: 'System Maintenance',
      content:
        'The platform will be undergoing scheduled maintenance on Saturday from 2AM to 4AM UTC.',
      isGlobal: true,
      priority: 2,
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      metadata: {
        maintenanceId: '2023-07-15-01',
        affectedServices: ['authentication', 'payment'],
        estimatedDowntime: '2 hours',
      },
    },
  });

  const discussionNotification1 = await prisma.notification.create({
    data: {
      type: NotificationType.DISCUSSION,
      title: 'New reply to your post',
      content:
        'John Doe replied to your post "Getting Started with TypeScript"',
      link: '/discussions/post-123456',
      priority: 1,
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      metadata: {
        postId: 'post-123456',
        replyId: 'reply-789012',
        postTitle: 'Getting Started with TypeScript',
      },
    },
  });

  const discussionNotification2 = await prisma.notification.create({
    data: {
      type: NotificationType.DISCUSSION,
      title: 'Your post was featured',
      content:
        'Congratulations! Your post about React hooks has been featured on our weekly digest.',
      link: '/discussions/post-654321',
      priority: 1,
      image: 'https://cdn.example.com/images/featured-badge.png',
      metadata: {
        postId: 'post-654321',
        postTitle: 'Advanced React Hooks Patterns',
        featuredIn: 'Weekly Digest - July 2023',
      },
    },
  });

  const paymentNotification = await prisma.notification.create({
    data: {
      type: NotificationType.PAYMENT,
      title: 'Payment Received',
      content:
        'We received your payment of $99.00 for your yearly subscription.',
      link: '/account/payments',
      priority: 1,
      metadata: {
        paymentId: 'pay-876543',
        amount: 99.0,
        currency: 'USD',
        paymentMethod: 'Credit Card (ending in 4242)',
      },
    },
  });

  const authNotification = await prisma.notification.create({
    data: {
      type: NotificationType.AUTHENTICATION,
      title: 'Security Alert',
      content:
        'There was a login attempt to your account from a new device in Singapore.',
      link: '/account/security',
      priority: 3,
      metadata: {
        ipAddress: '192.168.1.1',
        deviceInfo: 'Chrome 98, Windows 10',
        location: 'Singapore',
        timestamp: new Date().toISOString(),
      },
    },
  });

  // Create LMS specific notifications
  const courseAnnouncementNotification = await prisma.notification.create({
    data: {
      type: NotificationType.COURSE_ANNOUNCEMENT,
      title: 'Thông báo khóa học: Lập trình Web',
      content:
        'Giảng viên đã cập nhật tài liệu mới cho buổi học tuần này. Vui lòng xem trước tài liệu.',
      link: '/courses/web-programming/announcements/123',
      priority: 2,
      image: 'https://example.com/images/course-web.jpg',
      metadata: {
        courseId: 'course-123',
        courseName: 'Lập trình Web',
        instructorId: 'instructor-456',
        instructorName: 'Nguyễn Văn A',
        materialIds: ['material-789', 'material-101'],
      },
    },
  });

  const assignmentNotification = await prisma.notification.create({
    data: {
      type: NotificationType.ASSIGNMENT,
      title: 'Bài tập mới: Thiết kế cơ sở dữ liệu',
      content:
        'Bạn có bài tập mới cần hoàn thành trước ngày 15/07/2023. Hãy nộp bài đúng hạn!',
      link: '/courses/database/assignments/456',
      priority: 2,
      metadata: {
        courseId: 'course-456',
        courseName: 'Cơ sở dữ liệu',
        assignmentId: 'assignment-789',
        assignmentTitle: 'Thiết kế cơ sở dữ liệu cho hệ thống bán hàng',
        dueDate: '2023-07-15T23:59:59Z',
        maxScore: 100,
      },
    },
  });

  const gradeNotification = await prisma.notification.create({
    data: {
      type: NotificationType.GRADE,
      title: 'Điểm mới: Bài kiểm tra giữa kỳ',
      content: 'Điểm bài kiểm tra giữa kỳ môn Trí tuệ nhân tạo đã được công bố.',
      link: '/courses/ai/grades',
      priority: 1,
      metadata: {
        courseId: 'course-789',
        courseName: 'Trí tuệ nhân tạo',
        assessmentId: 'assessment-101',
        assessmentTitle: 'Bài kiểm tra giữa kỳ',
        score: 85,
        maxScore: 100,
        feedback: 'Bài làm tốt, cần cải thiện phần thuật toán tìm kiếm.',
      },
    },
  });

  const enrollmentNotification = await prisma.notification.create({
    data: {
      type: NotificationType.ENROLLMENT,
      title: 'Đăng ký khóa học thành công',
      content: 'Bạn đã đăng ký thành công khóa học Machine Learning cơ bản.',
      link: '/courses/machine-learning',
      priority: 1,
      metadata: {
        courseId: 'course-202',
        courseName: 'Machine Learning cơ bản',
        instructorName: 'Trần Thị B',
        startDate: '2023-08-01T00:00:00Z',
        endDate: '2023-11-30T00:00:00Z',
        enrollmentId: 'enrollment-303',
      },
    },
  });

  const certificateNotification = await prisma.notification.create({
    data: {
      type: NotificationType.CERTIFICATE,
      title: 'Chứng chỉ mới',
      content: 'Chúc mừng! Bạn đã hoàn thành khóa học và nhận được chứng chỉ.',
      link: '/certificates/404',
      priority: 2,
      image: 'https://example.com/images/certificate-badge.png',
      metadata: {
        certificateId: 'certificate-404',
        courseId: 'course-505',
        courseName: 'Python cho người mới bắt đầu',
        issueDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
        grade: 'A',
      },
    },
  });

  const liveSessionNotification = await prisma.notification.create({
    data: {
      type: NotificationType.LIVE_SESSION,
      title: 'Buổi học trực tuyến sắp diễn ra',
      content:
        'Buổi học trực tuyến về "Kỹ thuật tối ưu hóa" sẽ diễn ra sau 30 phút nữa.',
      link: '/live-sessions/606',
      priority: 3,
      metadata: {
        sessionId: 'session-606',
        courseId: 'course-707',
        courseName: 'Kỹ thuật tối ưu hóa',
        instructorName: 'Lê Văn C',
        startTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
        duration: 90, // 90 minutes
        platform: 'Zoom',
        meetingLink: 'https://zoom.us/j/123456789',
        meetingId: '123 456 789',
        password: '123456',
      },
    },
  });

  // Create sample users (we'll use IDs since we don't have an actual User model)
  const userIds = [
    '550e8400-e29b-41d4-a716-446655440000', // admin user
    '550e8400-e29b-41d4-a716-446655440001', // regular user 1
    '550e8400-e29b-41d4-a716-446655440002', // regular user 2
    '550e8400-e29b-41d4-a716-446655440003', // new user
    '550e8400-e29b-41d4-a716-446655440004', // inactive user
  ];

  // Create user notifications
  await prisma.userNotification.createMany({
    data: [
      // System notification to all users
      ...userIds.map((userId) => ({
        userId,
        notificationId: systemNotification.id,
        status: NotificationStatus.UNREAD,
        channel: NotificationChannel.IN_APP,
        sentAt: new Date(),
      })),

      // Discussion notification for user 1 (read)
      {
        userId: userIds[1],
        notificationId: discussionNotification1.id,
        status: NotificationStatus.READ,
        readAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        channel: NotificationChannel.IN_APP,
        sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },

      // Discussion notification for user 2 (unread)
      {
        userId: userIds[2],
        notificationId: discussionNotification2.id,
        status: NotificationStatus.UNREAD,
        isFavorite: true,
        channel: NotificationChannel.EMAIL,
        sentAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      },

      // Payment notification for user 1
      {
        userId: userIds[1],
        notificationId: paymentNotification.id,
        status: NotificationStatus.UNREAD,
        channel: NotificationChannel.EMAIL,
        sentAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      },

      // Auth notification for user 2 (archived)
      {
        userId: userIds[2],
        notificationId: authNotification.id,
        status: NotificationStatus.ARCHIVED,
        archivedAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        channel: NotificationChannel.PUSH,
        sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },

      // Auth notification for admin
      {
        userId: userIds[0],
        notificationId: authNotification.id,
        status: NotificationStatus.READ,
        readAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        actionTaken: true,
        channel: NotificationChannel.PUSH,
        sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },

      // Course announcement notification for user 1
      {
        userId: userIds[1],
        notificationId: courseAnnouncementNotification.id,
        status: NotificationStatus.UNREAD,
        channel: NotificationChannel.IN_APP,
        sentAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      },

      // Assignment notification for user 1
      {
        userId: userIds[1],
        notificationId: assignmentNotification.id,
        status: NotificationStatus.READ,
        readAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        channel: NotificationChannel.EMAIL,
        sentAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      },

      // Grade notification for user 2
      {
        userId: userIds[2],
        notificationId: gradeNotification.id,
        status: NotificationStatus.UNREAD,
        isFavorite: true,
        channel: NotificationChannel.IN_APP,
        sentAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      },

      // Enrollment notification for user 3
      {
        userId: userIds[3],
        notificationId: enrollmentNotification.id,
        status: NotificationStatus.READ,
        readAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        channel: NotificationChannel.EMAIL,
        sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },

      // Certificate notification for user 1
      {
        userId: userIds[1],
        notificationId: certificateNotification.id,
        status: NotificationStatus.UNREAD,
        channel: NotificationChannel.EMAIL,
        sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },

      // Live session notification for users 1 and 2
      {
        userId: userIds[1],
        notificationId: liveSessionNotification.id,
        status: NotificationStatus.UNREAD,
        channel: NotificationChannel.PUSH,
        sentAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      },
      {
        userId: userIds[2],
        notificationId: liveSessionNotification.id,
        status: NotificationStatus.READ,
        readAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        channel: NotificationChannel.PUSH,
        sentAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      },
    ],
  });

  // Create user preferences
  await prisma.userPreference.createMany({
    data: [
      // Admin user preferences
      {
        userId: userIds[0],
        type: NotificationType.SYSTEM,
        channel: [
          NotificationChannel.EMAIL,
          NotificationChannel.IN_APP,
          NotificationChannel.PUSH,
        ],
        enabled: true,
      },
      {
        userId: userIds[0],
        type: NotificationType.DISCUSSION,
        channel: [NotificationChannel.IN_APP],
        enabled: true,
      },
      {
        userId: userIds[0],
        type: NotificationType.PAYMENT,
        channel: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
        enabled: true,
      },
      {
        userId: userIds[0],
        type: NotificationType.AUTHENTICATION,
        channel: [NotificationChannel.EMAIL, NotificationChannel.PUSH],
        enabled: true,
      },
      // Admin user LMS preferences
      {
        userId: userIds[0],
        type: NotificationType.COURSE_ANNOUNCEMENT,
        channel: [
          NotificationChannel.EMAIL,
          NotificationChannel.IN_APP,
          NotificationChannel.PUSH,
        ],
        enabled: true,
      },
      {
        userId: userIds[0],
        type: NotificationType.ASSIGNMENT,
        channel: [
          NotificationChannel.EMAIL,
          NotificationChannel.IN_APP,
          NotificationChannel.PUSH,
        ],
        enabled: true,
      },
      {
        userId: userIds[0],
        type: NotificationType.GRADE,
        channel: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
        enabled: true,
      },
      {
        userId: userIds[0],
        type: NotificationType.ENROLLMENT,
        channel: [NotificationChannel.EMAIL],
        enabled: true,
      },
      {
        userId: userIds[0],
        type: NotificationType.CERTIFICATE,
        channel: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
        enabled: true,
      },
      {
        userId: userIds[0],
        type: NotificationType.LIVE_SESSION,
        channel: [
          NotificationChannel.EMAIL,
          NotificationChannel.IN_APP,
          NotificationChannel.PUSH,
        ],
        enabled: true,
      },

      // Regular user 1 preferences
      {
        userId: userIds[1],
        type: NotificationType.SYSTEM,
        channel: [NotificationChannel.IN_APP],
        enabled: true,
      },
      {
        userId: userIds[1],
        type: NotificationType.DISCUSSION,
        channel: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
        enabled: true,
      },
      {
        userId: userIds[1],
        type: NotificationType.PAYMENT,
        channel: [NotificationChannel.EMAIL],
        enabled: true,
      },
      {
        userId: userIds[1],
        type: NotificationType.AUTHENTICATION,
        channel: [NotificationChannel.EMAIL, NotificationChannel.PUSH],
        enabled: true,
      },
      // Regular user 1 LMS preferences
      {
        userId: userIds[1],
        type: NotificationType.COURSE_ANNOUNCEMENT,
        channel: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
        enabled: true,
      },
      {
        userId: userIds[1],
        type: NotificationType.ASSIGNMENT,
        channel: [
          NotificationChannel.EMAIL,
          NotificationChannel.IN_APP,
          NotificationChannel.PUSH,
        ],
        enabled: true,
      },
      {
        userId: userIds[1],
        type: NotificationType.GRADE,
        channel: [NotificationChannel.EMAIL, NotificationChannel.PUSH],
        enabled: true,
      },
      {
        userId: userIds[1],
        type: NotificationType.ENROLLMENT,
        channel: [NotificationChannel.EMAIL],
        enabled: true,
      },
      {
        userId: userIds[1],
        type: NotificationType.CERTIFICATE,
        channel: [NotificationChannel.EMAIL],
        enabled: true,
      },
      {
        userId: userIds[1],
        type: NotificationType.LIVE_SESSION,
        channel: [NotificationChannel.PUSH],
        enabled: true,
      },

      // Regular user 2 preferences (with some disabled)
      {
        userId: userIds[2],
        type: NotificationType.SYSTEM,
        channel: [NotificationChannel.IN_APP],
        enabled: true,
      },
      {
        userId: userIds[2],
        type: NotificationType.DISCUSSION,
        channel: [NotificationChannel.IN_APP],
        enabled: true,
        muteUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // Muted for 1 day
      },
      {
        userId: userIds[2],
        type: NotificationType.PAYMENT,
        channel: [NotificationChannel.EMAIL],
        enabled: true,
      },
      {
        userId: userIds[2],
        type: NotificationType.AUTHENTICATION,
        channel: [NotificationChannel.EMAIL, NotificationChannel.PUSH],
        enabled: true,
      },
      // Regular user 2 LMS preferences
      {
        userId: userIds[2],
        type: NotificationType.COURSE_ANNOUNCEMENT,
        channel: [NotificationChannel.IN_APP],
        enabled: true,
      },
      {
        userId: userIds[2],
        type: NotificationType.ASSIGNMENT,
        channel: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
        enabled: true,
      },
      {
        userId: userIds[2],
        type: NotificationType.GRADE,
        channel: [NotificationChannel.IN_APP],
        enabled: true,
      },
      {
        userId: userIds[2],
        type: NotificationType.ENROLLMENT,
        channel: [NotificationChannel.EMAIL],
        enabled: true,
      },
      {
        userId: userIds[2],
        type: NotificationType.CERTIFICATE,
        channel: [NotificationChannel.EMAIL],
        enabled: true,
      },
      {
        userId: userIds[2],
        type: NotificationType.LIVE_SESSION,
        channel: [NotificationChannel.PUSH],
        enabled: true,
      },

      // New user (default preferences)
      {
        userId: userIds[3],
        type: NotificationType.SYSTEM,
        channel: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
        enabled: true,
      },
      {
        userId: userIds[3],
        type: NotificationType.DISCUSSION,
        channel: [NotificationChannel.IN_APP],
        enabled: true,
      },
      {
        userId: userIds[3],
        type: NotificationType.PAYMENT,
        channel: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
        enabled: true,
      },
      {
        userId: userIds[3],
        type: NotificationType.AUTHENTICATION,
        channel: [NotificationChannel.EMAIL, NotificationChannel.PUSH],
        enabled: true,
      },
      // New user LMS preferences
      {
        userId: userIds[3],
        type: NotificationType.COURSE_ANNOUNCEMENT,
        channel: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
        enabled: true,
      },
      {
        userId: userIds[3],
        type: NotificationType.ASSIGNMENT,
        channel: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
        enabled: true,
      },
      {
        userId: userIds[3],
        type: NotificationType.GRADE,
        channel: [NotificationChannel.EMAIL, NotificationChannel.IN_APP],
        enabled: true,
      },
      {
        userId: userIds[3],
        type: NotificationType.ENROLLMENT,
        channel: [NotificationChannel.EMAIL],
        enabled: true,
      },
      {
        userId: userIds[3],
        type: NotificationType.CERTIFICATE,
        channel: [NotificationChannel.EMAIL],
        enabled: true,
      },
      {
        userId: userIds[3],
        type: NotificationType.LIVE_SESSION,
        channel: [NotificationChannel.EMAIL, NotificationChannel.PUSH],
        enabled: true,
      },

      // Inactive user (most notifications disabled)
      {
        userId: userIds[4],
        type: NotificationType.SYSTEM,
        channel: [NotificationChannel.EMAIL],
        enabled: true,
      },
      {
        userId: userIds[4],
        type: NotificationType.DISCUSSION,
        channel: [NotificationChannel.EMAIL],
        enabled: false,
      },
      {
        userId: userIds[4],
        type: NotificationType.PAYMENT,
        channel: [NotificationChannel.EMAIL],
        enabled: true,
      },
      {
        userId: userIds[4],
        type: NotificationType.AUTHENTICATION,
        channel: [NotificationChannel.EMAIL],
        enabled: true,
      },
      // Inactive user LMS preferences (all disabled except for important ones)
      {
        userId: userIds[4],
        type: NotificationType.COURSE_ANNOUNCEMENT,
        channel: [NotificationChannel.EMAIL],
        enabled: false,
      },
      {
        userId: userIds[4],
        type: NotificationType.ASSIGNMENT,
        channel: [NotificationChannel.EMAIL],
        enabled: true, // Keep assignment notifications enabled
      },
      {
        userId: userIds[4],
        type: NotificationType.GRADE,
        channel: [NotificationChannel.EMAIL],
        enabled: true, // Keep grade notifications enabled
      },
      {
        userId: userIds[4],
        type: NotificationType.ENROLLMENT,
        channel: [NotificationChannel.EMAIL],
        enabled: true,
      },
      {
        userId: userIds[4],
        type: NotificationType.CERTIFICATE,
        channel: [NotificationChannel.EMAIL],
        enabled: true,
      },
      {
        userId: userIds[4],
        type: NotificationType.LIVE_SESSION,
        channel: [NotificationChannel.EMAIL],
        enabled: false,
      },
    ],
  });

  console.log(`Database has been seeded.`);
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });
