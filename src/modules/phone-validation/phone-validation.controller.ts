import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { PhoneValidationDTO } from './dto/phone-validation.dto';
import { PhoneValidationService } from './phone-validation.service';

@Controller('validation')
export class PhoneValidationController {
  constructor(
    private readonly phoneValidationService: PhoneValidationService,
  ) {}

  @Post('phone-registration-status')
  async check(
    @Res({ passthrough: true }) res: Response,
    @Body() phone: PhoneValidationDTO,
  ) {
    return await this.phoneValidationService.check(res, phone);
  }
}
