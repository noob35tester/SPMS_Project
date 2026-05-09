import { IsInt, IsOptional, IsString } from 'class-validator';

export class ExecuteTransitionDto {
  @IsString()
  transitionId!: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsInt()
  position?: number;
}
