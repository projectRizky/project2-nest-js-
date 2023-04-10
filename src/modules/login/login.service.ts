import {
  BadRequestException,
  CACHE_MANAGER,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { EmailLoginDto } from './dto/email-login.dto';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { LoginLog } from '../login-logs/entities/login-log.entity';
import { Cache } from 'cache-manager';
import * as admin from 'firebase-admin';

import DeviceDetector = require('device-detector-js');

@Injectable()
export class LoginService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  login(req: Request, res: Response, emailLoginDto: EmailLoginDto) {
    this.cacheManager
      .get(`block.${req.ip}.${emailLoginDto.email}`)
      .then((ress: any) => {
        console.log(
          `block key: block.${req.ip}.${emailLoginDto.email}, value: ${ress}`,
        );
        if (ress) {
          const ttl = (ress.ttl * 1000 - (Date.now() - ress.date)) / 1000;
          return res
            .status(HttpStatus.TOO_MANY_REQUESTS)
            .json({
              status: false,
              message: 'to many attemps',
              try_after: parseInt(ttl.toFixed()),
            })
            .send();
        } else {
          this.cacheManager
            .get(`inc.${req.ip}.${emailLoginDto.email}`)
            .then((value: number) => {
              console.log(
                `key : inc.${req.ip}.${emailLoginDto.email}, value : ${value}`,
              );

              if (value == undefined) {
                this.cacheManager.set(
                  `inc.${req.ip}.${emailLoginDto.email}`,
                  1,
                  { ttl: 5000 },
                );
              } else {
                const date = Date.now();
                if (value == 2) {
                  this.cacheManager.set(
                    `block.${req.ip}.${emailLoginDto.email}`,
                    { date: date, ttl: 120 },
                    { ttl: 120 },
                  );
                } else if (value == 4) {
                  this.cacheManager.set(
                    `block.${req.ip}.${emailLoginDto.email}`,
                    { date: date, ttl: 300 },
                    { ttl: 300 },
                  );
                }

                this.cacheManager.set(
                  `inc.${req.ip}.${emailLoginDto.email}`,
                  1 + value,
                  { ttl: 5000 },
                );
              }
            });

          this.firebaseLogin(req, res, emailLoginDto);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async firebaseLogin(
    req: Request,
    res: Response,
    emailLoginDto: EmailLoginDto,
  ) {
    const auth = getAuth();

    const ip = req.ip.split(':');
    const ipv4 = ip[ip.length - 1];

    const deviceDetector = new DeviceDetector();

    const device = deviceDetector.parse(req.headers['user-agent']);

    const userdata = await admin.auth().getUserByEmail(emailLoginDto.email);

    if (userdata) {
      if (!userdata.emailVerified) {
        return new BadRequestException(
          'email not verified',
          'email not verified',
        ).getResponse();
      }
    }

    signInWithEmailAndPassword(
      auth,
      emailLoginDto.email,
      emailLoginDto.password,
    )
      .then(async (userCredential) => {
        const token = userCredential.user['stsTokenManager'].accessToken;

        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(LoginLog)
          .values({
            user_id: userCredential.user.uid,
            ip: ipv4,
            brand: `${device.device.brand} ${device.device.model}`,
            device: device.device.type,
            os: `${device.os.name} ${device.os.version} ${device.os.platform}`,
            browser: `${device.client.type} ${device.client.name} ${device.client.version}`,
            source_product: 1,
            status_login: 1,
          })
          .execute();

        return res
          .status(HttpStatus.OK)
          .json({
            status: true,
            message: 'Login Success',
            accessToken: token,
          })
          .send();
      })
      .catch(async (error) => {
        if (error.code == 'auth/user-not-found') {
          await getConnection()
            .createQueryBuilder()
            .insert()
            .into(LoginLog)
            .values({
              user_id: null,
              ip: ipv4,
              brand: `${device.device.brand} ${device.device.model}`,
              device: device.device.type,
              os: `${device.os.name} ${device.os.version} ${device.os.platform}`,
              browser: `${device.client.type} ${device.client.name} ${device.client.version}`,
              source_product: 1,
              status_login: 0,
            })
            .execute();
          return res
            .status(HttpStatus.UNAUTHORIZED)
            .json({
              status: false,
              message: 'Login Failed, Email Not Already Registered',
              accessToken: null,
            })
            .send();
        } else if (error.code == 'auth/wrong-password') {
          admin
            .auth()
            .getUserByEmail(emailLoginDto.email)
            .then(async (user) => {
              await getConnection()
                .createQueryBuilder()
                .insert()
                .into(LoginLog)
                .values({
                  user_id: user.uid,
                  ip: ipv4,
                  brand: `${device.device.brand} ${device.device.model}`,
                  device: device.device.type,
                  os: `${device.os.name} ${device.os.version} ${device.os.platform}`,
                  browser: `${device.client.type} ${device.client.name} ${device.client.version}`,
                  source_product: 1,
                  status_login: 0,
                })
                .execute();
            });
          return res
            .status(HttpStatus.FORBIDDEN)
            .json({
              status: false,
              message: 'Login Failed, Wrong Password',
              accessToken: null,
            })
            .send();
        }
      });
  }
}
