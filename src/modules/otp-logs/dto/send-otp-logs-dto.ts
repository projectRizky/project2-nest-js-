import { IsPhoneNumber, IsNotEmpty } from 'class-validator';

export class SendOtpLogsDto {
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;
}
