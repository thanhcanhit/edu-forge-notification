import {
  IsEnum,
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsDate,
  IsObject,
  IsArray,
} from 'class-validator';
import { NotificationType } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateNotificationDto {
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  link?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  isGlobal?: boolean;

  @IsInt()
  @IsOptional()
  priority?: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  validUntil?: Date;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  recipients?: string[];
}
