import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { USER_KEY } from '../const';

export const UserParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request[USER_KEY];
  },
);
