import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import type { RequestUser } from '../common/types/auth-user.type';
import { CrmService } from './crm.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Controller('crm')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CrmController {
  constructor(private crmService: CrmService) {}

  @Get('leads')
  @Permissions('crm:leads:view')
  leads(@Query() query: PaginationQueryDto) {
    return this.crmService.leads(query);
  }

  @Post('leads')
  @Permissions('crm:leads:view')
  createLead(@Body() input: CreateLeadDto, @CurrentUser() user: RequestUser) {
    return this.crmService.createLead(input, user);
  }

  @Patch('leads/:id')
  @Permissions('crm:leads:view')
  updateLead(@Param('id') id: string, @Body() input: UpdateLeadDto, @CurrentUser() user: RequestUser) {
    return this.crmService.updateLead(id, input, user);
  }

  @Get('clients')
  @Permissions('crm:clients:view')
  clients() {
    return this.crmService.clients();
  }

  @Get('follow-ups')
  @Permissions('crm:followups:view')
  followUps() {
    return this.crmService.followUps();
  }
}
