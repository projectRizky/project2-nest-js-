import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { LoginModule } from '../modules/login/login.module';

describe('Login Email (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [LoginModule],
    })
    .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/login/email (POST) --> 400 should return Bad Request when the user do not send body request properly', async () => {
    const data = {
    };

    return request(app.getHttpServer())
      .post('/login/email')
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
});
