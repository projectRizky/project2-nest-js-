import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { RegistrationModule } from '../../modules/registration/registration.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../modules/registration/entities/user.entity';
import { SendMailLogsEntity } from '../../modules/registration/entities/send_mail_logs.entity';
import { OtpLogsEntity } from '../../modules/otp-logs/entities/otp-logs.entity';
import { RegistrationService } from '../../modules/registration/registration.service';
import { ValidationService } from '../../modules/validation/validation.service';

describe('Registration using email (e2e)', () => {
  let app: INestApplication;
  
  //mocking the repositories
  const mockUserRepo = {};
  const mockSendMailLogRepo = {};
  const mockOtpLogRepo = {};

  //mocking the services
  const registrationService = {
    registerUserWithEmail: async (): Promise<any> => {
      const registerUser = {
        status: true,
        message: 'Registration success',
      };
      return registerUser;
    },
  };
  const validationService = {
    checkUsernameNEmailRegistStatus: async (username, email): Promise<any> => {
      if (username == 'fahmifachrozi') {
        return { id: '12321312321', username: username };
      }
      if (email == 'fahmiexisting@gmail.com') {
        return { id: '12321312321', username: username };
      }
      return null;
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RegistrationModule, TypeOrmModule.forRoot()],
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

  it('/registration (POST) --> 201 should return success when the user registered successfully with valid request', async () => {
    const user = {
      email: 'fahmitesting@gmail.com',
      username: 'iloveyoubutasafriend',
      fullName: 'cikabliattt',
      dateOfBirth: '1997-01-20 00:00',
      password: 'hyyyy1234',
      passwordConfirm: 'hyyyy1234',
    };

    return await request(app.getHttpServer())
      .post('/registration/email')
      .send(user)
      .set('Accept', 'application/json')
      .expect({
        status: true,
        message: 'Registration success',
      })
      .expect(201);
  });

  it('/registration (POST) --> 400 should return Bad Request when the email on the request body already registered', async () => {
    const user = {
      email: 'fahmiexisting@gmail.com',
      username: 'iloveyoubutasafriend',
      fullName: 'cikabliattt',
      dateOfBirth: '1997-01-20 00:00',
      password: 'hyyyy1234',
      passwordConfirm: 'hyyyy1234',
    };

    return await request(app.getHttpServer())
      .post('/registration/email')
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

  it('/registration (POST) --> 400 should return Bad Request when the username on the request body already registered', async () => {
    const user = {
      email: 'fahmi123@gmail.com',
      username: 'fahmifachrozi',
      fullName: 'cikabliattt',
      dateOfBirth: '1997-01-20 00:00',
      password: 'hyyyy1234',
      passwordConfirm: 'hyyyy1234',
    };

    return await request(app.getHttpServer())
      .post('/registration/email')
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

  it('/registration (POST) --> 400 should return Bad Request when the user does not send body request properly', async () => {
    const user = {
      username: 2132182183,
      email: 2321831731,
    };

    return await request(app.getHttpServer())
      .post('/registration/email')
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
