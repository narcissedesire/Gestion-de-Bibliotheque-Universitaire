import { Livres } from 'src/livres/model/livres.model';
import { User } from 'src/users/model/users.model';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

export enum StatusReservation {
  EN_ATTENTE = 'En attente',
  ACTIVE = 'Active',
  ANNULEE = 'Annulée',
}

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date', nullable: true }) // Date à laquelle l'utilisateur prévoit de récupérer
  date_recuperation_prevue: Date;

  @Column({ type: 'int', nullable: true }) // Durée en jours (ex. : 21 pour 3 semaines)
  duree_prevue: number;

  @Column({
    type: 'enum',
    enum: StatusReservation,
    default: StatusReservation.ACTIVE,
  })
  status: StatusReservation;

  @Column({ type: 'int', default: 1 })
  position_attente: number;

  @CreateDateColumn()
  date_reservation: Date;

  @ManyToOne(() => User, (user) => user.reservations, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Livres, (livre) => livre.reservations, {
    onDelete: 'CASCADE',
  })
  livre: Livres;
}
