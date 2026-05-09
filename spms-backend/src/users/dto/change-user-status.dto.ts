import { IsIn } from 'class-validator';

const statuses = ['PENDING_ACTIVATION', 'ACTIVE', 'INACTIVE', 'LOCKED', 'SUSPENDED', 'TERMINATED'];

export class ChangeUserStatusDto {
  @IsIn(statuses)
  status!: string;
}
