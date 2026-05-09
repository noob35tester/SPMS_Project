import { IsInt, IsString } from 'class-validator';

export class UpdateTaskPositionDto {
  @IsString()
  statusId!: string;

  @IsInt()
  position!: number;
}
