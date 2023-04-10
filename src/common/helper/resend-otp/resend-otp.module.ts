import { CacheModule, Module } from '@nestjs/common';
import { OtpLogsService } from '../../../modules/otp-logs/otp-logs.service';
import { ResendOtpController } from './resend-otp.controller';
import { ResendOtpService } from './resend-otp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpLogsEntity } from '../../../modules/otp-logs/entities/otp-logs.entity';

@Module({
  imports: [CacheModule.register(), TypeOrmModule.forFeature([OtpLogsEntity])],
  controllers: [ResendOtpController],
  providers: [ResendOtpService, OtpLogsService],
})
export class ResendOtpModule {}
