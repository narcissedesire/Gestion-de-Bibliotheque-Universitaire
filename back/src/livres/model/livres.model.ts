import { Emprunts } from 'src/emprunts/model/emprunts.model';
import { Reservation } from 'src/reservations/model/reservations.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum LivreGere {
  ROMAN = 'Roman',
  MANUEL = 'Manuel',
  REVUE = 'Revue',
  AUTRE = 'Autre',
}

@Entity()
export class Livres {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, nullable: false })
  titre: string;

  @Column({ length: 255, nullable: false })
  auteur: string;

  @Column({ type: 'int' })
  annee: number;

  @Column({ type: 'enum', enum: LivreGere, default: LivreGere.AUTRE })
  genre: LivreGere;

  @Column({ length: 100, nullable: true })
  sujet: string;

  @Column({ length: 50, nullable: true })
  periodicite: string;

  @Column({ type: 'boolean', default: true })
  disponible: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Emprunts, (emprunts) => emprunts.livre)
  emprunts: Emprunts[];

  @OneToMany(() => Reservation, (reservation) => reservation.livre)
  reservations: Reservation[];
}
