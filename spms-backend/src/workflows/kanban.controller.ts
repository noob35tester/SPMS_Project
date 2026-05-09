import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Permissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import type { RequestUser } from '../common/types/auth-user.type';
import { MoveKanbanTaskDto } from './dto/move-kanban-task.dto';
import { WorkflowsService } from './workflows.service';

@Controller('kanban')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('kanban:view')
export class KanbanController {
  constructor(private workflowsService: WorkflowsService) {}

  @Get('projects/:projectId')
  projectBoard(@Param('projectId') projectId: string) {
    return this.workflowsService.kanban(projectId);
  }

  @Patch('tasks/:taskId/move')
  moveTask(
    @Param('taskId') taskId: string,
    @Body() input: MoveKanbanTaskDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.workflowsService.moveKanbanTask(taskId, input, user);
  }
}
