import {
  IsEnum,
  IsArray,
  IsBoolean,
  IsOptional,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationType, NotificationChannel } from '@prisma/client';

export class CreateUserPreferenceDto {
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsArray()
  @IsEnum(NotificationChannel, { each: true })
  channel: NotificationChannel[];

  @IsBoolean()
  @IsOptional()
  enabled?: boolean = true;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  muteUntil?: Date;
}
