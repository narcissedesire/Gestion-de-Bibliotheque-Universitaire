import { Livres } from 'src/livres/model/livres.model';
import { User } from 'src/users/model/users.model';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum statusType {
  EN_COURS = 'En cours',
  RETOURNE = 'Retourné',
  EN_RETARD = 'En retard',
}

@Entity()
export class Emprunts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date', nullable: false })
  date_emprunt: Date;

  @Column({ type: 'date', nullable: false })
  date_retour_prevue: Date;

  @Column({ type: 'date', nullable: true })
  date_retour_reelle: Date;

  @Column({ type: 'enum', enum: statusType, default: statusType.EN_COURS })
  status: statusType;

  @ManyToOne(() => Livres, (livre) => livre.emprunts, { onDelete: 'CASCADE' })
  livre: Livres;

  @ManyToOne(() => User, (user) => user.emprunts, { onDelete: 'CASCADE' })
  user: User;
}
