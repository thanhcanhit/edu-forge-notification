import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { UserPreferencesService } from './user_preferences.service';
import { CreateUserPreferenceDto } from './dto/create-user-preference.dto';
import { UpdateUserPreferenceDto } from './dto/update-user-preference.dto';
import { PreferenceQueryDto } from './dto/preference-query.dto';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('user-preferences')
@Controller('users/:userId/preferences')
export class UserPreferencesController {
  constructor(
    private readonly userPreferencesService: UserPreferencesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all preferences for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  findAll(@Param('userId') userId: string, @Query() query: PreferenceQueryDto) {
    return this.userPreferencesService.findAll(userId, query);
  }

  @Get(':preferenceId')
  @ApiOperation({ summary: 'Get a specific preference by ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'preferenceId', description: 'Preference ID' })
  findOne(
    @Param('userId') userId: string,
    @Param('preferenceId') preferenceId: string,
  ) {
    return this.userPreferencesService.findOne(userId, preferenceId);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get a specific preference by type' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'type', description: 'Preference type' })
  async findByType(
    @Param('userId') userId: string,
    @Param('type') type: string,
  ) {
    try {
      return await this.userPreferencesService.findByType(userId, type);
    } catch (error) {
      if (error instanceof NotFoundException) {
        // Return empty preference with default values if not found
        return {
          userId,
          type,
          channel: ['IN_APP'],
          enabled: true,
          muteUntil: null,
        };
      }
      throw error;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new preference' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  create(
    @Param('userId') userId: string,
    @Body() createUserPreferenceDto: CreateUserPreferenceDto,
  ) {
    return this.userPreferencesService.create(userId, createUserPreferenceDto);
  }

  @Patch(':preferenceId')
  @ApiOperation({ summary: 'Update a preference by ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'preferenceId', description: 'Preference ID' })
  update(
    @Param('userId') userId: string,
    @Param('preferenceId') preferenceId: string,
    @Body() updateUserPreferenceDto: UpdateUserPreferenceDto,
  ) {
    return this.userPreferencesService.update(
      userId,
      preferenceId,
      updateUserPreferenceDto,
    );
  }

  @Patch('type/:type')
  @ApiOperation({ summary: 'Update a preference by type' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'type', description: 'Preference type' })
  async updateByType(
    @Param('userId') userId: string,
    @Param('type') type: string,
    @Body() updateUserPreferenceDto: UpdateUserPreferenceDto,
  ) {
    try {
      // Find the preference by type first
      const preference = await this.userPreferencesService.findByType(userId, type);
      // Then update it by ID
      return this.userPreferencesService.update(
        userId,
        preference.id,
        updateUserPreferenceDto,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        // Create a new preference if not found
        return this.userPreferencesService.create(userId, {
          type,
          ...updateUserPreferenceDto,
          channel: updateUserPreferenceDto.channel || ['IN_APP'],
          enabled: updateUserPreferenceDto.enabled ?? true,
        } as CreateUserPreferenceDto);
      }
      throw error;
    }
  }

  @Delete(':preferenceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a preference by ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'preferenceId', description: 'Preference ID' })
  async remove(
    @Param('userId') userId: string,
    @Param('preferenceId') preferenceId: string,
  ) {
    await this.userPreferencesService.remove(userId, preferenceId);
    return null;
  }

  @Delete('type/:type')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a preference by type' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'type', description: 'Preference type' })
  async removeByType(
    @Param('userId') userId: string,
    @Param('type') type: string,
  ) {
    try {
      // Find the preference by type first
      const preference = await this.userPreferencesService.findByType(userId, type);
      // Then delete it by ID
      await this.userPreferencesService.remove(userId, preference.id);
      return null;
    } catch (error) {
      if (error instanceof NotFoundException) {
        // If not found, just return success
        return null;
      }
      throw error;
    }
  }
}
