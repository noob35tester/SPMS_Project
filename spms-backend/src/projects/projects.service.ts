import { Injectable, NotFoundException } from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import { getPagination, paginated } from '../common/pagination';
import type { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import type { RequestUser } from '../common/types/auth-user.type';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateProjectDto } from './dto/create-project.dto';
import type { ProjectMemberDto } from './dto/project-member.dto';
import type { UpdateProjectDto } from './dto/update-project.dto';

const projectInclude = {
  department: true,
  createdBy: { select: { id: true, name: true, email: true } },
  members: {
    include: {
      user: { select: { id: true, name: true, email: true, designation: true } },
    },
  },
  _count: { select: { tasks: true } },
} as const;

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  private async visibilityWhere(user: RequestUser) {
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
      OR: projectAccess,
    };
  }

  async list(query: PaginationQueryDto, user: RequestUser) {
    const { skip, take, page, limit } = getPagination(query);
    const visibility = await this.visibilityWhere(user);
    const where = {
      ...visibility,
      ...(query.search
        ? { name: { contains: query.search, mode: 'insensitive' as const } }
        : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        skip,
        take,
        include: projectInclude,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.project.count({ where }),
    ]);

    return paginated(data, total, page, limit);
  }

  async detail(id: string, user: RequestUser) {
    const visibility = await this.visibilityWhere(user);
    const project = await this.prisma.project.findFirst({
      where: { id, ...visibility },
      include: { ...projectInclude, tasks: { include: { status: true, assignee: true } } },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async create(input: CreateProjectDto, user: RequestUser) {
    const project = await this.prisma.$transaction(async (tx) => {
      const created = await tx.project.create({
        data: {
          name: input.name,
          description: input.description,
          departmentId: input.departmentId,
          createdById: user.id,
          members: {
            create: { userId: user.id, role: 'OWNER' },
          },
        },
        include: projectInclude,
      });

      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'PROJECT_CREATED',
          entity: 'Project',
          entityId: created.id,
          details: { ...input },
        },
      });

      return created;
    });

    return project;
  }

  async update(id: string, input: UpdateProjectDto, user: RequestUser) {
    const project = await this.prisma.project.update({
      where: { id },
      data: {
        ...input,
        status: input.status as any,
      },
      include: projectInclude,
    });
    await this.auditService.log({
      userId: user.id,
      action: 'PROJECT_UPDATED',
      entity: 'Project',
      entityId: id,
      details: input,
    });
    return project;
  }

  async archive(id: string, user: RequestUser) {
    const project = await this.prisma.project.update({
      where: { id },
      data: { status: 'ARCHIVED', archivedAt: new Date() },
      include: projectInclude,
    });
    await this.auditService.log({
      userId: user.id,
      action: 'PROJECT_ARCHIVED',
      entity: 'Project',
      entityId: id,
    });
    return project;
  }

  async addMember(id: string, input: ProjectMemberDto, user: RequestUser) {
    const member = await this.prisma.projectMember.upsert({
      where: { projectId_userId: { projectId: id, userId: input.userId } },
      update: { role: input.role ?? 'MEMBER' },
      create: { projectId: id, userId: input.userId, role: input.role ?? 'MEMBER' },
      include: { user: true, project: true },
    });
    await this.auditService.log({
      userId: user.id,
      action: 'PROJECT_MEMBER_ADDED',
      entity: 'Project',
      entityId: id,
      details: { userId: input.userId, role: input.role ?? 'MEMBER' },
    });
    return member;
  }

  async removeMember(id: string, userId: string, user: RequestUser) {
    const member = await this.prisma.projectMember.delete({
      where: { projectId_userId: { projectId: id, userId } },
    });
    await this.auditService.log({
      userId: user.id,
      action: 'PROJECT_MEMBER_REMOVED',
      entity: 'Project',
      entityId: id,
      details: { userId },
    });
    return member;
  }
}
