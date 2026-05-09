import { Controller, Get, UseGuards } from '@nestjs/common';
import { Permissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RolesService } from './roles.service';

@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('users-roles:view')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Get()
  list() {
    return this.rolesService.list();
  }

  @Get('permissions')
  permissions() {
    return this.rolesService.permissions();
  }
}
