import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { RegistrationModule } from '../../modules/registration/registration.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../../modules/registration/entities/user.entity';
import { SendMailLogsEntity } from '../../modules/registration/entities/send_mail_logs.entity';
import { OtpLogsEntity } from '../../modules/otp-logs/entities/otp-logs.entity';
import { RegistrationService } from '../../modules/registration/registration.service';
import { ValidationService } from '../../modules/validation/validation.service';
import { FirebaseAdmin } from './../../../src/config/firebase-admin/firebase-admin';
import { Firebase } from './../../config/firebase/firebase';
import * as admin from 'firebase-admin';
import { RegistThirdPartyValidatorMiddleware } from './../../common/middleware/regist-third-party-validator.middleware';
import { initializeApp } from '@firebase/app';
import {
  getAuth,
  OAuthCredential,
  signInWithCustomToken,
} from '@firebase/auth';

describe('Registration using Facebook (e2e)', () => {
  let app: INestApplication;

  let uid = '';
  let customToken = '';
  //initializing firebase sdk
  admin.initializeApp({
    credential: admin.credential.cert(FirebaseAdmin),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
  initializeApp(Firebase);
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
    checkEmailRegistrationStatus: async (): Promise<any> => {
      return { id: '12321312321', username: 'sucesss' };
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
    app.use(new RegistThirdPartyValidatorMiddleware().use);
    await app.init();
  });

  
  it('/registration (POST) --> 201 should return success when the user registered successfully with the valid token', async () => {
    //initialize account for testing need
    const registUser = await admin
      .auth()
      .createUser({
        uid: 'tesMid123nf832facebook',
        email: 'user@facebook.com',
        emailVerified: true,
        password: 'secretPassword',
      })
      .then((userRecord) => {
        // See the UserRecord reference doc for the contents of userRecord.
        return userRecord.uid;
      })
      .catch((error) => {
        return 'false';
      });

    if (registUser != 'false') {
      uid = registUser;
    } else {
      uid = 'tesMid123nf832facebook';
    }

    const customSignIn = await admin
      .auth()
      .createCustomToken(uid)
      .then((customToken) => {
        // Send token back to client
        return customToken;
      })
      .catch((error) => {
        return 'false';
      });
    if (customSignIn != 'false') {
      customToken = customSignIn;
    }

    const token = await signInWithCustomToken(getAuth(), customToken).then(
      (result) => {
        const credential = result.user as unknown as OAuthCredential;
        // Signed in
        return credential.accessToken;
      },
    );

    return await request(app.getHttpServer())
      .post('/registration/facebook')
      .send()
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect({ status: true, message: 'This user registered successfully' })
      .expect(201);
  });
});
