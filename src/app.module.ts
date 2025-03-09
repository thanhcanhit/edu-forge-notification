import { Module } from '@nestjs/common';
import { NotificationsModule } from './notifications/notifications.module';
import { UserNotificationsModule } from './user_notifications/user_notifications.module';
import { UserPreferencesModule } from './user_preferences/user_preferences.module';

@Module({
  imports: [
    NotificationsModule,
    UserNotificationsModule,
    UserPreferencesModule,
  ],
})
export class AppModule {}
