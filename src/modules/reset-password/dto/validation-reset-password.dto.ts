import {  IsDefined, IsNotEmpty, IsString, Matches, MinLength, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
@ValidatorConstraint({name: 'isEqualPasswordField', async: false})
export class PasswordConfirmConstraint implements ValidatorConstraintInterface {

    defaultMessage(validationArguments?: ValidationArguments): string {
        return `"${validationArguments.property}" should be equal to "${validationArguments.constraints[0]}. Try again, but pay more attention :)"`;
    }

    validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        return value === validationArguments.object[validationArguments.constraints[0]];
    }
}
export class ValidationResetPasswordDto {
    
    @IsNotEmpty()
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*\d)\S+$/) // Regex for your password requirements
    @IsDefined()
    @MinLength(8)
    password: string;

    @IsString()
    @IsDefined()
    @MinLength(8)
    @Validate(PasswordConfirmConstraint, ['password'])
    password_confirm: string;
    @IsNotEmpty()
    @IsString()
    action:string
    
}

