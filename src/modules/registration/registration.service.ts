import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserWithEmailDto } from './dto/create-user-with-email.dto';
import * as admin from 'firebase-admin';
import {
  getAuth,
  sendEmailVerification,
  signInWithCustomToken,
} from 'firebase/auth';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { getConnection, Repository } from 'typeorm';
import { CreateUserWithGoogleDto } from './dto/create-user-with-google.dto';
import { CreateUserWithPhoneDto } from './dto/create-user-with-phone.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { OtpLogsService } from '../otp-logs/otp-logs.service';
import { SendMailLogsEntity } from './entities/send_mail_logs.entity';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private otpLogsService: OtpLogsService,
  ) {}

  async registerUserWithEmail(
    createUserWithEmail: CreateUserWithEmailDto,
  ): Promise<any> {
    const { email, username, fullName, dateOfBirth, password } =
      createUserWithEmail;
    const registerUser = await admin
      .auth()
      .createUser({
        email: createUserWithEmail.email,
        password: password,
      })
      .then((result) => {
        const insertToDB = getConnection()
          .createQueryBuilder()
          .insert()
          .into(UserEntity)
          .values({
            id: result.uid,
            fullName: fullName,
            username: username,
            email: email,
            dateOfBirth: dateOfBirth,
          })
          .execute();
        console.log(insertToDB);
        return admin.auth().createCustomToken(result.uid);
      })
      .then((token) => {
        const auth = getAuth();
        return signInWithCustomToken(auth, token);
      })
      .then((user) => {
        const sendEmail = sendEmailVerification(user.user);
        if (sendEmail) {
          const insertMailLog = getConnection()
            .createQueryBuilder()
            .insert()
            .into(SendMailLogsEntity)
            .values({
              type: 'verify',
              email: email,
            })
            .execute();
          console.log(insertMailLog);
        }
        console.log(sendEmail);
        return {
          status: true,
          message: 'Registration success',
        };
      })
      .catch((error) => {
        console.log(error);
        return {
          status: false,
          message: [error.errorInfo.message],
        };
      });

    return registerUser;
  }

  async registerUserWithGoogle(createUserWithGoogle: CreateUserWithGoogleDto) {
    const { uid, email, emailVerified, displayName, photoURL } =
      createUserWithGoogle;
    const newUser = new UserEntity();
    const username = displayName.replace(/\s/g, '');
    newUser.id = uid;
    newUser.fullName = displayName;
    newUser.username =
      username.length >= 14
        ? username.substr(0, 14) + '_' + uid.substr(0, 14)
        : username + '_' + uid.substr(0, 14);
    newUser.email = email;
    newUser.avatar = photoURL;
    newUser.emailVerified = emailVerified;

    const insertData = await this.userRepo.save(newUser);

    return insertData;
  }

  async registerUserWithFacebook(
    createUserWithFacebook: CreateUserWithGoogleDto,
  ) {
    const { uid, email, displayName, photoURL } = createUserWithFacebook;
    const newUser = new UserEntity();
    const username = displayName.replace(/\s/g, '');
    newUser.id = uid;
    newUser.fullName = displayName;
    newUser.username =
      username.length >= 14
        ? username.substr(0, 14) + '_' + uid.substr(0, 14)
        : username + '_' + uid.substr(0, 14);
    newUser.email = email;
    newUser.avatar = photoURL;
    newUser.emailVerified = true;

    const insertData = await this.userRepo.save(newUser);
    if (insertData) {
      await admin
        .auth()
        .updateUser(uid, { emailVerified: true })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    return insertData;
  }

  async verifyEmail(verifyEmail: VerifyEmailDto) {
    const { email } = verifyEmail;
    console.log(email);
    /*
      This condition is to validate if the email 
      inserted by the user has been verified yet
    */
    const checkEmailStatus = await admin
      .auth()
      .getUserByEmail(email)
      .then((result) => {
        console.log(result.emailVerified);
        if (!result.emailVerified) {
          throw new BadRequestException();
        }
        return result;
      })
      .catch((error) => {
        console.log(error);
      });
    if (!checkEmailStatus) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: [
          'Ops.. We cant complete your request at the moment, we will fix this soon!',
        ],
        error: 'Bad Request',
      };
    }

    const update = await getConnection()
      .createQueryBuilder()
      .update(UserEntity)
      .set({ emailVerified: true })
      .where('email = :email', { email: email })
      .andWhere('email_verified = :emailVerified', { emailVerified: false })
      .execute();

    if (!update) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'Ops.. We cant complete your request at the moment, we will fix this soon!',
        ],
        error: 'Internal server error',
      };
    }

    return {
      status: true,
      message: 'Your email verification status updated successfully',
    };
  }

  async registerUserWithPhone(
    createUserWithPhone: CreateUserWithPhoneDto,
  ): Promise<any> {
    const { phoneNumber, username, fullName, dateOfBirth } =
      createUserWithPhone;

    const registerUser = await admin
      .auth()
      .createUser({
        phoneNumber: phoneNumber,
        displayName: fullName,
      })
      .then((userRecord) => {
        getConnection()
          .createQueryBuilder()
          .insert()
          .into(UserEntity)
          .values({
            id: userRecord.uid,
            fullName: fullName,
            username: username,
            phoneNumber: phoneNumber,
            phoneVerified: true,
            dateOfBirth: dateOfBirth,
          })
          .execute();

        this.otpLogsService.saveOtpLogs(createUserWithPhone);
        return {
          status: true,
          message: 'Registration success',
          data: userRecord,
        };
      })
      .catch((error) => {
        return {
          status: false,
          message: [error.errorInfo.message],
        };
      });

    return registerUser;
  }
}
