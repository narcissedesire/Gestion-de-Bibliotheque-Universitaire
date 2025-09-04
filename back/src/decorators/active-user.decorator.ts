import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { typeUser } from 'src/users/model/users.model';

export const isPublic = 'isPublic';

// export const ActiveUser = createParamDecorator(
//   (feild: string | undefined, ctx: ExecutionContext) => {
//     const request = ctx.switchToHttp().getRequest();
//     console.log(request);
//     const user = request['user'];
//     return feild ? '' : user;
//   },
// );

export const ActiveUser = createParamDecorator(
  async (field: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = await ctx.switchToHttp().getRequest();
    const user = request['user'];
    if (!user) {
      throw new UnauthorizedException('Aucun utilisateur authentifié');
    }
    return field ? user[field] : user;
  },
);

interface JwtPayload {
  id: string;
  email: string;
  role: typeUser;
}

export const Public = () => SetMetadata(isPublic, true);

export const role = 'role';

export const DecorRole = (...roles: typeUser[]) => SetMetadata(role, roles);
