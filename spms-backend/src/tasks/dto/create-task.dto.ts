import { IsDateString, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
  priority?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  assigneeId?: string;

  @IsOptional()
  @IsString()
  parentTaskId?: string;

  @IsOptional()
  @IsNumber()
  estimatedHours?: number;
}
