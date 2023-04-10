import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Match } from '../match.decorator';

export class CreateUserWithEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(30)
  @Matches('^[a-zA-Z0-9_.]+$')
  @Matches('^[^/.]') //not allowed a "." at the begining
  @Matches('[^/.]+$') //not allowed a "." at the end
  @Matches('^([^.]|([^.]).[^.])*$') //not allowed double "." or more on the sentence
  username: string;

  @IsNotEmpty()
  @MaxLength(500)
  @Matches('^[^"*/:<>?\\|]+$')
  fullName: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  dateOfBirth: Date;

  @IsNotEmpty()
  @MinLength(8)
  @Matches('[0-9]')
  password: string;

  @IsNotEmpty()
  @Match('password')
  passwordConfirm: string;
}
