import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { UsersService } from '../../src/users/users.service';
import { AuthService } from '../../src/auth/auth.service';
import { AUTH_TOKEN_KEY, IS_PUBLIC_KEY, USER_KEY } from '../const';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    try {
      const request: Request = context.switchToHttp().getRequest();
      const token = request.cookies[AUTH_TOKEN_KEY];
      const userId = this.authService.getUserIdFromToken(token);
      return new Promise((resolve) => {
        this.usersService
          .findById(userId)
          .then((user) => {
            request[USER_KEY] = user;

            resolve(true);
          })
          .catch(() => resolve(isPublic));
      });
    } catch {
      return isPublic;
    }
  }
}
