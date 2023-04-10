import { IsNotEmpty, Matches, MinLength } from 'class-validator';
import { Match } from '../../registration/match.decorator';

export class PasswordChange {
  @IsNotEmpty()
  oldPassword: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches('[0-9]')
  newPassword: string;

  @IsNotEmpty()
  @Match('newPassword')
  confirmPassword: string;
}
