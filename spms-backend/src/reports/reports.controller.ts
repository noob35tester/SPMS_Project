import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Permissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { ReportQueryDto } from './dto/report-query.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('tasks')
  @Permissions('reports:view')
  tasks(@Query() query: ReportQueryDto) {
    return this.reportsService.tasks(query);
  }

  @Get('projects')
  @Permissions('reports:view')
  projects(@Query() query: ReportQueryDto) {
    return this.reportsService.projects(query);
  }

  @Get('hr')
  @Permissions('reports:hr:view', 'reports:view')
  hr(@Query() query: ReportQueryDto) {
    return this.reportsService.hr(query);
  }

  @Get('sales')
  @Permissions('reports:sales:view', 'reports:view')
  sales(@Query() query: ReportQueryDto) {
    return this.reportsService.sales(query);
  }
}
