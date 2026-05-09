import { IsInt, IsOptional, IsString } from 'class-validator';

export class MoveKanbanTaskDto {
  @IsOptional()
  @IsString()
  transitionId?: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsInt()
  position!: number;
}
