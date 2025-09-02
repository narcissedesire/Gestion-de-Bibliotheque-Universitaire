import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpruntsService } from './emprunts.service';
import { EmpruntsController } from './emprunts.controller'; // Créez si nécessaire
import { Emprunts } from './model/emprunts.model';
import { Reservation } from 'src/reservations/model/reservations.model';
import { User } from 'src/users/model/users.model';
import { Livres } from 'src/livres/model/livres.model';
import { IamModule } from 'src/iam/iam.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Emprunts, Reservation, User, Livres]),
    IamModule,
  ],
  providers: [EmpruntsService],
  controllers: [EmpruntsController],
  exports: [EmpruntsService],
})
export class EmpruntsModule {}
