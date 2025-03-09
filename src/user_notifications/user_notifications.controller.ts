import { Controller } from '@nestjs/common';
import { UserNotificationsService } from './user_notifications.service';

@Controller('user-notifications')
export class UserNotificationsController {
  constructor(
    private readonly userNotificationsService: UserNotificationsService,
  ) {}
}
