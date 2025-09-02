import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './model/reservations.model';
import { User } from 'src/users/model/users.model';
import { IamModule } from 'src/iam/iam.module';
import { Livres } from 'src/livres/model/livres.model';

@Module({
  providers: [ReservationsService],
  controllers: [ReservationsController],
  exports: [ReservationsService],
  imports: [TypeOrmModule.forFeature([Reservation, User, Livres]), IamModule],
})
export class ReservationsModule {}
