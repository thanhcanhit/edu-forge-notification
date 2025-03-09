import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserPreference } from '@prisma/client';
import { CreateUserPreferenceDto } from './dto/create-user-preference.dto';
import { UpdateUserPreferenceDto } from './dto/update-user-preference.dto';
import { PreferenceQueryDto } from './dto/preference-query.dto';

@Injectable()
export class UserPreferencesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(
    userId: string,
    query?: PreferenceQueryDto,
  ): Promise<UserPreference[]> {
    const where: Record<string, any> = { userId };

    if (query?.type) {
      where.type = query.type;
    }

    return this.prismaService.userPreference.findMany({
      where,
    });
  }

  async findOne(userId: string, preferenceId: string): Promise<UserPreference> {
    const userPreference = await this.prismaService.userPreference.findFirst({
      where: {
        id: preferenceId,
        userId,
      },
    });

    if (!userPreference) {
      throw new NotFoundException(
        `Preference with ID ${preferenceId} not found for user ${userId}`,
      );
    }

    return userPreference;
  }

  async findByType(userId: string, type: string): Promise<UserPreference> {
    const userPreference = await this.prismaService.userPreference.findFirst({
      where: {
        userId,
        type,
      },
    });

    if (!userPreference) {
      throw new NotFoundException(
        `Preference with type ${type} not found for user ${userId}`,
      );
    }

    return userPreference;
  }

  async create(
    userId: string,
    createDto: CreateUserPreferenceDto,
  ): Promise<UserPreference> {
    // Check if a preference with this type already exists for this user
    const existingPreference =
      await this.prismaService.userPreference.findUnique({
        where: {
          userId_type: {
            userId,
            type: createDto.type,
          },
        },
      });

    if (existingPreference) {
      throw new ConflictException(
        `A preference with type ${createDto.type} already exists for user ${userId}`,
      );
    }

    return this.prismaService.userPreference.create({
      data: {
        ...createDto,
        userId,
      },
    });
  }

  async update(
    userId: string,
    preferenceId: string,
    updateDto: UpdateUserPreferenceDto,
  ): Promise<UserPreference> {
    // Check if the preference exists and belongs to the user
    await this.findOne(userId, preferenceId);

    return this.prismaService.userPreference.update({
      where: {
        id: preferenceId,
      },
      data: updateDto,
    });
  }

  async remove(userId: string, preferenceId: string): Promise<void> {
    // Check if the preference exists and belongs to the user
    await this.findOne(userId, preferenceId);

    await this.prismaService.userPreference.delete({
      where: {
        id: preferenceId,
      },
    });
  }
}
