import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamModule } from './iam/iam.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/model/users.model';
import { LivresModule } from './livres/livres.module';
import { EmpruntsModule } from './emprunts/emprunts.module';
import { ReservationsModule } from './reservations/reservations.module';
import { NotificationsModule } from './notifications/notifications.module';
import { Notification } from './notifications/model/notifications.model';
import { Emprunts } from './emprunts/model/emprunts.model';
import { Livres } from './livres/model/livres.model';
import { Reservation } from './reservations/model/reservations.model';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      username: process.env.DB_USERNAME,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5000,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Notification, Emprunts, Livres, Reservation],
      autoLoadEntities: true,
      synchronize: true,
    }),
    IamModule,
    UsersModule,
    LivresModule,
    EmpruntsModule,
    ReservationsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
