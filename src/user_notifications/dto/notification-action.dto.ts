import { NotificationAction } from '@prisma/client';
import { IsEnum, IsObject, IsOptional } from 'class-validator';

export class NotificationActionDto {
  @IsEnum(NotificationAction)
  action: NotificationAction;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
