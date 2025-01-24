import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom decorator to get the user from the request object
 * @param data: string (optional) - Usage: @GetUser('id') userId: number
 * @param ctx: ExecutionContext
 */

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
