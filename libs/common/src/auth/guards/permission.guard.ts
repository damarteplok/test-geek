import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { User } from '../../users/models/user.entity';
import { Reflector } from '@nestjs/core';
import { RoutePayloadInterface } from '../../interfaces';
import { ROLES_KEY } from '../../decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const path = request.route.path;
    const method = request.method.toLowerCase();
    const permissionPayload: RoutePayloadInterface = {
      path,
      method,
    };

    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not found!');
    }

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (requiredPermissions) {
      const arr = user.role ?? [];
      const hasPermission = arr.some((role) =>
        requiredPermissions.includes(role.name),
      );
      if (!hasPermission) {
        throw new ForbiddenException(
          'You do not have permission to access this resource',
        );
      }
    }
    return this.checkIfUserHavePermission(user, permissionPayload);
  }

  checkIfUserHavePermission(
    user: User,
    permissionAgainst: RoutePayloadInterface,
  ) {
    const { path, method } = permissionAgainst;
    if (user.role && user.role.length > 0) {
      for (const role of user.role) {
        if (role.permission && role.permission.length > 0) {
          const hasPermission = role.permission.some(
            (permission) => {
              if (permission.path === '*') {
                return permission.method === method;
              } else {
                return permission.path === path && permission.method === method;
              }
            },
            // permission.method === method,
          );
          if (hasPermission) {
            return true;
          }
        }
      }
    }

    throw new ForbiddenException(
      'You do not have permission to access this resource',
    );
  }
}
