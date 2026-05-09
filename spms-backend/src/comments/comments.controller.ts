import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Permissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import type { RequestUser } from '../common/types/auth-user.type';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get('tasks/:taskId/comments')
  @Permissions('tasks:view', 'my-tasks:view')
  list(@Param('taskId') taskId: string) {
    return this.commentsService.list(taskId);
  }

  @Post('tasks/:taskId/comments')
  @Permissions('tasks:view', 'my-tasks:view')
  create(@Param('taskId') taskId: string, @Body() input: CreateCommentDto, @CurrentUser() user: RequestUser) {
    return this.commentsService.create(taskId, input, user);
  }

  @Patch('comments/:id')
  @Permissions('tasks:view', 'my-tasks:view')
  update(@Param('id') id: string, @Body() input: UpdateCommentDto, @CurrentUser() user: RequestUser) {
    return this.commentsService.update(id, input, user);
  }

  @Delete('comments/:id')
  @Permissions('tasks:view', 'my-tasks:view')
  delete(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.commentsService.delete(id, user);
  }
}
