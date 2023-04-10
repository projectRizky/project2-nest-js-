import { Module } from '@nestjs/common';
import { PhoneValidationService } from './phone-validation.service';
import { PhoneValidationController } from './phone-validation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpLogsEntity } from '../otp-logs/entities/otp-logs.entity';
import { OtpLogsService } from '../otp-logs/otp-logs.service';

@Module({
  controllers: [PhoneValidationController],
  providers: [PhoneValidationService, OtpLogsService],
  imports: [TypeOrmModule.forFeature([OtpLogsEntity])],
})
export class PhoneValidationModule {}
