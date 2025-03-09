import { IsEnum, IsOptional, IsInt, Min, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationType } from '@prisma/client';

export class NotificationQueryDto {
  @IsEnum(NotificationType)
  @IsOptional()
  type?: NotificationType;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  limit?: number = 10;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  validUntil?: Date;
}
