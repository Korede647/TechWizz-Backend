import { IsNotEmpty, Length, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { USER_ROLE } from "@prisma/client"

export class CreateUserDTO{
    @IsNotEmpty()
    @Length(2, 50)
    firstName!: string;

    @IsNotEmpty()
    @Length(2, 50)
    lastName!: string;

    @IsEmail()
    email!: string;

    @IsNotEmpty()
    @Length(6, 20)
    password!: string;

    @IsOptional()
    @IsNotEmpty()
    @IsEnum(USER_ROLE)
    role!: USER_ROLE;
}