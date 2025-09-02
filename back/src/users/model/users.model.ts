import { Emprunts } from 'src/emprunts/model/emprunts.model';
import { Notification } from 'src/notifications/model/notifications.model';
import { Reservation } from 'src/reservations/model/reservations.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum typeUser {
  ETUDIANT = 'Etudiant',
  PROFESSEUR = 'Professeur',
  ADMIN = 'Admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  nom: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  prenom: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 200 })
  motDePasse: string;

  @Column({
    type: 'enum',
    enum: typeUser,
    default: typeUser.ETUDIANT,
  })
  type: typeUser;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Emprunts, (emprunts) => emprunts.user)
  emprunts: Emprunts[];

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
