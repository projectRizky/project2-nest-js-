import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { UserEntity } from '../registration/entities/user.entity';
import * as admin from 'firebase-admin';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  async getProgress(req: Request) {
    const userId = req['user'].uid;

    const user = await this.userRepo.findOne(userId);

    const userInFirebase = await admin.auth().getUser(userId);

    if (user) {
      return {
        status: true,
        data: [
          {
            done: Boolean(user.phoneVerified), //need phone number verified at columns
            text: 'Verify phone number',
          },
          {
            done: userInFirebase.emailVerified,
            text: 'Verify your email',
          },
          {
            done: user.username ? true : false,
            text: 'Set your username',
          },
          {
            done: user.dateOfBirth ? true : false,
            text: 'Set your date of birthday',
          },
          {
            done: user.gender === 'undefined' ? false : true,
            text: 'Choose your gender',
          },
          {
            done: user.address ? true : false,
            text: 'Filled your residence',
          },
        ],
      };
    } else {
      throw new NotFoundException();
    }
  }
}
