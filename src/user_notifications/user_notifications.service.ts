import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  UserNotification,
  NotificationStatus,
  NotificationChannel,
} from '@prisma/client';
import { UserNotificationQueryDto } from './dto/notification-query.dto';
import { UpdateUserNotificationDto } from './dto/update-user-notification.dto';
import { NotificationActionDto } from './dto/notification-action.dto';
import { NotificationEmailService } from 'src/email/notification-email.service';

@Injectable()
export class UserNotificationsService {
  private readonly logger = new Logger(UserNotificationsService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationEmailService: NotificationEmailService,
  ) {}

  async findAll(
    userId: string,
    query: UserNotificationQueryDto,
  ): Promise<{
    data: UserNotification[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { status, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    // Build filter conditions
    const where: Record<string, any> = {
      userId,
    };

    if (status) {
      where.status = status;
    } else {
      // By default, exclude deleted notifications
      where.status = {
        not: NotificationStatus.DELETED,
      };
    }

    // Get total count for pagination
    const total = await this.prismaService.userNotification.count({ where });

    // Get user notifications with pagination
    const data = await this.prismaService.userNotification.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        sentAt: 'desc',
      },
      include: {
        notification: true, // Include the related notification data
      },
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(
    userId: string,
    notificationId: string,
  ): Promise<UserNotification> {
    const userNotification =
      await this.prismaService.userNotification.findFirst({
        where: {
          id: notificationId,
          userId,
        },
        include: {
          notification: true, // Include the related notification data
        },
      });

    if (!userNotification) {
      throw new NotFoundException(
        `Notification with ID ${notificationId} not found for user ${userId}`,
      );
    }

    return userNotification;
  }

  async update(
    userId: string,
    notificationId: string,
    updateDto: UpdateUserNotificationDto,
  ): Promise<UserNotification> {
    // First check if the notification exists and belongs to the user
    await this.findOne(userId, notificationId);

    const updateData: Partial<UpdateUserNotificationDto> = { ...updateDto };

    // Handle status-specific logic
    if (updateDto.status === NotificationStatus.READ && !updateDto.readAt) {
      updateData.readAt = new Date();
    }

    if (
      updateDto.status === NotificationStatus.ARCHIVED &&
      !updateDto.archivedAt
    ) {
      updateData.archivedAt = new Date();
    }

    // Update the user notification
    return this.prismaService.userNotification.update({
      where: {
        id: notificationId,
      },
      data: updateData,
      include: {
        notification: true,
      },
    });
  }

  async performAction(
    userId: string,
    notificationId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _actionDto: NotificationActionDto,
  ): Promise<UserNotification> {
    // First verify that the notification exists and belongs to the user
    const userNotification = await this.findOne(userId, notificationId);

    // Don't allow actions on deleted notifications
    if (userNotification.status === NotificationStatus.DELETED) {
      throw new ForbiddenException(
        `Cannot perform actions on deleted notification ${notificationId}`,
      );
    }

    // Record the action
    const updated = await this.prismaService.userNotification.update({
      where: {
        id: notificationId,
      },
      data: {
        actionTaken: true,
      },
      include: {
        notification: true,
      },
    });

    return updated;
  }

  async remove(userId: string, notificationId: string): Promise<void> {
    // First verify that the notification exists and belongs to the user
    await this.findOne(userId, notificationId);

    // Soft delete by updating the status
    await this.prismaService.userNotification.update({
      where: {
        id: notificationId,
      },
      data: {
        status: NotificationStatus.DELETED,
      },
    });
  }

  /**
   * Gửi thông báo qua email
   * @param userNotificationId ID của thông báo người dùng
   * @param userEmail Email của người dùng
   * @returns Kết quả gửi email
   */
  async sendNotificationEmail(userNotificationId: string, userEmail: string) {
    try {
      // Lấy thông tin thông báo người dùng
      const userNotification =
        await this.prismaService.userNotification.findUnique({
          where: { id: userNotificationId },
          include: { notification: true },
        });

      if (!userNotification) {
        return {
          data: null,
          error: {
            message: `User notification with ID ${userNotificationId} not found`,
            name: 'not_found',
            statusCode: 404,
          },
        };
      }

      // Gửi email
      const result = await this.notificationEmailService.sendNotificationEmail(
        userNotification.notification,
        userEmail,
      );

      // Nếu gửi email thành công hoặc có cảnh báo nhưng không phải lỗi nghiêm trọng
      if (!result.error || result.error.statusCode < 500) {
        // Cập nhật trạng thái đã gửi email
        await this.prismaService.userNotification.update({
          where: { id: userNotificationId },
          data: { channel: NotificationChannel.EMAIL },
        });
      }

      return result;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to send notification email for user notification ${userNotificationId}: ${errorMessage}`,
        errorStack,
      );

      // Trả về lỗi có cấu trúc thay vì throw exception
      return {
        data: null,
        error: {
          message: errorMessage,
          name: error instanceof Error ? error.name : 'unknown_error',
          statusCode: 500,
        },
      };
    }
  }

  /**
   * Gửi thông báo qua email cho nhiều người dùng
   * @param notificationId ID của thông báo
   * @param userEmails Danh sách email người dùng
   * @returns Kết quả gửi email
   */
  async sendBulkNotificationEmails(
    notificationId: string,
    userEmails: { userId: string; email: string }[],
  ) {
    try {
      // Lấy thông tin thông báo
      const notification = await this.prismaService.notification.findUnique({
        where: { id: notificationId },
      });

      if (!notification) {
        return [
          {
            userId: 'admin',
            email: 'admin@example.com',
            success: false,
            error: `Notification with ID ${notificationId} not found`,
          },
        ];
      }

      // Gửi email cho từng người dùng
      const results = await Promise.all(
        userEmails.map(async ({ userId, email }) => {
          try {
            // Tìm hoặc tạo thông báo người dùng
            let userNotification =
              await this.prismaService.userNotification.findFirst({
                where: {
                  userId,
                  notificationId,
                },
              });

            if (!userNotification) {
              userNotification =
                await this.prismaService.userNotification.create({
                  data: {
                    userId,
                    notificationId,
                    status: NotificationStatus.UNREAD,
                    channel: NotificationChannel.EMAIL,
                    sentAt: new Date(),
                  },
                });
            }

            // Gửi email
            const result =
              await this.notificationEmailService.sendNotificationEmail(
                notification,
                email,
              );

            // Nếu gửi email thành công hoặc có cảnh báo nhưng không phải lỗi nghiêm trọng
            if (!result.error || result.error.statusCode < 500) {
              // Cập nhật trạng thái đã gửi email
              await this.prismaService.userNotification.update({
                where: { id: userNotification.id },
                data: { channel: NotificationChannel.EMAIL },
              });
            }

            const success = !result.error || result.error.statusCode < 400;
            return {
              userId,
              email,
              success,
              result: result.data,
              error: result.error ? result.error.message : undefined
            };
          } catch (error: unknown) {
            const errorMessage =
              error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;
            this.logger.error(
              `Failed to send notification email to ${email}: ${errorMessage}`,
              errorStack,
            );
            return { userId, email, success: false, error: errorMessage };
          }
        }),
      );

      return results;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to send bulk notification emails for notification ${notificationId}: ${errorMessage}`,
        errorStack,
      );

      // Trả về kết quả lỗi thay vì throw exception
      return [
        {
          userId: 'system',
          email: 'system@example.com',
          success: false,
          error: errorMessage,
        },
      ];
    }
  }
}
