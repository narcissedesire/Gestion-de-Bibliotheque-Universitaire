import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    user: User,
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

    // Vérifier si l'utilisateur a déjà une réservation pour ce livre
    const hasExistingReservation = livre.reservations.some(
      (res) =>
        res.user.id === user.id &&
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
      const countReservations = livre.reservations.filter(
        (res) =>
          res.status === StatusReservation.EN_ATTENTE ||
          res.status === StatusReservation.ACTIVE,
      ).length;

      positionAttente = countReservations + 1;
    }

    // Créer la nouvelle réservation
    const newReservation = this.reservationsRepository.create({
      livre,
      user,
      status,
      position_attente: positionAttente,
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

  async annuleReservation(idLivre: string, user: User) {
    // Charger le livre avec ses réservations
    const livre = await this.livresRepository.findOne({
      where: { id: idLivre },
      relations: ['reservations', 'reservations.user'],
    });

    if (!livre) {
      throw new NotFoundException('Livre non trouvé');
    }

    // Trouver la réservation de cet utilisateur
    const reservation = livre.reservations.find(
      (res) =>
        res.user.id === user.id &&
        (res.status === StatusReservation.EN_ATTENTE ||
          res.status === StatusReservation.ACTIVE),
    );

    if (!reservation) {
      throw new NotFoundException(
        'Aucune réservation active/en attente trouvée pour cet utilisateur',
      );
    }

    // Sauvegarder l'ancienne position
    const oldPosition = reservation.position_attente;

    // Annuler la réservation
    reservation.status = StatusReservation.ANNULEE;
    await this.reservationsRepository.save(reservation);

    // Récupérer toutes les autres réservations EN_ATTENTE
    const reservationsToUpdate = livre.reservations.filter(
      (res) =>
        res.status === StatusReservation.EN_ATTENTE &&
        res.position_attente > oldPosition,
    );

    // Déplacer toutes celles qui sont derrière vers -1
    for (const res of reservationsToUpdate) {
      res.position_attente -= 1;
      await this.reservationsRepository.save(res);
    }

    return {
      message: 'Réservation annulée et file mise à jour',
      result: reservation,
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

  async reserveUser(user: User) {
    const reservation = await this.reservationsRepository.find({
      where: { user: { id: user.id } },
      relations: ['livre'],
    });
    return reservation;
  }
}
