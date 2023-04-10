import { IsEmail, IsNotEmpty } from "class-validator";
export class CreateResetPasswordDto {
    @IsEmail(undefined, { message: 'Not a valid e-mail' })
    @IsNotEmpty()
    email: string;
}
