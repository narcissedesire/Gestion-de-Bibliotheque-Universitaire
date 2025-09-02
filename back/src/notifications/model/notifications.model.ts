import { User } from 'src/users/model/users.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum typeNotification {
  EMAIL = 'Email',
  SMS = 'SMS',
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'text', nullable: false })
  message: string;

  @Column({
    type: 'enum',
    enum: typeNotification,
    default: typeNotification.EMAIL,
  })
  type: typeNotification;

  @Column({ type: 'boolean', default: false })
  envoye: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
