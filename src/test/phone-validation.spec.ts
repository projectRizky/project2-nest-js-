import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PhoneValidationModule } from '../modules/phone-validation/phone-validation.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { OtpLogsEntity } from '../modules/otp-logs/entities/otp-logs.entity';
import { OtpLogsService } from '../modules/otp-logs/otp-logs.service';
import { PhoneValidationService } from '../modules/phone-validation/phone-validation.service';

describe('Phone Validation (e2e)', () => {
  let app: INestApplication;
  // let otpLogsService: OtpLogsService;
  const otpLogService = {
    saveOtpLogs: async (): Promise<any> => {
      return `ok`;
    },
  };
  const otpLog = {};

  const phoneValidationService = {
    check: async (res: Response): Promise<any> => {
      return {
        status: true,
        message: 'phone number already registered',
      };
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PhoneValidationModule, TypeOrmModule.forRoot()],
    })
      .overrideProvider(getRepositoryToken(OtpLogsEntity))
      .useValue(otpLog)
      .overrideProvider(PhoneValidationService)
      .useValue(phoneValidationService)
      .overrideProvider(OtpLogsService)
      .useValue(otpLogService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/phone-validation (POST) --> 400 should return Bad Request when the user do not send body request properly', async () => {
    const data = {
      phoneNumber: 2132182183,
    };

    return request(app.getHttpServer())
      .post('/validation/phone-registration-status')
      .send(data)
      .set('Accept', 'application/json')
      .expect((response) => {
        expect(response.body).toEqual({
          error: expect.any(String),
          message: expect.any(Array),
          statusCode: expect.any(Number),
        });
      })
      .expect(400);
  });

  it('/phone-validation (POST) --> 200 ', async () => {
    const user = {
      phoneNumber: '+6281264348001',
    };

    return await request(app.getHttpServer())
      .post('/validation/phone-registration-status')
      .send(user)
      .set('Accept', 'application/json')
      .expect((response) => {
        console.log(response);
        expect(response.body).toEqual({
          status: true,
          message: 'phone number already registered',
        });
      })
      .expect(201);
  });
});
