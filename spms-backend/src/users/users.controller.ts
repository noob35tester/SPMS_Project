import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import type { RequestUser } from '../common/types/auth-user.type';
import { AssignRolesDto } from './dto/assign-roles.dto';
import { ChangeUserStatusDto } from './dto/change-user-status.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Permissions('users-roles:view')
  list(@Query() query: PaginationQueryDto) {
    return this.usersService.list(query);
  }

  @Get(':id')
  @Permissions('users-roles:view')
  detail(@Param('id') id: string) {
    return this.usersService.detail(id);
  }

  @Post()
  @Permissions('users:create')
  create(@Body() input: CreateUserDto, @CurrentUser() user: RequestUser) {
    return this.usersService.create(input, user);
  }

  @Patch(':id')
  @Permissions('users:create')
  update(@Param('id') id: string, @Body() input: UpdateUserDto, @CurrentUser() user: RequestUser) {
    return this.usersService.update(id, input, user);
  }

  @Patch(':id/status')
  @Permissions('users:create')
  changeStatus(@Param('id') id: string, @Body() input: ChangeUserStatusDto, @CurrentUser() user: RequestUser) {
    return this.usersService.changeStatus(id, input, user);
  }

  @Post(':id/roles')
  @Permissions('users:create')
  assignRoles(@Param('id') id: string, @Body() input: AssignRolesDto, @CurrentUser() user: RequestUser) {
    return this.usersService.assignRoles(id, input, user);
  }

  @Delete(':id')
  @Permissions('users:create')
  softDeactivate(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.usersService.softDeactivate(id, user);
  }
}
