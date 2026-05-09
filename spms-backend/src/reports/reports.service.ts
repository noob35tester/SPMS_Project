import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { ReportQueryDto } from './dto/report-query.dto';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  private dateRange(query: ReportQueryDto) {
    if (!query.fromDate && !query.toDate) {
      return undefined;
    }
    return {
      gte: query.fromDate ? new Date(query.fromDate) : undefined,
      lte: query.toDate ? new Date(query.toDate) : undefined,
    };
  }

  tasks(query: ReportQueryDto) {
    return this.prisma.task.findMany({
      where: {
        archivedAt: null,
        createdAt: this.dateRange(query),
        priority: query.priority as any,
        projectId: query.projectId,
        assigneeId: query.userId,
        status: query.status ? { name: query.status } : undefined,
        project: query.departmentId ? { departmentId: query.departmentId } : undefined,
      },
      include: { project: true, assignee: true, status: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  projects(query: ReportQueryDto) {
    return this.prisma.project.findMany({
      where: {
        archivedAt: null,
        createdAt: this.dateRange(query),
        departmentId: query.departmentId,
        status: query.status as any,
      },
      include: { department: true, createdBy: true, _count: { select: { tasks: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  hr(query: ReportQueryDto) {
    return this.prisma.user.findMany({
      where: {
        createdAt: this.dateRange(query),
        departmentId: query.departmentId,
        status: query.status as any,
      },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        designation: true,
        status: true,
        department: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  sales(query: ReportQueryDto) {
    return this.prisma.lead.findMany({
      where: {
        createdAt: this.dateRange(query),
        status: query.status as any,
        ownerId: query.userId,
      },
      include: { owner: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
