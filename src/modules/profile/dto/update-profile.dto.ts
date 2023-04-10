import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(30)
  @Matches('^[a-zA-Z0-9_.]+$')
  @Matches('^[^/.]') //not allowed a "." at the begining
  @Matches('[^/.]+$') //not allowed a "." at the end
  @Matches('^([^.]|([^.]).[^.])*$') //not allowed double "." or more on the sentence
  username: string;

  @IsDateString()
  dateOfBirth: string;

  @IsOptional()
  @IsString()
  @IsEnum({
    first: 'male',
    seccond: 'female',
  })
  gender: string;

  @IsNumber()
  @IsNotEmpty()
  countriesId: number;

  @IsNumber()
  @IsNotEmpty()
  statesId: number;

  @IsNumber()
  @IsOptional()
  citiesId: number;

  @IsString()
  @IsNotEmpty()
  address: string;
}
