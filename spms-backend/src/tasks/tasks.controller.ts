import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import type { RequestUser } from '../common/types/auth-user.type';
import { AssignTaskDto } from './dto/assign-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskPositionDto } from './dto/update-task-position.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get('tasks')
  @Permissions('tasks:view')
  list(@Query() query: PaginationQueryDto, @CurrentUser() user: RequestUser) {
    return this.tasksService.list(query, user);
  }

  @Get('tasks/my-tasks')
  @Permissions('my-tasks:view')
  myTasks(@Query() query: PaginationQueryDto, @CurrentUser() user: RequestUser) {
    return this.tasksService.myTasks(query, user);
  }

  @Get('projects/:projectId/tasks')
  @Permissions('tasks:view')
  projectTasks(@Param('projectId') projectId: string) {
    return this.tasksService.projectTasks(projectId);
  }

  @Get('tasks/:id')
  @Permissions('tasks:view', 'my-tasks:view')
  detail(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.tasksService.detail(id, user);
  }

  @Post('projects/:projectId/tasks')
  @Permissions('tasks:create')
  create(
    @Param('projectId') projectId: string,
    @Body() input: CreateTaskDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.tasksService.create(projectId, input, user);
  }

  @Patch('tasks/:id')
  @Permissions('tasks:create')
  update(@Param('id') id: string, @Body() input: UpdateTaskDto, @CurrentUser() user: RequestUser) {
    return this.tasksService.update(id, input, user);
  }

  @Delete('tasks/:id')
  @Permissions('tasks:create')
  archive(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.tasksService.archive(id, user);
  }

  @Post('tasks/:id/assign')
  @Permissions('tasks:create')
  assign(@Param('id') id: string, @Body() input: AssignTaskDto, @CurrentUser() user: RequestUser) {
    return this.tasksService.assign(id, input, user);
  }

  @Patch('tasks/:id/position')
  @Permissions('kanban:view')
  updatePosition(@Param('id') id: string, @Body() input: UpdateTaskPositionDto, @CurrentUser() user: RequestUser) {
    return this.tasksService.updatePosition(id, input, user);
  }
}
