import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationStatus, NotificationChannel } from '@prisma/client';

export class UserNotificationDto {
  @ApiProperty({
    description: 'ID của thông báo người dùng',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    description: 'ID của người dùng',
    example: 'user-123456',
  })
  userId: string;

  @ApiProperty({
    description: 'ID của thông báo',
    example: '507f1f77bcf86cd799439012',
  })
  notificationId: string;

  @ApiProperty({
    description: 'Trạng thái của thông báo',
    enum: NotificationStatus,
    example: NotificationStatus.UNREAD,
  })
  status: NotificationStatus;

  @ApiProperty({
    description: 'Thông báo có bị ẩn không',
    example: false,
  })
  isHidden: boolean;

  @ApiProperty({
    description: 'Thông báo có được đánh dấu yêu thích không',
    example: false,
  })
  isFavorite: boolean;

  @ApiProperty({
    description: 'Đã thực hiện hành động trên thông báo chưa',
    example: false,
  })
  actionTaken: boolean;

  @ApiProperty({
    description: 'Thời điểm gửi thông báo',
    example: '2023-01-01T00:00:00.000Z',
  })
  sentAt: Date;

  @ApiPropertyOptional({
    description: 'Thời điểm đọc thông báo',
    example: '2023-01-01T00:00:00.000Z',
  })
  readAt?: Date;

  @ApiPropertyOptional({
    description: 'Thời điểm lưu trữ thông báo',
    example: '2023-01-01T00:00:00.000Z',
  })
  archivedAt?: Date;

  @ApiProperty({
    description: 'Kênh thông báo',
    enum: NotificationChannel,
    example: NotificationChannel.IN_APP,
  })
  channel: NotificationChannel;
}
