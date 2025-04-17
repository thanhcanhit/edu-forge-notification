import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendEmailDto {
  @ApiProperty({
    description: 'Email của người nhận',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class SendBulkEmailDto {
  @ApiProperty({
    description: 'Danh sách email và ID người dùng',
    example: [
      {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        email: 'user1@example.com',
      },
      {
        userId: '550e8400-e29b-41d4-a716-446655440001',
        email: 'user2@example.com',
      },
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'ID của người dùng',
        },
        email: {
          type: 'string',
          description: 'Email của người dùng',
        },
      },
    },
  })
  @IsNotEmpty()
  recipients: Array<{ userId: string; email: string }>;
}
