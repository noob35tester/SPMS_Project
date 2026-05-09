import { Injectable } from '@nestjs/common';
import type { RequestUser } from '../common/types/auth-user.type';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async summary(user: RequestUser) {
    const [users, departments, projects, tasks, unreadNotifications, overdueTasks] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.department.count(),
      this.prisma.project.count({ where: { archivedAt: null } }),
      this.prisma.task.count({ where: { archivedAt: null } }),
      this.prisma.notification.count({ where: { userId: user.id, isRead: false } }),
      this.prisma.task.count({
        where: { archivedAt: null, dueDate: { lt: new Date() }, status: { name: { not: 'Done' } } },
      }),
    ]);

    return { users, departments, projects, tasks, unreadNotifications, overdueTasks };
  }

  roleSummary(role: string, user: RequestUser) {
    return this.summary(user).then((summary) => ({ role, ...summary }));
  }

  recentActivity() {
    return this.prisma.auditLog.findMany({
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 25,
    });
  }

  overdueTasks() {
    return this.prisma.task.findMany({
      where: { archivedAt: null, dueDate: { lt: new Date() }, status: { name: { not: 'Done' } } },
      include: { project: true, assignee: true, status: true },
      orderBy: { dueDate: 'asc' },
      take: 50,
    });
  }
}
