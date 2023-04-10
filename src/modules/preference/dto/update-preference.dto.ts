import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdatePreferenceDto {
  @IsNotEmpty()
  emailNotification: boolean;

  @IsString()
  @IsEnum({
    first: 'id',
    seccond: 'en',
  })
  language: string;
}
