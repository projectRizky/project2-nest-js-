import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { CreateUserWithEmailDto } from './dto/create-user-with-email.dto';
import { RegistrationService } from './registration.service';
import { Response } from 'express';
import { CreateUserWithPhoneDto } from './dto/create-user-with-phone.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ValidationService } from '../validation/validation.service';

@Controller('registration')
export class RegistrationController {
  constructor(
    private registrationService: RegistrationService,
    private validationService: ValidationService,
  ) {}

  @Post('email')
  async registerWithEmaill(
    @Body() createUserWithEmailDto: CreateUserWithEmailDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    try {
      const validateUsernameNEmail =
        await this.validationService.checkUsernameNEmailRegistStatus(
          createUserWithEmailDto.username,
          createUserWithEmailDto.email,
        );
      if (validateUsernameNEmail) throw new BadRequestException();

      const result = await this.registrationService.registerUserWithEmail(
        createUserWithEmailDto,
      );
      if (result.status === false) {
        res.status(HttpStatus.BAD_REQUEST);
      }
      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        res.status(HttpStatus.BAD_REQUEST);
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: [
            'Ops.. We cant complete your request at the moment, we will fix this soon!',
          ],
          error: 'Bad Request',
        };
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'Ops.. We cant complete your request at the moment, we will fix this soon!',
        ],
        error: 'Internal Server Error',
      };
    }
  }

  @Post('google')
  async registerWithGoogle(@Res({ passthrough: true }) res: Response) {
    const { uid, email, email_verified, name, picture } = res.locals;

    const checkEmailRegistStatus =
      await this.validationService.checkEmailRegistrationStatus({
        email: email,
      });
    if (checkEmailRegistStatus) {
      return {
        status: true,
        message: 'This user registered successfully',
      };
    }

    const result = await this.registrationService.registerUserWithGoogle({
      uid: uid,
      email: email,
      emailVerified: email_verified,
      displayName: name,
      isAnonymous: false,
      photoURL: picture,
    });
    if (!result) {
      res.status(HttpStatus.BAD_REQUEST);
      return {
        status: false,
        message: ['Failed to insert data!'],
      };
    }

    return {
      status: true,
      message: 'This user registered successfully',
    };
  }

  @Post('facebook')
  async registerWithFacebook(@Res({ passthrough: true }) res: Response) {
    //facebook registration logic
    const { uid, email, email_verified, name, picture } = res.locals;

    const checkEmailRegistStatus =
      await this.validationService.checkEmailRegistrationStatus({
        email: email,
      });
    if (checkEmailRegistStatus) {
      return {
        status: true,
        message: 'This user registered successfully',
      };
    }

    const result = await this.registrationService.registerUserWithFacebook({
      uid: uid,
      email: email,
      emailVerified: email_verified,
      displayName: name,
      isAnonymous: false,
      photoURL: picture,
    });
    if (!result) {
      res.status(HttpStatus.BAD_REQUEST);
      return {
        status: false,
        message: ['Failed to insert data!'],
      };
    }

    return {
      status: true,
      message: 'This user registered successfully',
    };
  }

  @Post('email-verification')
  async updateEmailVerificationStatus(
    @Body() verifyEmailDto: VerifyEmailDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const updateEmail = await this.registrationService.verifyEmail(
      verifyEmailDto,
    );
    if (updateEmail.error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return updateEmail;
  }

  @Post('phone')
  async registerWithPhone(
    @Body() createUserWithPhoneDto: CreateUserWithPhoneDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const validateUsernameNPhoneNumber =
      await this.validationService.checkUsernameNPhoneNumberRegistStatus(
        createUserWithPhoneDto.username,
        createUserWithPhoneDto.phoneNumber,
      );

    if (validateUsernameNPhoneNumber) {
      res.status(HttpStatus.BAD_REQUEST);
      return {
        status: false,
        message: 'Username or Phone Number already exist',
      };
    }

    const result = await this.registrationService.registerUserWithPhone(
      createUserWithPhoneDto,
    );
    if (!result.status) {
      res.status(HttpStatus.BAD_REQUEST);
    }
    return result;
  }
}
