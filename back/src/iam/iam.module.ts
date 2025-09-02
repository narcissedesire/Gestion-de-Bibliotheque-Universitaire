import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigType } from '@nestjs/config';
import jwtConfig from 'src/config/jwt.config';
import { AccessTokenGuard } from './access-token/access-token.guard';
import { AuthorizationGuard } from './authorization/authorization.guard';
import { JwtStrategy } from 'src/users/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/model/users.model';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfig)],
      useFactory: async (jwtConfigService: ConfigType<typeof jwtConfig>) => ({
        secret: jwtConfigService.secret,
        signOptions: jwtConfigService.signOptions,
      }),
      inject: [jwtConfig.KEY],
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AccessTokenGuard, AuthorizationGuard, JwtStrategy],
  exports: [
    AccessTokenGuard,
    AuthorizationGuard,
    JwtModule,
    ConfigModule, // Export ConfigModule to make its dynamic providers (including the JWT config) available
  ],
})
export class IamModule {}
