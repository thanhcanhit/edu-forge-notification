import { Module } from '@nestjs/common';
import { UserNotificationsService } from './user_notifications.service';
import { UserNotificationsController } from './user_notifications.controller';

@Module({
  controllers: [UserNotificationsController],
  providers: [UserNotificationsService],
})
export class UserNotificationsModule {}
