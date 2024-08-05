import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { User } from '../../users/models/user.entity';
import { RoutePayloadInterface } from '@app/common';

@Injectable()
export class PermissionsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const path = request.route.path;
    const method = request.method.toLowerCase();
    const permissionPayload: RoutePayloadInterface = {
      path,
      method,
    };
    return this.checkIfUserHavePermission(request.user, permissionPayload);
  }

  checkIfUserHavePermission(
    user: User,
    permissionAgainst: RoutePayloadInterface,
  ) {
    console.log(user);
    const { path, method } = permissionAgainst;
    if (user && user.role && user.role.permission) {
      return user.role.permission.some(
        (route) => route.path === path && route.method === method,
      );
    }

    throw new ForbiddenException(
      'You do not have permission to access this resource',
    );
  }
}
