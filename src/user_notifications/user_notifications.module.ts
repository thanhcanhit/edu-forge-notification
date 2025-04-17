import { Module } from '@nestjs/common';
import { UserNotificationsService } from './user_notifications.service';
import { UserNotificationsController } from './user_notifications.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [EmailModule],
  controllers: [UserNotificationsController],
  providers: [UserNotificationsService, PrismaService],
  exports: [UserNotificationsService],
})
export class UserNotificationsModule {}
