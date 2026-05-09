import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import type { RequestUser } from '../common/types/auth-user.type';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateWorkflowStateDto } from './dto/create-workflow-state.dto';
import type { CreateWorkflowTransitionDto } from './dto/create-workflow-transition.dto';
import type { CreateWorkflowDto } from './dto/create-workflow.dto';
import type { ExecuteTransitionDto } from './dto/execute-transition.dto';
import type { MoveKanbanTaskDto } from './dto/move-kanban-task.dto';

@Injectable()
export class WorkflowsService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
    private notificationsService: NotificationsService,
  ) {}

  list() {
    return this.prisma.workflowDefinition.findMany({
      include: { states: { orderBy: { order: 'asc' } }, transitions: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async detail(id: string) {
    const workflow = await this.prisma.workflowDefinition.findUnique({
      where: { id },
      include: { states: { orderBy: { order: 'asc' } }, transitions: true },
    });
    if (!workflow) {
      throw new NotFoundException('Workflow not found');
    }
    return workflow;
  }

  async byModule(module: string) {
    const workflow = await this.prisma.workflowDefinition.findFirst({
      where: { module },
      include: { states: { orderBy: { order: 'asc' } }, transitions: true },
    });
    if (!workflow) {
      throw new NotFoundException('Workflow not found');
    }
    return workflow;
  }

  async create(input: CreateWorkflowDto, user: RequestUser) {
    const workflow = await this.prisma.workflowDefinition.create({ data: input });
    await this.auditService.log({
      userId: user.id,
      action: 'WORKFLOW_CREATED',
      entity: 'WorkflowDefinition',
      entityId: workflow.id,
      details: input,
    });
    return workflow;
  }

  async addState(workflowId: string, input: CreateWorkflowStateDto, user: RequestUser) {
    const state = await this.prisma.workflowState.create({
      data: { ...input, workflowId },
    });
    await this.auditService.log({
      userId: user.id,
      action: 'WORKFLOW_STATE_CREATED',
      entity: 'WorkflowState',
      entityId: state.id,
      details: input,
    });
    return state;
  }

  async addTransition(workflowId: string, input: CreateWorkflowTransitionDto, user: RequestUser) {
    const transition = await this.prisma.workflowTransition.create({
      data: {
        workflowId,
        fromStateId: input.fromStateId,
        toStateId: input.toStateId,
        actionName: input.actionName,
        allowedRoles: input.allowedRoles,
        requiresComment: input.requiresComment ?? false,
      },
    });
    await this.auditService.log({
      userId: user.id,
      action: 'WORKFLOW_TRANSITION_CREATED',
      entity: 'WorkflowTransition',
      entityId: transition.id,
      details: input,
    });
    return transition;
  }

  async allowedTransitions(taskId: string, user: RequestUser) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { status: true },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const transitions = await this.prisma.workflowTransition.findMany({
      where: {
        workflowId: task.status.workflowId,
        fromStateId: task.statusId,
        isActive: true,
      },
    });
    const allowed = transitions.filter((transition) =>
      transition.allowedRoles.some((role) => user.roles.includes(role)),
    );
    const stateIds = [...new Set(allowed.flatMap((transition) => [transition.fromStateId, transition.toStateId]))];
    const states = await this.prisma.workflowState.findMany({ where: { id: { in: stateIds } } });
    const stateById = new Map(states.map((state) => [state.id, state]));

    return allowed.map((transition) => ({
      ...transition,
      fromState: stateById.get(transition.fromStateId),
      toState: stateById.get(transition.toStateId),
    }));
  }

  async executeTransition(taskId: string, input: ExecuteTransitionDto, user: RequestUser) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { status: true, assignee: true, createdBy: true },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const transition = await this.prisma.workflowTransition.findUnique({
      where: { id: input.transitionId },
    });
    if (!transition || !transition.isActive) {
      throw new NotFoundException('Workflow transition not found');
    }

    if (transition.fromStateId !== task.statusId) {
      throw new BadRequestException('Transition does not match current task status');
    }

    if (!transition.allowedRoles.some((role) => user.roles.includes(role))) {
      throw new ForbiddenException('This role cannot execute the transition');
    }

    if (transition.requiresComment && !input.comment) {
      throw new BadRequestException('A comment is required for this transition');
    }

    const toState = await this.prisma.workflowState.findUniqueOrThrow({
      where: { id: transition.toStateId },
    });

    const updatedTask = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.task.update({
        where: { id: taskId },
        data: {
          statusId: transition.toStateId,
          position: input.position ?? task.position,
          completedAt: toState.name === 'Done' ? new Date() : null,
        },
        include: {
          project: true,
          assignee: true,
          createdBy: true,
          status: true,
        },
      });

      await tx.taskStatusHistory.create({
        data: {
          taskId,
          fromStatus: task.status.name,
          toStatus: toState.name,
          changedById: user.id,
          comment: input.comment,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'TASK_TRANSITIONED',
          entity: 'Task',
          entityId: taskId,
          details: {
            fromStatus: task.status.name,
            toStatus: toState.name,
            transitionId: transition.id,
            comment: input.comment,
          },
        },
      });

      return updated;
    });

    await this.notificationsService.notifyUsers([task.assigneeId, task.createdById], {
      title: 'Task status changed',
      message: `${task.title} moved to ${toState.name}`,
      type: 'TASK_STATUS_CHANGED',
      link: `/tasks/${task.id}`,
    });

    return updatedTask;
  }

  history(taskId: string) {
    return this.prisma.taskStatusHistory.findMany({
      where: { taskId },
      orderBy: { changedAt: 'desc' },
    });
  }

  async kanban(projectId: string) {
    const workflow = await this.byModule('TASK');
    const tasks = await this.prisma.task.findMany({
      where: { projectId, archivedAt: null },
      include: { assignee: true, createdBy: true, status: true },
      orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
    });

    return {
      columns: workflow.states.map((state) => ({
        stateId: state.id,
        name: state.name,
        order: state.order,
        tasks: tasks.filter((task) => task.statusId === state.id),
      })),
    };
  }

  async moveKanbanTask(taskId: string, input: MoveKanbanTaskDto, user: RequestUser) {
    if (input.transitionId) {
      return this.executeTransition(taskId, {
        transitionId: input.transitionId,
        comment: input.comment,
        position: input.position,
      }, user);
    }

    const task = await this.prisma.task.update({
      where: { id: taskId },
      data: { position: input.position },
      include: { status: true, assignee: true, createdBy: true },
    });
    await this.auditService.log({
      userId: user.id,
      action: 'TASK_KANBAN_REORDERED',
      entity: 'Task',
      entityId: taskId,
      details: { position: input.position },
    });
    return task;
  }
}
