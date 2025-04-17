import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { NotificationsModule } from './notifications/notifications.module';
import { UserNotificationsModule } from './user_notifications/user_notifications.module';
import { UserPreferencesModule } from './user_preferences/user_preferences.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    NotificationsModule,
    UserNotificationsModule,
    UserPreferencesModule,
    EmailModule,
  ],
})
export class AppModule implements NestModule {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  configure(_consumer: MiddlewareConsumer) {
    // Add any global middlewares here
  }
}
