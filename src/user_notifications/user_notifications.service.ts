import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserNotification, NotificationStatus } from '@prisma/client';
import { UserNotificationQueryDto } from './dto/notification-query.dto';
import { UpdateUserNotificationDto } from './dto/update-user-notification.dto';
import { NotificationActionDto } from './dto/notification-action.dto';

@Injectable()
export class UserNotificationsService {
  constructor(private readonly prismaService: PrismaService) {}

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
    actionDto: NotificationActionDto,
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
}
