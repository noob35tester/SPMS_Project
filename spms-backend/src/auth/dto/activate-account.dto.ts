import { IsBoolean, IsEmail, IsString, MinLength } from 'class-validator';

export class ActivateAccountDto {
  @IsEmail()
  email!: string;

  @IsString()
  code!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsBoolean()
  acceptedPolicy!: boolean;
}
