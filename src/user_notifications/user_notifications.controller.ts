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

@Controller('users/:userId/notifications')
export class UserNotificationsController {
  constructor(
    private readonly userNotificationsService: UserNotificationsService,
  ) {}

  @Get()
  findAll(
    @Param('userId') userId: string,
    @Query() query: UserNotificationQueryDto,
  ) {
    return this.userNotificationsService.findAll(userId, query);
  }

  @Get(':notificationId')
  findOne(
    @Param('userId') userId: string,
    @Param('notificationId') notificationId: string,
  ) {
    return this.userNotificationsService.findOne(userId, notificationId);
  }

  @Patch(':notificationId')
  update(
    @Param('userId') userId: string,
    @Param('notificationId') notificationId: string,
    @Body() updateUserNotificationDto: UpdateUserNotificationDto,
  ) {
    return this.userNotificationsService.update(
      userId,
      notificationId,
      updateUserNotificationDto,
    );
  }

  @Post(':notificationId/action')
  performAction(
    @Param('userId') userId: string,
    @Param('notificationId') notificationId: string,
    @Body() actionDto: NotificationActionDto,
  ) {
    return this.userNotificationsService.performAction(
      userId,
      notificationId,
      actionDto,
    );
  }

  @Delete(':notificationId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('userId') userId: string,
    @Param('notificationId') notificationId: string,
  ) {
    await this.userNotificationsService.remove(userId, notificationId);
    return null;
  }
}
