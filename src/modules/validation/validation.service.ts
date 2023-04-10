import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { UserEntity } from '../registration/entities/user.entity';
import { ValidateEmailDto } from './dto/validate-email.dto';
import { ValidateUsernameDto } from './dto/validate-username.dto';

@Injectable()
export class ValidationService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  async checkEmailRegistrationStatus(validateEmailDto: ValidateEmailDto) {
    const checkEmail = await getConnection()
      .createQueryBuilder()
      .select(['user.id'])
      .from(UserEntity, 'user')
      .where('user.email = :email', { email: validateEmailDto.email })
      .getOne();
    console.log(checkEmail);
    return checkEmail;
  }

  async checkUsernameRegistrationStatus(
    validateUsernameDto: ValidateUsernameDto,
  ) {
    const checkUsername = await getConnection()
      .createQueryBuilder()
      .select(['user.id'])
      .from(UserEntity, 'user')
      .where('user.username = :username', {
        username: validateUsernameDto.username,
      })
      .getOne();
    return checkUsername;
  }

  async checkUsernameNEmailRegistStatus(username: string, email: string) {
    const checkUsernameNEmail = await getConnection()
      .createQueryBuilder()
      .select(['user.id'])
      .from(UserEntity, 'user')
      .where('user.username = :username', {
        username: username,
      })
      .orWhere('user.email = :email', {
        email: email,
      })
      .getOne();

    return checkUsernameNEmail;
  }

  async checkUsernameNPhoneNumberRegistStatus(
    username: string,
    phoneNumber: string,
  ) {
    const checkUsernameNPhoneNumber = await getConnection()
      .createQueryBuilder()
      .select(['user.id'])
      .from(UserEntity, 'user')
      .where('user.username = :username', {
        username: username,
      })
      .orWhere('user.phone_number = :phoneNumber', {
        phoneNumber: phoneNumber,
      })
      .getOne();

    return checkUsernameNPhoneNumber;
  }
}
