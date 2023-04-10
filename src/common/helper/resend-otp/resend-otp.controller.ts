import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { SendOtpLogsDto } from '../../../modules/otp-logs/dto/send-otp-logs-dto';
import { ResendOtpService } from './resend-otp.service';

@Controller('registration')
export class ResendOtpController {
  constructor(private readonly resendOtpService: ResendOtpService) {}

  @Post('resend/otp')
  login(
    @Req() req: Request,
    @Res() res: Response,
    @Body() otpLogsDto: SendOtpLogsDto,
  ) {
    return this.resendOtpService.resendOtp(req, res, otpLogsDto);
  }
}
