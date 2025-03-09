import { Module } from '@nestjs/common';
import { UserPreferencesService } from './user_preferences.service';
import { UserPreferencesController } from './user_preferences.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [UserPreferencesController],
  providers: [UserPreferencesService, PrismaService],
})
export class UserPreferencesModule {}
