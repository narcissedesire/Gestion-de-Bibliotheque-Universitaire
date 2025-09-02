import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { typeUser } from 'src/users/model/users.model';
import { role } from 'src/decorators/active-user.decorator';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctxRole = this.reflector.getAllAndOverride<typeUser[]>(role, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!ctxRole) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request['user'];
    if (!user || !user.type) {
      return false;
    }
    return ctxRole.some((role) => user.type === role);
  }
}
