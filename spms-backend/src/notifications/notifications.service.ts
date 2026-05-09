import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { RequestUser } from '../common/types/auth-user.type';
import type { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(input: CreateNotificationDto) {
    return this.prisma.notification.create({ data: input });
  }

  async notifyUsers(userIds: Array<string | null | undefined>, input: Omit<CreateNotificationDto, 'userId'>) {
    const uniqueUserIds = [...new Set(userIds.filter(Boolean))] as string[];
    if (uniqueUserIds.length === 0) {
      return [];
    }

    return this.prisma.$transaction(
      uniqueUserIds.map((userId) =>
        this.prisma.notification.create({
          data: {
            ...input,
            userId,
          },
        }),
      ),
    );
  }

  async listMine(user: RequestUser) {
    return this.prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markRead(id: string, user: RequestUser) {
    return this.prisma.notification.updateMany({
      where: { id, userId: user.id },
      data: { isRead: true },
    });
  }

  async markAllRead(user: RequestUser) {
    return this.prisma.notification.updateMany({
      where: { userId: user.id, isRead: false },
      data: { isRead: true },
    });
  }
}
