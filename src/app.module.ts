import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  CacheModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as admin from 'firebase-admin';
import { initializeApp } from '@firebase/app';
import { FirebaseAdmin } from './config/firebase-admin/firebase-admin';
import { Firebase } from './config/firebase/firebase';
import { PhoneValidationModule } from './modules/phone-validation/phone-validation.module';
import { RegistrationModule } from './modules/registration/registration.module';
import { RegistThirdPartyValidatorMiddleware } from './common/middleware/regist-third-party-validator.middleware';
import { ValidationModule } from './modules/validation/validation.module';
import { LoginModule } from './modules/login/login.module';
import { ResendOtpModule } from './common/helper/resend-otp/resend-otp.module';
import { ResetPasswordModule } from './modules/reset-password/reset-password.module';
import { ProfileModule } from './modules/profile/profile.module';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { AvatarController } from './modules/avatar/avatar.controller';
import { ProgressModule } from './modules/progress/progress.module';
import { ResidenceModule } from './modules/residence/residence.module';
import { PreferenceModule } from './modules/preference/preference.module';
import { SettingModule } from './modules/setting/setting.module';
import { ProfileImageModule } from './modules/profile-image/profile-image.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(),
    PhoneValidationModule,
    RegistrationModule,
    ValidationModule,
    LoginModule,
    ResendOtpModule,
    ResetPasswordModule,
    ProfileModule,
    ProgressModule,
    ResidenceModule,
    PreferenceModule,
    SettingModule,
    ProfileImageModule,
  ],
  controllers: [AppController, AvatarController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(FirebaseAdmin),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });

    initializeApp(Firebase);
  }

  configure(consumer: MiddlewareConsumer) {
    //middleware space
    consumer
      .apply(RegistThirdPartyValidatorMiddleware)
      .forRoutes(
        { path: 'registration/google', method: RequestMethod.POST },
        { path: 'registration/facebook', method: RequestMethod.POST },
      );
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'account/profile/me', method: RequestMethod.ALL },
        { path: 'account/progress', method: RequestMethod.ALL },
        { path: 'account/preference', method: RequestMethod.ALL },
        { path: 'account/setting', method: RequestMethod.ALL },
        { path: 'account/setting/*', method: RequestMethod.ALL },
        { path: 'account/avatar', method: RequestMethod.ALL },
      );
  }
}
