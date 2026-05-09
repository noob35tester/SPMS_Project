import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsOptional()
  @IsIn(['ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED', 'ARCHIVED'])
  status?: string;
}
