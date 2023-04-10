import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { LoginModule } from '../../modules/login/login.module';
import { LoginService } from '../../modules/login/login.service';
import e, { Request, response, Response } from 'express';
import { EmailLoginDto } from '../../modules/login/dto/email-login.dto';

describe('Registration using email (e2e)', () => {
  let app: INestApplication;

  //mocking the services
  const loginService = {
    login: async (
      req: Request,
      res: Response,
      emailLoginDto: EmailLoginDto,
    ): Promise<any> => {
      if (
        emailLoginDto.email == 'habib@gmail.com' &&
        emailLoginDto.password == 'test1234'
      ) {
        return {
          status: true,
          message: 'Login Success',
          accessToken: 'token',
        };
      } else if (
        emailLoginDto.email == 'habib@gmail.com' &&
        emailLoginDto.password != 'test1234'
      ) {
        return {
          status: false,
          message: 'Login Failed, Wrong Password',
          accessToken: null,
        };
      } else {
        return new BadRequestException(
          'email not verified',
          'email not verified',
        ).getResponse();
      }
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [LoginModule],
    })
      .overrideProvider(LoginService)
      .useValue(loginService)
      .compile();

    app = moduleFixture.createNestApplication();

    //this is used if you want to use the validation
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/login (POST) --> 200 should return success when the user login successfully with valid request', async () => {
    const user = {
      email: 'habib@gmail.com',
      password: 'test1234',
    };

    return request(app.getHttpServer())
      .post('/login/email')
      .send(user)
      .set('Accept', 'application/json')
      .expect((response) => {
        expect(response.body).toEqual({
          status: true,
          message: 'Login Success',
          accessToken: expect.any(String),
        });
      })
      .expect(201);
  });

  it('/login (POST) --> 403 should return fail when the user login fail with invalid password', async () => {
    const user = {
      email: 'habib@gmail.com',
      password: 'test12',
    };

    return request(app.getHttpServer())
      .post('/login/email')
      .send(user)
      .set('Accept', 'application/json')
      .expect((response) => {
        expect(response.body).toEqual({
          status: false,
          message: 'Login Failed, Wrong Password',
          accessToken: null,
        });
      })
      .expect(201);
  });

  it('/login (POST) --> 400 should return fail when the user login fail with email not verified yet', async () => {
    const user = {
      email: 'habib@gmail.coms',
      password: 'test1234',
    };

    return request(app.getHttpServer())
      .post('/login/email')
      .send(user)
      .set('Accept', 'application/json')
      .expect((response) => {
        expect(response.body).toEqual({
          statusCode: 400,
          message: 'email not verified',
          error: expect.any(String),
        });
      })
      .expect(201);
  });
});
