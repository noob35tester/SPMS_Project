import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Permissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import type { RequestUser } from '../common/types/auth-user.type';
import { CreateWorkflowStateDto } from './dto/create-workflow-state.dto';
import { CreateWorkflowTransitionDto } from './dto/create-workflow-transition.dto';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { ExecuteTransitionDto } from './dto/execute-transition.dto';
import { WorkflowsService } from './workflows.service';

@Controller()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class WorkflowsController {
  constructor(private workflowsService: WorkflowsService) {}

  @Get('workflows')
  @Permissions('workflow:view')
  list() {
    return this.workflowsService.list();
  }

  @Get('workflows/module/:module')
  @Permissions('workflow:view')
  byModule(@Param('module') module: string) {
    return this.workflowsService.byModule(module);
  }

  @Get('workflows/:id')
  @Permissions('workflow:view')
  detail(@Param('id') id: string) {
    return this.workflowsService.detail(id);
  }

  @Post('workflows')
  @Permissions('settings:manage')
  create(@Body() input: CreateWorkflowDto, @CurrentUser() user: RequestUser) {
    return this.workflowsService.create(input, user);
  }

  @Post('workflows/:id/states')
  @Permissions('settings:manage')
  addState(@Param('id') id: string, @Body() input: CreateWorkflowStateDto, @CurrentUser() user: RequestUser) {
    return this.workflowsService.addState(id, input, user);
  }

  @Post('workflows/:id/transitions')
  @Permissions('settings:manage')
  addTransition(
    @Param('id') id: string,
    @Body() input: CreateWorkflowTransitionDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.workflowsService.addTransition(id, input, user);
  }

  @Get('tasks/:id/allowed-transitions')
  @Permissions('kanban:view')
  allowedTransitions(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.workflowsService.allowedTransitions(id, user);
  }

  @Post('tasks/:id/transition')
  @Permissions('kanban:view')
  executeTransition(@Param('id') id: string, @Body() input: ExecuteTransitionDto, @CurrentUser() user: RequestUser) {
    return this.workflowsService.executeTransition(id, input, user);
  }

  @Get('tasks/:id/history')
  @Permissions('tasks:view')
  history(@Param('id') id: string) {
    return this.workflowsService.history(id);
  }
}
