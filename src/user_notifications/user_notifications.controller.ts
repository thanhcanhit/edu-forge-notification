import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserNotificationsService } from './user_notifications.service';
import { UserNotificationQueryDto } from './dto/notification-query.dto';
import { UpdateUserNotificationDto } from './dto/update-user-notification.dto';
import { NotificationActionDto } from './dto/notification-action.dto';
import { SendEmailDto, SendBulkEmailDto } from './dto/send-email.dto';
import { UserNotificationDto } from './dto/user-notification.dto';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UserNotification } from '@prisma/client';

@ApiTags('user-notifications')
@Controller('users/:userId/notifications')
export class UserNotificationsController {
  constructor(
    private readonly userNotificationsService: UserNotificationsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'List of notifications retrieved successfully',
    type: UserNotificationDto,
    isArray: true,
  })
  findAll(
    @Param('userId') userId: string,
    @Query() query: UserNotificationQueryDto,
  ): Promise<{
    data: UserNotification[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.userNotificationsService.findAll(userId, query);
  }

  @Get(':notificationId')
  @ApiOperation({ summary: 'Get a specific notification' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'notificationId', description: 'Notification ID' })
  @ApiResponse({
    status: 200,
    description: 'Notification retrieved successfully',
    type: UserNotificationDto,
  })
  findOne(
    @Param('userId') userId: string,
    @Param('notificationId') notificationId: string,
  ): Promise<UserNotification> {
    return this.userNotificationsService.findOne(userId, notificationId);
  }

  @Patch(':notificationId')
  @ApiOperation({ summary: 'Update a notification' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'notificationId', description: 'Notification ID' })
  @ApiResponse({
    status: 200,
    description: 'Notification updated successfully',
    type: UserNotificationDto,
  })
  update(
    @Param('userId') userId: string,
    @Param('notificationId') notificationId: string,
    @Body() updateUserNotificationDto: UpdateUserNotificationDto,
  ): Promise<UserNotification> {
    return this.userNotificationsService.update(
      userId,
      notificationId,
      updateUserNotificationDto,
    );
  }

  @Post(':notificationId/action')
  @ApiOperation({ summary: 'Perform action on notification' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'notificationId', description: 'Notification ID' })
  @ApiResponse({
    status: 200,
    description: 'Action performed successfully',
    type: UserNotificationDto,
  })
  performAction(
    @Param('userId') userId: string,
    @Param('notificationId') notificationId: string,
    @Body() actionDto: NotificationActionDto,
  ): Promise<UserNotification> {
    return this.userNotificationsService.performAction(
      userId,
      notificationId,
      actionDto,
    );
  }

  @Delete(':notificationId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user notification' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'notificationId', description: 'User notification ID' })
  @ApiResponse({
    status: 204,
    description: 'Notification deleted successfully',
  })
  async remove(
    @Param('userId') userId: string,
    @Param('notificationId') notificationId: string,
  ): Promise<void> {
    await this.userNotificationsService.remove(userId, notificationId);
  }

  @Post(':notificationId/email')
  @ApiOperation({ summary: 'Send notification via email' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'notificationId', description: 'User notification ID' })
  @ApiResponse({ status: 200, description: 'Email sent successfully' })
  sendEmail(
    @Param('userId') _userId: string,
    @Param('notificationId') notificationId: string,
    @Body() sendEmailDto: SendEmailDto,
  ): Promise<any> {
    return this.userNotificationsService.sendNotificationEmail(
      notificationId,
      sendEmailDto.email,
    );
  }

  @Post('/bulk-email/:notificationId')
  @ApiOperation({ summary: 'Send notification via email to multiple users' })
  @ApiParam({ name: 'userId', description: 'User ID (admin)' })
  @ApiParam({ name: 'notificationId', description: 'Notification ID' })
  @ApiResponse({ status: 200, description: 'Bulk emails sent successfully' })
  sendBulkEmails(
    @Param('userId') _userId: string,
    @Param('notificationId') notificationId: string,
    @Body() sendBulkEmailDto: SendBulkEmailDto,
  ): Promise<
    Array<{
      userId: string;
      email: string;
      success: boolean;
      result?: unknown;
      error?: string;
    }>
  > {
    return this.userNotificationsService.sendBulkNotificationEmails(
      notificationId,
      sendBulkEmailDto.recipients,
    );
  }
}
