import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { HrmsService } from './hrms.service';

@Controller('hrms')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class HrmsController {
  constructor(private hrmsService: HrmsService) {}

  @Get('employees')
  @Permissions('hrms:employees:view')
  employees(@Query() query: PaginationQueryDto) {
    return this.hrmsService.employees(query);
  }

  @Get('employees/:id')
  @Permissions('hrms:employees:view')
  employee(@Param('id') id: string) {
    return this.hrmsService.employee(id);
  }

  @Get('departments/headcount')
  @Permissions('hrms:employees:view', 'departments:view')
  headcount() {
    return this.hrmsService.headcount();
  }

  @Get('summary')
  @Permissions('hrms:view')
  summary() {
    return this.hrmsService.summary();
  }
}
