import { IsBoolean, IsEmail, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class ActivateAccountDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsEmail()
  email!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  code!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsBoolean()
  acceptedPolicy!: boolean;
}
