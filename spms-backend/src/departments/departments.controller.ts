import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Permissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import type { RequestUser } from '../common/types/auth-user.type';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Controller('departments')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('departments:view')
export class DepartmentsController {
  constructor(private departmentsService: DepartmentsService) {}

  @Get()
  list() {
    return this.departmentsService.list();
  }

  @Post()
  create(@Body() input: CreateDepartmentDto, @CurrentUser() user: RequestUser) {
    return this.departmentsService.create(input, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() input: UpdateDepartmentDto, @CurrentUser() user: RequestUser) {
    return this.departmentsService.update(id, input, user);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.departmentsService.delete(id, user);
  }
}
