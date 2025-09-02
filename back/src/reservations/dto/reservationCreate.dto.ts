import { StatusReservation } from '../model/reservations.model';

export class ReservationCreateDto {
  id?: string;
  date_reservation?: Date;
  date_recuperation_prevue?: Date;
  duree_prevue?: number;
  status?: StatusReservation;
  position_attente?: number;
  createdAt?: Date;
  result?: any;
  message?: string;

  public constructor(
    id: string,
    date_reservation: Date,
    date_recuperation_prevue: Date,
    duree_prevue: number,
    status: StatusReservation,
    position_attente: number,
    createdAt: Date,
    message: string,
    result: any,
  ) {
    this.id = id;
    this.date_reservation = date_reservation;
    this.date_recuperation_prevue = date_recuperation_prevue;
    this.duree_prevue = duree_prevue;
    this.status = status;
    this.position_attente = position_attente;
    this.createdAt = createdAt;
    this.message = message;
    this.result = result;
  }
}
