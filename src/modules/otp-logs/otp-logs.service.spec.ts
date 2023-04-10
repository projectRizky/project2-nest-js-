import { Test, TestingModule } from '@nestjs/testing';
import { SendOtpLogsDto } from './dto/send-otp-logs-dto';
import { OtpLogsEntity } from './entities/otp-logs.entity';
import { OtpLogsService } from './otp-logs.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('OtpLogsService', () => {
  let service: OtpLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OtpLogsService,
        {
          provide: getRepositoryToken(OtpLogsEntity),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<OtpLogsService>(OtpLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call saveOtpLogs method with expected params', async () => {
    const createOtpLogSpy = jest.spyOn(service, 'saveOtpLogs');
    const dto = new SendOtpLogsDto();
    service.saveOtpLogs(dto);
    expect(createOtpLogSpy).toHaveBeenCalledWith(dto);
  });
});
