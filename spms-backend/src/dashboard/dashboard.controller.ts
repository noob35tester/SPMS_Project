import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Permissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import type { RequestUser } from '../common/types/auth-user.type';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('summary')
  summary(@CurrentUser() user: RequestUser) {
    return this.dashboardService.summary(user);
  }

  @Get('super-admin')
  @Permissions('dashboard:super-admin')
  superAdmin(@CurrentUser() user: RequestUser) {
    return this.dashboardService.roleSummary('SUPER_ADMIN', user);
  }

  @Get('admin')
  @Permissions('dashboard:admin')
  admin(@CurrentUser() user: RequestUser) {
    return this.dashboardService.roleSummary('ADMIN', user);
  }

  @Get('hr')
  @Permissions('dashboard:hr')
  hr(@CurrentUser() user: RequestUser) {
    return this.dashboardService.roleSummary('HR', user);
  }

  @Get('manager')
  @Permissions('dashboard:manager')
  manager(@CurrentUser() user: RequestUser) {
    return this.dashboardService.roleSummary('MANAGER_TEAM_LEAD', user);
  }

  @Get('employee')
  @Permissions('dashboard:employee')
  employee(@CurrentUser() user: RequestUser) {
    return this.dashboardService.roleSummary('EMPLOYEE', user);
  }

  @Get('crm')
  @Permissions('dashboard:sales')
  crm(@CurrentUser() user: RequestUser) {
    return this.dashboardService.roleSummary('SALES_CRM', user);
  }

  @Get('recent-activity')
  @Permissions('reports:view', 'all-modules:view')
  recentActivity() {
    return this.dashboardService.recentActivity();
  }

  @Get('overdue-tasks')
  @Permissions('tasks:view', 'my-tasks:view')
  overdueTasks() {
    return this.dashboardService.overdueTasks();
  }
}
