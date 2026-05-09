import { IsInt, IsString } from 'class-validator';

export class CreateWorkflowStateDto {
  @IsString()
  name!: string;

  @IsInt()
  order!: number;
}
