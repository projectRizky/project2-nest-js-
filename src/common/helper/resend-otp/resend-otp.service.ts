import { OtpLogsService } from '../../../modules/otp-logs/otp-logs.service';
import { CACHE_MANAGER, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Request, Response } from 'express';
import { SendOtpLogsDto } from '../../../modules/otp-logs/dto/send-otp-logs-dto';

@Injectable()
export class ResendOtpService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private otpLogsService: OtpLogsService,
  ) {}

  async resendOtp(
    req: Request,
    res: Response,
    otpLogsDto: SendOtpLogsDto,
  ): Promise<any> {
    let time = 0;
    this.cacheManager
      .get(`block.${req.ip}.${otpLogsDto.phoneNumber}`)
      .then((ress: any) => {
        if (ress) {
          const ttl = (ress.ttl * 1000 - (Date.now() - ress.date)) / 1000;
          return res
            .status(HttpStatus.TOO_MANY_REQUESTS)
            .json({
              status: false,
              message: 'to many attemps',
              tryAfter: parseInt(ttl.toFixed()),
            })
            .send();
        } else {
          this.cacheManager
            .get(`inc.${req.ip}.${otpLogsDto.phoneNumber}`)
            .then((value: number) => {
              const date = Date.now();
              if (value == undefined) {
                time = 60;
                this.cacheManager.set(
                  `inc.${req.ip}.${otpLogsDto.phoneNumber}`,
                  1,
                  { ttl: 5000 },
                );
                this.cacheManager.set(
                  `block.${req.ip}.${otpLogsDto.phoneNumber}`,
                  { date: date, ttl: time },
                  { ttl: time },
                );
              } else {
                if (value > 5) {
                  time = 3600;
                  this.cacheManager.set(
                    `block.${req.ip}.${otpLogsDto.phoneNumber}`,
                    { date: date, ttl: time },
                    { ttl: time },
                  );
                } else if (value >= 4) {
                  time = 300;
                  this.cacheManager.set(
                    `block.${req.ip}.${otpLogsDto.phoneNumber}`,
                    { date: date, ttl: time },
                    { ttl: time },
                  );
                } else if (value >= 1) {
                  time = 60;
                  this.cacheManager.set(
                    `block.${req.ip}.${otpLogsDto.phoneNumber}`,
                    { date: date, ttl: time },
                    { ttl: time },
                  );
                }
                this.cacheManager.set(
                  `inc.${req.ip}.${otpLogsDto.phoneNumber}`,
                  1 + value,
                  { ttl: 5000 },
                );
              }

              this.otpLogsService.saveOtpLogs(otpLogsDto);
              return res
                .status(HttpStatus.OK)
                .json({
                  status: true,
                  message: 'success',
                  tryAfter: time,
                })
                .send();
            });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
}
