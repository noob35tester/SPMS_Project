import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(input: {
    userId?: string | null;
    action: string;
    entity: string;
    entityId?: string | null;
    details?: unknown;
  }) {
    return this.prisma.auditLog.create({
      data: {
        userId: input.userId ?? null,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId ?? null,
        details: (input.details ?? {}) as any,
      },
    });
  }
}
