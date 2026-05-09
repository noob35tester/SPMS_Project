import { ArrayNotEmpty, IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateWorkflowTransitionDto {
  @IsString()
  fromStateId!: string;

  @IsString()
  toStateId!: string;

  @IsString()
  actionName!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  allowedRoles!: string[];

  @IsOptional()
  @IsBoolean()
  requiresComment?: boolean;
}
