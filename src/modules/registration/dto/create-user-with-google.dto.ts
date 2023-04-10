import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateUserWithGoogleDto {
  @IsNotEmpty()
  @IsUUID()
  uid: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  emailVerified: boolean;

  @IsNotEmpty()
  displayName: string;

  @IsNotEmpty()
  isAnonymous: boolean;

  @IsNotEmpty()
  photoURL: string;
}
