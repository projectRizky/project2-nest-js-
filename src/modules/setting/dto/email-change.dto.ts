import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailChange {
  @IsNotEmpty()
  @IsEmail()
  currentEmail: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
