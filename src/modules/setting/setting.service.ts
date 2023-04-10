import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { UserEntity } from 'src/modules/registration/entities/user.entity';
import { createQueryBuilder, getConnection, Repository } from 'typeorm';
import { PasswordChange } from './dto/password-change.dto';
import * as admin from 'firebase-admin';
import {
  getAuth,
  sendEmailVerification,
  signInWithCredential,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  updateEmail,
} from 'firebase/auth';
import { EmailAdd } from './dto/email-add.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SendMailLogsEntity } from '../registration/entities/send_mail_logs.entity';
import { EmailChange } from './dto/email-change.dto';
import { PhoneAdd } from './dto/phone-add.dto';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  async getSetting(req: Request) {
    const userId = req['user'].uid;

    const user = await createQueryBuilder(UserEntity)
      .select(['email', 'phone_number'])
      .where('id = :uid', { uid: userId })
      .getRawOne();

    const userInFirebase = await admin.auth().getUser(userId);
    return {
      status: true,
      data: {
        email: {
          statusVerified: userInFirebase.emailVerified,
          requestVerified: false,
          value: user.email,
        },
        phoneNumber: user.phone_number,
      },
    };
  }

  async addEmail(req: Request, emailAdd: EmailAdd) {
    const { email, password } = emailAdd;

    const userId = req['user'].uid;

    const checkUser = await admin.auth().getUser(userId);

    const check = checkUser.providerData.find((data) => {
      if (data.providerId.match('password')) {
        return true;
      }
    });
    if (check) {
      return new BadRequestException(
        'sudah pernah menambahkan email',
      ).getResponse();
    } else {
      try {
        const update = await this.userRepo.update(
          { id: userId },
          { email: email, emailVerified: false },
        );

        if (update) {
          await admin.auth().updateUser(userId, {
            email: email,
            password: password,
          });

          const userInFirebase = await admin.auth().getUser(userId);

          await admin
            .auth()
            .createCustomToken(userId)
            .then((token) => {
              const auth = getAuth();
              return signInWithCustomToken(auth, token);
            })
            .then(async (user) => {
              const sendEmail = sendEmailVerification(user.user);

              if (sendEmail) {
                const insertMailLog = await getConnection()
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
            });
          return {
            status: true,
            message: 'add email success',
            data: {
              email: {
                statusVerified: userInFirebase.emailVerified,
                requestVerified: true,
                value: userInFirebase.email,
              },
              phoneNumber: userInFirebase.email,
            },
          };
        }
      } catch (error) {
        if (error.code.match('ER_DUP_ENTRY')) {
          return new BadRequestException(
            'Email Sudah Pernah digunakan',
          ).getResponse();
        } else {
          return new ConflictException('Gagal Menambahkan Email').getResponse();
        }
      }
    }
  }

  async addPhoneNumber(req: Request, phoneAdd: PhoneAdd) {
    const userId = req['user'].uid;

    const user = await admin.auth().getUser(userId);

    const check = user.providerData.find((data) => {
      if (data.providerId.match('phone')) {
        return true;
      }
    });

    if (check) {
      return new BadRequestException(
        'already have a phone number',
        'already have a phone number',
      ).getResponse();
    } else {
      return admin
        .auth()
        .verifyIdToken(phoneAdd.credential)
        .then((phoneUser) => {
          if (phoneUser.phone_number.match(phoneAdd.phoneNumber)) {
            admin.auth().deleteUser(phoneUser.uid);

            admin
              .auth()
              .updateUser(userId, { phoneNumber: phoneAdd.phoneNumber });

            this.userRepo.update(
              { id: userId },
              { phoneNumber: phoneAdd.phoneNumber, phoneVerified: true },
            );

            return {
              status: true,
              message: 'add email success',
              data: {
                email: {
                  statusVerified: user.emailVerified,
                  requestVerified: false,
                  value: user.email,
                },
                phoneNumber: phoneAdd.phoneNumber,
              },
            };
          } else {
            return new BadRequestException(
              'invalid credential',
              'invalid credential',
            ).getResponse();
          }
        })
        .catch((e) => {
          console.log(e);
          return new BadRequestException(
            'invalid creadential',
            'invalid creadential',
          ).getResponse();
        });
    }
  }

  async changeEmail(req: Request, emailChange: EmailChange) {
    const userId = req['user'].uid;

    const auth = getAuth();

    // const user = await admin.auth().getUser(userId);

    const token_req = req.headers.authorization;
    const token = token_req.replace('Bearer ', '');

    signInWithCustomToken(auth, token).then((cre) => {
      const user = cre.user;
      updateEmail(user, emailChange.email);
    });

    const userInFirebase = await admin.auth().getUser(userId);
    return {
      status: true,
      data: {
        email: {
          statusVerified: userInFirebase.emailVerified,
          requestVerified: true,
          value: userInFirebase.email,
        },
        phoneNumber: userInFirebase.phoneNumber,
      },
    };
  }

  async changePassword(req: Request, passwordDto: PasswordChange) {
    const userId = req['user'].uid;

    const userInFirebase = await admin.auth().getUser(userId);

    const check = userInFirebase.providerData.find((data) => {
      if (data.providerId.match('password')) {
        return true;
      }
    });

    if (check) {
      const auth = getAuth();

      return signInWithEmailAndPassword(
        auth,
        userInFirebase.email,
        passwordDto.oldPassword,
      )
        .then((data) => {
          admin.auth().updateUser(userId, {
            password: passwordDto.newPassword,
          });
          return {
            status: true,
            message: 'change password success',
            data: {
              email: {
                statusVerified: data.user.emailVerified,
                requestVerified: false,
                value: data.user.email,
              },
              phoneNumber: data.user.phoneNumber,
            },
          };
        })
        .catch(() => {
          return new BadRequestException('oldPassword wrong').getResponse();
        });
    } else {
      return new BadRequestException(
        "this account doesn'n have password",
      ).getResponse();
    }
  }
}
