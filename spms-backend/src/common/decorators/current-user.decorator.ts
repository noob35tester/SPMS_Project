import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { RequestUser } from '../types/auth-user.type';

type RequestWithUser = Request & { user?: RequestUser };

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): RequestUser => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    return request.user as RequestUser;
  },
);
