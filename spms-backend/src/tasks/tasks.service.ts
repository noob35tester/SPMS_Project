import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import type { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { getPagination, paginated } from '../common/pagination';
import type { RequestUser } from '../common/types/auth-user.type';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import type { AssignTaskDto } from './dto/assign-task.dto';
import type { CreateTaskDto } from './dto/create-task.dto';
import type { UpdateTaskPositionDto } from './dto/update-task-position.dto';
import type { UpdateTaskDto } from './dto/update-task.dto';

const taskInclude = {
  project: { include: { department: true } },
  assignee: { select: { id: true, name: true, email: true } },
  createdBy: { select: { id: true, name: true, email: true } },
  status: true,
} as const;

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
    private notificationsService: NotificationsService,
  ) {}

  private async firstWorkflowState() {
    const state = await this.prisma.workflowState.findFirst({
      where: { workflow: { module: 'TASK' } },
      orderBy: { order: 'asc' },
    });
    if (!state) {
      throw new BadRequestException('Default task workflow is not configured');
    }
    return state;
  }

  private async accessibleWhere(user: RequestUser) {
    if (user.roles.includes('SUPER_ADMIN') || user.roles.includes('ADMIN')) {
      return { archivedAt: null };
    }

    const current = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { departmentId: true },
    });
    const projectAccess = [
      { createdById: user.id },
      { members: { some: { userId: user.id } } },
      ...(current?.departmentId ? [{ departmentId: current.departmentId }] : []),
    ];

    return {
      archivedAt: null,
      OR: [
        { assigneeId: user.id },
        { createdById: user.id },
        { project: { OR: projectAccess } },
      ],
    };
  }

  async list(query: PaginationQueryDto, user: RequestUser) {
    const { skip, take, page, limit } = getPagination(query);
    const access = await this.accessibleWhere(user);
    const where = {
      ...access,
      ...(query.search
        ? { title: { contains: query.search, mode: 'insensitive' as const } }
        : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where,
        skip,
        take,
        include: taskInclude,
        orderBy: [{ status: { order: 'asc' } }, { position: 'asc' }],
      }),
      this.prisma.task.count({ where }),
    ]);
    return paginated(data, total, page, limit);
  }

  async myTasks(query: PaginationQueryDto, user: RequestUser) {
    const { skip, take, page, limit } = getPagination(query);
    const where = {
      archivedAt: null,
      assigneeId: user.id,
      ...(query.search
        ? { title: { contains: query.search, mode: 'insensitive' as const } }
        : {}),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({ where, skip, take, include: taskInclude, orderBy: { dueDate: 'asc' } }),
      this.prisma.task.count({ where }),
    ]);
    return paginated(data, total, page, limit);
  }

  projectTasks(projectId: string) {
    return this.prisma.task.findMany({
      where: { projectId, archivedAt: null },
      include: taskInclude,
      orderBy: [{ status: { order: 'asc' } }, { position: 'asc' }],
    });
  }

  async detail(id: string, user: RequestUser) {
    const access = await this.accessibleWhere(user);
    const task = await this.prisma.task.findFirst({
      where: { id, ...access },
      include: {
        ...taskInclude,
        comments: { include: { user: true }, orderBy: { createdAt: 'desc' } },
        history: { orderBy: { changedAt: 'desc' } },
      },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async create(projectId: string, input: CreateTaskDto, user: RequestUser) {
    const status = await this.firstWorkflowState();
    const task = await this.prisma.$transaction(async (tx) => {
      const lastPosition = await tx.task.aggregate({
        where: { projectId, statusId: status.id },
        _max: { position: true },
      });
      const created = await tx.task.create({
        data: {
          title: input.title,
          description: input.description,
          priority: (input.priority ?? 'MEDIUM') as any,
          dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
          projectId,
          assigneeId: input.assigneeId,
          createdById: user.id,
          statusId: status.id,
          parentTaskId: input.parentTaskId,
          estimatedHours: input.estimatedHours,
          position: (lastPosition._max.position ?? -1) + 1,
        },
        include: taskInclude,
      });
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'TASK_CREATED',
          entity: 'Task',
          entityId: created.id,
          details: { ...input },
        },
      });
      return created;
    });

    if (task.assigneeId) {
      await this.notificationsService.create({
        userId: task.assigneeId,
        title: 'Task assigned',
        message: `${task.title} has been assigned to you`,
        type: 'TASK_ASSIGNED',
        link: `/tasks/${task.id}`,
      });
    }

    return task;
  }

  async update(id: string, input: UpdateTaskDto, user: RequestUser) {
    const task = await this.prisma.task.update({
      where: { id },
      data: {
        title: input.title,
        description: input.description,
        priority: input.priority as any,
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        estimatedHours: input.estimatedHours,
        actualHours: input.actualHours,
      },
      include: taskInclude,
    });
    await this.auditService.log({
      userId: user.id,
      action: 'TASK_UPDATED',
      entity: 'Task',
      entityId: id,
      details: input,
    });
    return task;
  }

  async archive(id: string, user: RequestUser) {
    const task = await this.prisma.task.update({
      where: { id },
      data: { archivedAt: new Date() },
      include: taskInclude,
    });
    await this.auditService.log({
      userId: user.id,
      action: 'TASK_ARCHIVED',
      entity: 'Task',
      entityId: id,
    });
    return task;
  }

  async assign(id: string, input: AssignTaskDto, user: RequestUser) {
    const task = await this.prisma.task.update({
      where: { id },
      data: { assigneeId: input.assigneeId },
      include: taskInclude,
    });
    await this.auditService.log({
      userId: user.id,
      action: 'TASK_ASSIGNED',
      entity: 'Task',
      entityId: id,
      details: { assigneeId: input.assigneeId },
    });
    await this.notificationsService.create({
      userId: input.assigneeId,
      title: 'Task assigned',
      message: `${task.title} has been assigned to you`,
      type: 'TASK_ASSIGNED',
      link: `/tasks/${task.id}`,
    });
    return task;
  }

  async updatePosition(id: string, input: UpdateTaskPositionDto, user: RequestUser) {
    const task = await this.prisma.task.update({
      where: { id },
      data: {
        position: input.position,
      },
      include: taskInclude,
    });
    await this.auditService.log({
      userId: user.id,
      action: 'TASK_POSITION_UPDATED',
      entity: 'Task',
      entityId: id,
      details: { position: input.position, requestedStatusId: input.statusId },
    });
    return task;
  }
}
