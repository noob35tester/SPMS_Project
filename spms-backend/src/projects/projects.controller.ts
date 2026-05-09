import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import type { RequestUser } from '../common/types/auth-user.type';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectMemberDto } from './dto/project-member.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  @Permissions('projects:view', 'my-projects:view')
  list(@Query() query: PaginationQueryDto, @CurrentUser() user: RequestUser) {
    return this.projectsService.list(query, user);
  }

  @Get(':id')
  @Permissions('projects:view', 'my-projects:view')
  detail(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.projectsService.detail(id, user);
  }

  @Post()
  @Permissions('projects:view')
  create(@Body() input: CreateProjectDto, @CurrentUser() user: RequestUser) {
    return this.projectsService.create(input, user);
  }

  @Patch(':id')
  @Permissions('projects:view')
  update(@Param('id') id: string, @Body() input: UpdateProjectDto, @CurrentUser() user: RequestUser) {
    return this.projectsService.update(id, input, user);
  }

  @Delete(':id')
  @Permissions('projects:view')
  archive(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.projectsService.archive(id, user);
  }

  @Post(':id/members')
  @Permissions('projects:view')
  addMember(@Param('id') id: string, @Body() input: ProjectMemberDto, @CurrentUser() user: RequestUser) {
    return this.projectsService.addMember(id, input, user);
  }

  @Delete(':id/members/:userId')
  @Permissions('projects:view')
  removeMember(@Param('id') id: string, @Param('userId') userId: string, @CurrentUser() user: RequestUser) {
    return this.projectsService.removeMember(id, userId, user);
  }
}
