import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import type { RequestUser } from '../common/types/auth-user.type';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateCommentDto } from './dto/create-comment.dto';
import type { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
    private notificationsService: NotificationsService,
  ) {}

  list(taskId: string) {
    return this.prisma.taskComment.findMany({
      where: { taskId },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(taskId: string, input: CreateCommentDto, user: RequestUser) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      select: { id: true, title: true, assigneeId: true, createdById: true },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const comment = await this.prisma.taskComment.create({
      data: {
        taskId,
        userId: user.id,
        message: input.message,
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    await this.auditService.log({
      userId: user.id,
      action: 'TASK_COMMENT_CREATED',
      entity: 'TaskComment',
      entityId: comment.id,
      details: { taskId },
    });
    await this.notificationsService.notifyUsers([task.assigneeId, task.createdById], {
      title: 'New task comment',
      message: `A comment was added to ${task.title}`,
      type: 'TASK_COMMENT',
      link: `/tasks/${task.id}`,
    });
    return comment;
  }

  async update(id: string, input: UpdateCommentDto, user: RequestUser) {
    const comment = await this.prisma.taskComment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.userId !== user.id && !user.roles.includes('ADMIN') && !user.roles.includes('SUPER_ADMIN')) {
      throw new ForbiddenException('Only the owner or admin can edit this comment');
    }

    const updated = await this.prisma.taskComment.update({
      where: { id },
      data: { message: input.message },
    });
    await this.auditService.log({
      userId: user.id,
      action: 'TASK_COMMENT_UPDATED',
      entity: 'TaskComment',
      entityId: id,
    });
    return updated;
  }

  async delete(id: string, user: RequestUser) {
    const comment = await this.prisma.taskComment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.userId !== user.id && !user.roles.includes('ADMIN') && !user.roles.includes('SUPER_ADMIN')) {
      throw new ForbiddenException('Only the owner or admin can delete this comment');
    }

    const deleted = await this.prisma.taskComment.delete({ where: { id } });
    await this.auditService.log({
      userId: user.id,
      action: 'TASK_COMMENT_DELETED',
      entity: 'TaskComment',
      entityId: id,
    });
    return deleted;
  }
}
