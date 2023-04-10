import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ValidateEmailDto } from './dto/validate-email.dto';
import { ValidateUsernameDto } from './dto/validate-username.dto';
import { ValidationService } from './validation.service';

@Controller('validation')
export class ValidationController {
  constructor(private validationService: ValidationService) {}

  @Get('email-registration-status')
  async checkEmailRegistrationStatus(
    @Query(new ValidationPipe({ transform: true })) email: ValidateEmailDto,
  ) {
    const checkEmail =
      await this.validationService.checkEmailRegistrationStatus(email);

    if (checkEmail) {
      return {
        status: false,
        message: 'This email is already registered',
      };
    }
    return {
      status: true,
      message: 'This email is not registered',
    };
  }

  @Get('username-registration-status')
  async checkUsernameRegistrationStatus(
    @Query(new ValidationPipe({ transform: true }))
    username: ValidateUsernameDto,
  ) {
    const checkUsername =
      await this.validationService.checkUsernameRegistrationStatus(username);

    if (checkUsername) {
      return {
        status: false,
        message: 'This username is already registered',
      };
    }
    return {
      status: true,
      message: 'This username is not registered',
    };
  }
}
