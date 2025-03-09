import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsString, IsOptional } from 'class-validator';
import { CreateNotificationDto } from './create-notification.dto';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  recipients?: string[];
}
