import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  name!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsEmail()
  email!: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  mobile?: string;

  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  designation?: string;

  @IsOptional()
  @IsString()
  reportingManagerId?: string;

  @IsString()
  role!: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}
