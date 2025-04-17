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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({
    enum: NotificationType,
    description: 'Type of notification',
    example: NotificationType.SYSTEM,
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({
    description: 'Title of the notification',
    example: 'System Maintenance',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Content of the notification',
    example: 'The system will be undergoing maintenance on Saturday.',
  })
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description: 'Optional link related to the notification',
    example: '/maintenance/details',
  })
  @IsString()
  @IsOptional()
  link?: string;

  @ApiPropertyOptional({
    description: 'Optional image URL for the notification',
    example: 'https://example.com/images/maintenance.png',
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({
    description: 'Additional metadata for the notification',
    example: { maintenanceId: '2023-07-15-01', estimatedDowntime: '2 hours' },
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Whether this notification is global (sent to all users)',
    example: true,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isGlobal?: boolean;

  @ApiPropertyOptional({
    description:
      'Priority level of the notification (higher number = higher priority)',
    example: 2,
    default: 0,
  })
  @IsInt()
  @IsOptional()
  priority?: number;

  @ApiPropertyOptional({
    description: 'Date until which the notification is valid',
    example: '2023-12-31T23:59:59Z',
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  validUntil?: Date;

  @ApiPropertyOptional({
    description: 'List of user IDs to receive this notification',
    example: ['user-123', 'user-456'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  recipients?: string[];
}
