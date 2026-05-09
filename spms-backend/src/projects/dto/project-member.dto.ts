import { IsOptional, IsString } from 'class-validator';

export class ProjectMemberDto {
  @IsString()
  userId!: string;

  @IsOptional()
  @IsString()
  role?: string;
}
