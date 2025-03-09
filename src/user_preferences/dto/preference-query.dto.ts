import { IsEnum, IsOptional } from 'class-validator';
import { NotificationType } from '@prisma/client';

export class PreferenceQueryDto {
  @IsEnum(NotificationType)
  @IsOptional()
  type?: NotificationType;
}
