import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ROLES_KEY } from '../const';

export const RolesParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request[ROLES_KEY];
  },
);
