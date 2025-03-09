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

  // Create sample users (we'll use IDs since we don't have an actual User model)
  const userIds = [
    'user-123456', // admin user
    'user-234567', // regular user 1
    'user-345678', // regular user 2
    'user-456789', // new user
    'user-567890', // inactive user
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
