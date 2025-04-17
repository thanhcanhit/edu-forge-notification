import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { NotificationEmailService } from './notification-email.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [EmailService, NotificationEmailService],
  exports: [EmailService, NotificationEmailService],
})
export class EmailModule {}
