import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OtpLogsEntity } from './entities/otp-logs.entity';
import { SendOtpLogsDto } from './dto/send-otp-logs-dto';

@Injectable()
export class OtpLogsService {
  constructor(
    @InjectRepository(OtpLogsEntity)
    private otpLogRepo: Repository<OtpLogsEntity>,
  ) {}

  async saveOtpLogs(sendOtpLog: SendOtpLogsDto): Promise<any> {
    try {
      return await this.otpLogRepo.save(sendOtpLog);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
