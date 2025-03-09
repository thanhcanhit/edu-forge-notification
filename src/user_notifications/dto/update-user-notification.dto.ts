import { IsEnum, IsBoolean, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationStatus } from '@prisma/client';

export class UpdateUserNotificationDto {
  @IsEnum(NotificationStatus)
  @IsOptional()
  status?: NotificationStatus;

  @IsBoolean()
  @IsOptional()
  isHidden?: boolean;

  @IsBoolean()
  @IsOptional()
  isFavorite?: boolean;

  @IsBoolean()
  @IsOptional()
  actionTaken?: boolean;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  readAt?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  archivedAt?: Date;
}
