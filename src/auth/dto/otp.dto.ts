import { IsEmail, IsString } from 'class-validator';

export class LoginWithOtpDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class VerifyOtpDto {
  @IsEmail()
  email: string;

  @IsString()
  code: string;
}
