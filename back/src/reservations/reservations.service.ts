import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Reservation, StatusReservation } from './model/reservations.model';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/model/users.model';
import { Livres } from 'src/livres/model/livres.model';
import { ReservationCreateDto } from './dto/reservationCreate.dto';
import { paginate, PaginationParams, SearchField } from 'src/utils/pagination';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationsRepository: Repository<Reservation>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Livres)
    private readonly livresRepository: Repository<Livres>,
  ) {}

  async createReservation(
    livreId: string,
    userId: string,
    dureePrevue: number = 21,
    joursAvantRecuperation: number = 4,
  ) {
    // Trouver le livre avec ses réservations existantes
    const livre = await this.livresRepository.findOne({
      where: { id: livreId },
      relations: ['reservations', 'reservations.user'],
    });
    if (!livre) {
      throw new BadRequestException('Livre non trouvé');
    }

    // Trouver l'utilisateur
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new BadRequestException('Utilisateur non trouvé');
    }

    // Vérifier si l'utilisateur a déjà une réservation pour ce livre
    const hasExistingReservation = livre.reservations.some(
      (res) =>
        res.user.id === userId &&
        (res.status === StatusReservation.EN_ATTENTE ||
          res.status === StatusReservation.ACTIVE),
    );
    if (hasExistingReservation) {
      return {
        message:
          'Vous avez déjà une réservation active ou en attente pour ce livre.',
        result: null,
      };
    }

    // Calculer la date de récupération prévue
    const dateRecuperationPrevue = new Date();
    dateRecuperationPrevue.setDate(
      dateRecuperationPrevue.getDate() + joursAvantRecuperation,
    );

    // Déterminer le statut et la position d'attente
    let status: StatusReservation;
    let positionAttente: number;

    if (livre.disponible) {
      status = StatusReservation.ACTIVE;
      positionAttente = 1; // Première position
    } else {
      status = StatusReservation.EN_ATTENTE;
      positionAttente = livre.reservations.length + 1; // Position suivante dans la file
    }

    // Créer la nouvelle réservation
    const newReservation = this.reservationsRepository.create({
      livre,
      user,
      status,
      position_attente: positionAttente,
      date_reservation: new Date(),
      date_recuperation_prevue: dateRecuperationPrevue,
      duree_prevue: dureePrevue, // Par exemple, 21 jours pour 3 semaines
    });

    // Sauvegarder la réservation
    const savedReservation =
      await this.reservationsRepository.save(newReservation);

    return {
      message: 'Création de la réservation réussie',
      result: savedReservation,
    };
  }

  async afficheReservation(params: PaginationParams, type: StatusReservation) {
    const searchFields: SearchField[] = [{ field: 'status', isEnum: true }];
    const where = type ? { status: type } : undefined;
    return paginate<Reservation>(
      this.reservationsRepository,
      params,
      searchFields,
      where,
    );
  }

  async afficheReservationSansFiltre() {
    const reservations = await this.reservationsRepository.find();
    return reservations;
  }
}
