import {
  IsEnum,
  IsArray,
  IsBoolean,
  IsOptional,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationChannel } from '@prisma/client';

export class UpdateUserPreferenceDto {
  @IsArray()
  @IsEnum(NotificationChannel, { each: true })
  @IsOptional()
  channel?: NotificationChannel[];

  @IsBoolean()
  @IsOptional()
  enabled?: boolean;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  muteUntil?: Date;
}
