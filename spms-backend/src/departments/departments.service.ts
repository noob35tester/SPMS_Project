import { BadRequestException, Injectable } from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import type { RequestUser } from '../common/types/auth-user.type';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateDepartmentDto } from './dto/create-department.dto';
import type { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  list() {
    return this.prisma.department.findMany({
      include: {
        _count: {
          select: { users: true, projects: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async create(input: CreateDepartmentDto, user: RequestUser) {
    const department = await this.prisma.department.create({ data: input });
    await this.auditService.log({
      userId: user.id,
      action: 'DEPARTMENT_CREATED',
      entity: 'Department',
      entityId: department.id,
      details: input,
    });
    return department;
  }

  async update(id: string, input: UpdateDepartmentDto, user: RequestUser) {
    const department = await this.prisma.department.update({
      where: { id },
      data: input,
    });
    await this.auditService.log({
      userId: user.id,
      action: 'DEPARTMENT_UPDATED',
      entity: 'Department',
      entityId: id,
      details: input,
    });
    return department;
  }

  async delete(id: string, user: RequestUser) {
    const department = await this.prisma.department.findUnique({
      where: { id },
      include: { _count: { select: { users: true, projects: true } } },
    });

    if (department?._count.users || department?._count.projects) {
      throw new BadRequestException('Department is in use');
    }

    const deleted = await this.prisma.department.delete({ where: { id } });
    await this.auditService.log({
      userId: user.id,
      action: 'DEPARTMENT_DELETED',
      entity: 'Department',
      entityId: id,
    });
    return deleted;
  }
}
