import { Controller } from '@nestjs/common';
import { UserPreferencesService } from './user_preferences.service';

@Controller('user-preferences')
export class UserPreferencesController {
  constructor(
    private readonly userPreferencesService: UserPreferencesService,
  ) {}
}
