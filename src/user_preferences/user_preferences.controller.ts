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
} from '@nestjs/common';
import { UserPreferencesService } from './user_preferences.service';
import { CreateUserPreferenceDto } from './dto/create-user-preference.dto';
import { UpdateUserPreferenceDto } from './dto/update-user-preference.dto';
import { PreferenceQueryDto } from './dto/preference-query.dto';

@Controller('users/:userId/preferences')
export class UserPreferencesController {
  constructor(
    private readonly userPreferencesService: UserPreferencesService,
  ) {}

  @Get()
  findAll(@Param('userId') userId: string, @Query() query: PreferenceQueryDto) {
    return this.userPreferencesService.findAll(userId, query);
  }

  @Get(':preferenceId')
  findOne(
    @Param('userId') userId: string,
    @Param('preferenceId') preferenceId: string,
  ) {
    return this.userPreferencesService.findOne(userId, preferenceId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('userId') userId: string,
    @Body() createUserPreferenceDto: CreateUserPreferenceDto,
  ) {
    return this.userPreferencesService.create(userId, createUserPreferenceDto);
  }

  @Patch(':preferenceId')
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

  @Delete(':preferenceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('userId') userId: string,
    @Param('preferenceId') preferenceId: string,
  ) {
    await this.userPreferencesService.remove(userId, preferenceId);
    return null;
  }
}
