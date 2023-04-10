import { HttpStatus, Injectable } from '@nestjs/common';
import { PhoneValidationDTO } from './dto/phone-validation.dto';
import * as admin from 'firebase-admin';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { OtpLogsEntity } from '../otp-logs/entities/otp-logs.entity';
import { Repository } from 'typeorm';
import { OtpLogsService } from '../otp-logs/otp-logs.service';

@Injectable()
export class PhoneValidationService {
  constructor(
    @InjectRepository(OtpLogsEntity)
    private otpLogRepo: Repository<OtpLogsEntity>,
    private otpLogsService: OtpLogsService,
  ) {}
  check(res: Response, phone: PhoneValidationDTO) {
    admin
      .auth()
      .getUserByPhoneNumber(phone.phoneNumber)
      .then(async () => {
        await this.otpLogsService.saveOtpLogs({
          phoneNumber: phone.phoneNumber,
        });
        return res
          .status(HttpStatus.OK)
          .json({
            status: true,
            message: 'phone number already registered',
          })
          .send();
      })
      .catch((e) => {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({
            status: false,
            message: e.message,
          })
          .send();
      });
  }
}
