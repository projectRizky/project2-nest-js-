import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class PhoneAdd {
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  credential: string;
}
