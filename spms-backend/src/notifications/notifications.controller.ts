import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Permissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import type { RequestUser } from '../common/types/auth-user.type';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('notifications:view')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  listMine(@CurrentUser() user: RequestUser) {
    return this.notificationsService.listMine(user);
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.notificationsService.markRead(id, user);
  }

  @Patch('read-all')
  markAllRead(@CurrentUser() user: RequestUser) {
    return this.notificationsService.markAllRead(user);
  }
}
