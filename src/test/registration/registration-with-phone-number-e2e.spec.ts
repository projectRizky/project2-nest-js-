import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { RegistrationModule } from '../../modules/registration/registration.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../../modules/registration/entities/user.entity';
import { OtpLogsEntity } from '../../modules/otp-logs/entities/otp-logs.entity';
import { SendMailLogsEntity } from '../../modules/registration/entities/send_mail_logs.entity';
import { RegistrationService } from '../../modules/registration/registration.service';
import { ValidationService } from '../../modules/validation/validation.service';

describe('Registration using phone number (e2e)', () => {
  let app: INestApplication;

  //mocking the repositories
  const mockUserRepo = {};
  const mockSendMailLogRepo = {};
  const mockOtpLogRepo = {};

  //mocking the services
  const registrationService = {
    registerUserWithPhone: async (): Promise<any> => {
      return {
        status: true,
        message: 'Registration success',
      };
    },
  };
  const validationService = {
    checkUsernameNPhoneNumberRegistStatus: async (
      username,
      phoneNumber,
    ): Promise<any> => {
      if (username == 'mdc_xxvii') {
        return { id: '987654646466' };
      }
      if (phoneNumber == '+6281264348000') {
        return { id: '987654646466' };
      }
      return null;
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RegistrationModule],
    })
      .overrideProvider(getRepositoryToken(UserEntity))
      .useValue(mockUserRepo)
      .overrideProvider(getRepositoryToken(SendMailLogsEntity))
      .useValue(mockSendMailLogRepo)
      .overrideProvider(getRepositoryToken(OtpLogsEntity))
      .useValue(mockOtpLogRepo)
      .overrideProvider(RegistrationService)
      .useValue(registrationService)
      .overrideProvider(ValidationService)
      .useValue(validationService)
      .compile();

    app = moduleFixture.createNestApplication();

    //this is used if you want to use the validation
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/registration/phone (POST) --> 201 should return success when the user registered successfully with valid request', async () => {
    const user = {
      phoneNumber: '+6281264348001',
      username: 'mellydecyber',
      fullName: 'Melli Tiara',
      dateOfBirth: '1999-12-27',
    };

    return request(app.getHttpServer())
      .post('/registration/phone')
      .send(user)
      .set('Accept', 'application/json')
      .expect({
        status: true,
        message: 'Registration success',
      })
      .expect(201);
  });

  it('/registration/phone (POST) --> 400 should return Bad Request when the phone number on the request body already registered', async () => {
    const user = {
      phoneNumber: '+6281264348000',
      username: 'mdc_xxvii',
      fullName: 'Melli Tiara',
      dateOfBirth: '1999-12-27',
    };

    return request(app.getHttpServer())
      .post('/registration/phone')
      .send(user)
      .set('Accept', 'application/json')
      .expect((response) => {
        expect(response.body).toEqual({
          message: expect.any(String),
          status: expect.any(Boolean),
        });
      })
      .expect(400);
  });

  it('/registration/phone (POST) --> 400 should return Bad Request when the username on the request body already registered', async () => {
    const user = {
      phoneNumber: '+6281264348000',
      username: 'mdc_xxvii',
      fullName: 'Melli Tiara',
      dateOfBirth: '1999-12-27',
    };

    return request(app.getHttpServer())
      .post('/registration/phone')
      .send(user)
      .set('Accept', 'application/json')
      .expect((response) => {
        expect(response.body).toEqual({
          message: expect.any(String),
          status: expect.any(Boolean),
        });
      })
      .expect(400);
  });

  it('/registration/phone (POST) --> 400 should return Bad Request when the user does not send body request properly', async () => {
    const user = {
      username: 2132182183,
      phoneNumber: '+6281264348001',
    };

    return request(app.getHttpServer())
      .post('/registration/phone')
      .send(user)
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
});
