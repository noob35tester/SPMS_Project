import { Injectable } from '@nestjs/common';
import type { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { getPagination, paginated } from '../common/pagination';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HrmsService {
  constructor(private prisma: PrismaService) {}

  async employees(query: PaginationQueryDto) {
    const { skip, take, page, limit } = getPagination(query);
    const where = query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' as const } },
            { email: { contains: query.search, mode: 'insensitive' as const } },
            { designation: { contains: query.search, mode: 'insensitive' as const } },
          ],
        }
      : {};
    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          name: true,
          email: true,
          mobile: true,
          designation: true,
          status: true,
          department: true,
          reportingManager: { select: { id: true, name: true } },
        },
        orderBy: { name: 'asc' },
      }),
      this.prisma.user.count({ where }),
    ]);
    return paginated(data, total, page, limit);
  }

  employee(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        designation: true,
        status: true,
        department: true,
        reportingManager: { select: { id: true, name: true, email: true } },
        directReports: { select: { id: true, name: true, email: true, designation: true } },
      },
    });
  }

  headcount() {
    return this.prisma.department.findMany({
      include: { _count: { select: { users: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async summary() {
    const [totalEmployees, activeEmployees, departments] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { status: 'ACTIVE' } }),
      this.prisma.department.count(),
    ]);
    return { totalEmployees, activeEmployees, departments };
  }
}
