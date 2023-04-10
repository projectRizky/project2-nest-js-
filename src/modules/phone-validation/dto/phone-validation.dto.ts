import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class PhoneValidationDTO {
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;
}
