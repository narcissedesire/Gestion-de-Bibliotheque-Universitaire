import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './model/users.model';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';

interface JwtPayload {
  id: string;
  email: string;
  type: string;
  iat?: number;
  exp?: number;
  aud?: string;
  iss?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfiguration.secret,
      audience: jwtConfiguration.signOptions.audience,
      issuer: jwtConfiguration.signOptions.issuer,
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.id) {
      throw new UnauthorizedException('Payload invalide');
    }
    const user = await this.userRepository.findOne({
      where: { id: payload.id },
    });
    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }
    return { id: user.id, email: user.email, type: user.type };
  }
}
