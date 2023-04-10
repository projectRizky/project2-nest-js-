import { Type } from 'class-transformer';
import { IsDate, IsPhoneNumber, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateUserWithPhoneDto {
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @MaxLength(255)
  fullName: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  dateOfBirth: Date;
}
