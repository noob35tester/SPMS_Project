import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AuditService } from '../audit/audit.service';
import { ROLE_LANDING_PATHS, type SystemRole } from '../common/rbac.constants';
import { getPagination, paginated } from '../common/pagination';
import type { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import type { RequestUser } from '../common/types/auth-user.type';
import { PrismaService } from '../prisma/prisma.service';
import type { AssignRolesDto } from './dto/assign-roles.dto';
import type { ChangeUserStatusDto } from './dto/change-user-status.dto';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';

const includeUser = {
  department: true,
  reportingManager: {
    select: { id: true, name: true, email: true },
  },
  userRoles: {
    include: {
      role: {
        include: {
          rolePermissions: {
            include: { permission: true },
          },
        },
      },
    },
  },
} as const;

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private auditService: AuditService,
  ) {}

  private activationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  formatUser(user: any) {
    const roles = user.userRoles?.map((userRole: any) => userRole.role.name) ?? [];
    const permissions = [
      ...new Set(
        user.userRoles?.flatMap((userRole: any) =>
          userRole.role.rolePermissions?.map((rolePermission: any) => rolePermission.permission.key) ?? [],
        ) ?? [],
      ),
    ];
    const primaryRole = (roles[0] ?? 'EMPLOYEE') as SystemRole;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: primaryRole,
      roles,
      permissions,
      mobile: user.mobile,
      department: user.department?.name,
      departmentId: user.departmentId,
      designation: user.designation,
      reportingManager: user.reportingManager?.name,
      reportingManagerId: user.reportingManagerId,
      status: user.status,
      policyAccepted: user.policyAccepted,
      lastLoginAt: user.lastLoginAt,
      activationCode: user.activationCode,
      resetCode: user.resetCode,
      landingPath: ROLE_LANDING_PATHS[primaryRole] ?? '/dashboard/employee',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email: { equals: this.normalizeEmail(email), mode: 'insensitive' } },
      include: includeUser,
    });
  }

  async findOneById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: includeUser,
    });
  }

  async list(query: PaginationQueryDto) {
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
        include: includeUser,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return paginated(data.map((user) => this.formatUser(user)), total, page, limit);
  }

  async detail(id: string) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.formatUser(user);
  }

  async create(input: CreateUserDto, actor: RequestUser) {
    const existing = await this.findOneByEmail(input.email);
    if (existing) {
      throw new BadRequestException('A user with this email already exists');
    }

    const role = await this.prisma.role.findUnique({ where: { name: input.role } });
    if (!role) {
      throw new BadRequestException('Role not found');
    }

    const activationCode = this.activationCode();
    const saltRounds = Number(this.configService.get('BCRYPT_SALT_ROUNDS') ?? 10);
    const passwordHash = await bcrypt.hash(input.password ?? activationCode, saltRounds);

    const user = await this.prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          name: input.name,
          email: this.normalizeEmail(input.email),
          mobile: input.mobile,
          designation: input.designation,
          departmentId: input.departmentId,
          reportingManagerId: input.reportingManagerId,
          passwordHash,
          activationCode,
          status: 'PENDING_ACTIVATION',
        },
      });

      await tx.userRole.create({
        data: {
          userId: created.id,
          roleId: role.id,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: actor.id,
          action: 'USER_CREATED',
          entity: 'User',
          entityId: created.id,
          details: { email: created.email, role: input.role },
        },
      });

      return tx.user.findUniqueOrThrow({ where: { id: created.id }, include: includeUser });
    });

    return this.formatUser(user);
  }

  async update(id: string, input: UpdateUserDto, actor: RequestUser) {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...input,
        email: input.email ? this.normalizeEmail(input.email) : undefined,
      },
      include: includeUser,
    });

    await this.auditService.log({
      userId: actor.id,
      action: 'USER_UPDATED',
      entity: 'User',
      entityId: id,
      details: input,
    });

    return this.formatUser(user);
  }

  async changeStatus(id: string, input: ChangeUserStatusDto, actor: RequestUser) {
    const user = await this.prisma.user.update({
      where: { id },
      data: { status: input.status as any },
      include: includeUser,
    });

    await this.auditService.log({
      userId: actor.id,
      action: 'USER_STATUS_CHANGED',
      entity: 'User',
      entityId: id,
      details: { status: input.status },
    });

    return this.formatUser(user);
  }

  async assignRoles(id: string, input: AssignRolesDto, actor: RequestUser) {
    const roles = await this.prisma.role.findMany({ where: { name: { in: input.roles } } });
    if (roles.length !== input.roles.length) {
      throw new BadRequestException('One or more roles were not found');
    }

    const user = await this.prisma.$transaction(async (tx) => {
      await tx.userRole.deleteMany({ where: { userId: id } });
      await tx.userRole.createMany({
        data: roles.map((role) => ({ userId: id, roleId: role.id })),
        skipDuplicates: true,
      });
      await tx.auditLog.create({
        data: {
          userId: actor.id,
          action: 'USER_ROLES_ASSIGNED',
          entity: 'User',
          entityId: id,
          details: { roles: input.roles },
        },
      });
      return tx.user.findUniqueOrThrow({ where: { id }, include: includeUser });
    });

    return this.formatUser(user);
  }

  async softDeactivate(id: string, actor: RequestUser) {
    const user = await this.prisma.user.update({
      where: { id },
      data: { status: 'INACTIVE' },
      include: includeUser,
    });

    await this.auditService.log({
      userId: actor.id,
      action: 'USER_DEACTIVATED',
      entity: 'User',
      entityId: id,
    });

    return this.formatUser(user);
  }
}
