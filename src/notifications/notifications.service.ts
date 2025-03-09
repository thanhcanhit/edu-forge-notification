import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationQueryDto } from './dto/notification-query.dto';
import { Notification } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    return this.prismaService.notification.create({
      data: createNotificationDto,
    });
  }

  async findAll(query: NotificationQueryDto): Promise<{
    data: Notification[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, type, validUntil } = query;
    const skip = (page - 1) * limit;

    // Build filter conditions - fix where clause
    const where: Record<string, any> = {};

    if (type) {
      where.type = type;
    }

    if (validUntil) {
      where.valid_until = {
        gte: validUntil,
      };
    }

    // Get total count for pagination
    const total = await this.prismaService.notification.count({ where });

    // Get notifications with pagination
    const data = await this.prismaService.notification.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.prismaService.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return notification;
  }

  async update(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    // Check if notification exists
    await this.findOne(id);

    // Update notification
    return this.prismaService.notification.update({
      where: { id },
      data: updateNotificationDto,
    });
  }

  async remove(id: string): Promise<void> {
    // Check if notification exists
    await this.findOne(id);

    // Check if notification is linked to any user notifications
    const userNotificationsCount =
      await this.prismaService.userNotification.count({
        where: {
          notificationId: id,
        },
      });

    if (userNotificationsCount > 0) {
      // Soft delete by updating related user notifications
      await this.prismaService.userNotification.updateMany({
        where: { notificationId: id },
        data: { status: 'DELETED' },
      });
    }

    // Remove the notification
    await this.prismaService.notification.delete({
      where: { id },
    });
  }
}
