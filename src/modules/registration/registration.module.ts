import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { OtpLogsEntity } from '../otp-logs/entities/otp-logs.entity';
import { OtpLogsService } from '../otp-logs/otp-logs.service';
import { ValidationService } from './../validation/validation.service';
import { SendMailLogsEntity } from './entities/send_mail_logs.entity';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';

@Module({
  controllers: [RegistrationController],
  providers: [RegistrationService, ValidationService, OtpLogsService],
  imports: [
    TypeOrmModule.forFeature([UserEntity, SendMailLogsEntity, OtpLogsEntity]),
  ],
})
export class RegistrationModule {}
