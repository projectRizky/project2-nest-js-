import { IsNotEmpty } from 'class-validator';

export class ValidateUsernameDto {
  @IsNotEmpty()
  username: string;
}
