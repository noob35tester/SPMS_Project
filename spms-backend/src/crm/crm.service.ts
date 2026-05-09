import { Injectable } from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import type { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { getPagination, paginated } from '../common/pagination';
import type { RequestUser } from '../common/types/auth-user.type';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateLeadDto } from './dto/create-lead.dto';
import type { UpdateLeadDto } from './dto/update-lead.dto';

@Injectable()
export class CrmService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async leads(query: PaginationQueryDto) {
    const { skip, take, page, limit } = getPagination(query);
    const where = query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' as const } },
            { company: { contains: query.search, mode: 'insensitive' as const } },
            { email: { contains: query.search, mode: 'insensitive' as const } },
          ],
        }
      : {};
    const [data, total] = await this.prisma.$transaction([
      this.prisma.lead.findMany({
        where,
        skip,
        take,
        include: { owner: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.lead.count({ where }),
    ]);
    return paginated(data, total, page, limit);
  }

  async createLead(input: CreateLeadDto, user: RequestUser) {
    const lead = await this.prisma.lead.create({
      data: {
        ...input,
        status: (input.status ?? 'NEW') as any,
        ownerId: input.ownerId ?? user.id,
      },
    });
    await this.auditService.log({
      userId: user.id,
      action: 'CRM_LEAD_CREATED',
      entity: 'Lead',
      entityId: lead.id,
      details: input,
    });
    return lead;
  }

  async updateLead(id: string, input: UpdateLeadDto, user: RequestUser) {
    const lead = await this.prisma.lead.update({
      where: { id },
      data: { ...input, status: input.status as any },
    });
    await this.auditService.log({
      userId: user.id,
      action: 'CRM_LEAD_UPDATED',
      entity: 'Lead',
      entityId: id,
      details: input,
    });
    return lead;
  }

  clients() {
    return this.prisma.lead.findMany({
      where: { status: 'WON' },
      include: { owner: { select: { id: true, name: true, email: true } } },
      orderBy: { updatedAt: 'desc' },
    });
  }

  followUps() {
    return this.prisma.lead.findMany({
      where: { status: { in: ['CONTACTED', 'QUALIFIED', 'PROPOSAL'] } },
      include: { owner: { select: { id: true, name: true, email: true } } },
      orderBy: { updatedAt: 'asc' },
    });
  }
}
