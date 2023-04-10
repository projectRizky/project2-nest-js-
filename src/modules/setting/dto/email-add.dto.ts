import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';
import { Match } from '../../registration/match.decorator';

export class EmailAdd {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches('[0-9]')
  password: string;

  @IsNotEmpty()
  @Match('password')
  passwordConfirm: string;
}
